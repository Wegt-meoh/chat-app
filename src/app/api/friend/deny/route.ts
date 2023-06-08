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

    await Promise.all([
      db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd),
      pusherServer.trigger(
        toPusherKey(`user:${session.user.id}:friends`),
        "deny",
        {}
      ),
    ]);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    console.log(error);
    return new Response("Invalid request", { status: 400 });
  }
}
