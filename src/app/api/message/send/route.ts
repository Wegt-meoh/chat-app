import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher-server";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { messageValidator } from "@/lib/validations/message";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
    try {
        const body: { text: string; chatId: string; timestamp: number } =
            await req.json();
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("Unauthrized", { status: 401 });
        }
        const sender = session.user;
        const receiverId = body.chatId;

        const friendIds: string[] = await fetchRedis(
            "smembers",
            `user:${sender.id}:friends`
        );

        const isFriend = friendIds.includes(receiverId);
        if (!isFriend) {
            throw new Response("Unauthoried", { status: 401 });
        }

        const message = messageValidator.parse({
            id: nanoid(),
            senderId: sender.id,
            receiverId: receiverId,
            text: body.text,
            timestamp: body.timestamp,
        });

        await Promise.all([
            db.zadd(
                `chat:${chatHrefConstructor(sender.id, receiverId)}:messages`,
                {
                    score: body.timestamp,
                    member: JSON.stringify(message),
                }
            ),
            pusherServer.triggerBatch([
                {
                    channel: toPusherKey(`reciever:${receiverId}:message`),
                    name: "added",
                    data: message,
                },
                {
                    channel: toPusherKey(
                        `chat:${chatHrefConstructor(
                            sender.id,
                            receiverId
                        )}:messages`
                    ),
                    name: "added",
                    data: message,
                },
            ]),
        ]);

        return new Response("OK");
    } catch (error) {
        return new Response("Internal server error", { status: 500 });
    }
}
