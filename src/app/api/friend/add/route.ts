import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email: emailToAdd } = addFriendValidator.parse(body.email);

        const idToAdd = (await fetchRedis(
            "get",
            `user:email:${emailToAdd}`
        )) as string | null;

        if (!idToAdd) {
            return new Response("This email does not exist", { status: 400 });
        }

        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        if (idToAdd === session.user.id) {
            return new Response("you can not add yourself as a friend", {
                status: 400,
            });
        }

        const isFriendAdded = (await fetchRedis(
            "sismember",
            `user:${idToAdd}:incoming_friend_requests`,
            session.user.id
        )) as 0 | 1;
        if (isFriendAdded) {
            return new Response("this user is already added", {
                status: 400,
            });
        }

        const isAlreadyFriend = (await fetchRedis(
            "sismember",
            `user:${session.user.id}:friends`,
            idToAdd
        )) as 0 | 1;
        if (isAlreadyFriend) {
            return new Response("this user is already in friends list", {
                status: 400,
            });
        }

        await Promise.all([
            db.sadd(
                `user:${idToAdd}:incoming_friend_requests`,
                session.user.id
            ),
            pusherServer.trigger(
                toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
                "incoming_friend_requests",
                {
                    senderId: session.user.id,
                    senderEmail: session.user.email,
                }
            ),
        ]);

        return new Response("OK");
    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid request payload", { status: 422 });
        }

        return new Response("Invalid request", { status: 400 });
    }
}
