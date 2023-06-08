import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { messageValidator } from "@/lib/validations/message";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const body: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthrized", { status: 401 });
    }

    const friendIds: string[] = await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`
    );

    const isFriend = friendIds.includes(body.chatId);
    if (!isFriend) {
      throw new Response("Unauthoried", { status: 401 });
    }

    const timestamp = Date.now();
    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      receiverId: body.chatId,
      text: body.text,
      timestamp: timestamp,
    };
    const message = messageValidator.parse(messageData);

    await Promise.all([
      db.zadd(
        `chat:${chatHrefConstructor(session.user.id, body.chatId)}:messages`,
        {
          score: timestamp,
          member: JSON.stringify(message),
        }
      ),
      pusherServer.triggerBatch([
        {
          channel: toPusherKey(
            `chat:${chatHrefConstructor(session.user.id, body.chatId)}:messages`
          ),
          name: "chat",
          data: {
            ...message,
          },
        },
        {
          channel: toPusherKey(`receiver:${body.chatId}:newMessage`),
          name: "message_coming",
          data: {
            ...message,
            senderImg: session.user.image,
            senderName: session.user.name,
          },
        },
      ]),
    ]);

    return new Response("OK");
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}
