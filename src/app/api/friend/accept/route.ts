import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { senderId: idToAdd } = z
      .object({ senderId: z.string() })
      .parse(body);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthrized", { status: 401 });
    }

    const isAlreadyFriend = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriend) {
      return new Response("Is already friend", { status: 400 });
    }

    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 });
    }

    //notifying accept friend request both sender and receiver
    const friendResult = (await fetchRedis("get", `user:${idToAdd}`)) as string;
    const friend = JSON.parse(friendResult) as User;

    await Promise.all([
      db.sadd(`user:${session.user.id}:friends`, idToAdd),
      db.sadd(`user:${idToAdd}:friends`, session.user.id),
      db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd),
      pusherServer.triggerBatch([
        {
          channel: toPusherKey(`user:${idToAdd}:friends`),
          name: "newFriend",
          data: {
            ...session.user,
          },
        },
        {
          channel: toPusherKey(`user:${session.user.id}:friends`),
          name: "newFriend",
          data: {
            ...friend,
          },
        },
      ]),
    ]);
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
