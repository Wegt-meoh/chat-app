import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher-server";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

// send friend request
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email: emailToAdd } = addFriendValidator.parse(body.email);

        // check
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

        const isRequestSended = (await fetchRedis(
            "sismember",
            `user:${idToAdd}:incoming_friend_requests`,
            session.user.id
        )) as 0 | 1;
        if (isRequestSended) {
            return new Response("the friend request has been sent", {
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

        // check succ
        const friendRequest: FriendRequest = {
            senderId: session.user.id,
            senderName: session.user.name,
            senderEmail: session.user.email,
        };
        const friendRequestPusherData: IncomingFriendRequest = {
            ...friendRequest,
        };

        await db.sadd(
            `user:${idToAdd}:incoming_friend_requests`,
            session.user.id
        );
        await Promise.all([
            pusherServer.triggerBatch([
                // {
                //     channel: toPusherKey(
                //         `user:${idToAdd}:incoming_friend_requests:details`
                //     ),
                //     name: "added",
                //     data: friendRequestPusherData,
                // },
                {
                    channel: toPusherKey(
                        `user:${idToAdd}:incoming_friend_requests:count`
                    ),
                    name: "added",
                    data: {},
                },
            ]),
        ]);

        return new Response("OK");
    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid request payload", { status: 422 });
        }

        return new Response("Invalid request", { status: 400 });
    }
}
