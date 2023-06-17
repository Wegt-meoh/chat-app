import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

type Props = {};

export default async function Page({}: Props) {
    const session = await getServerSession(authOptions);
    if (!session) notFound();

    const friendRequestSenderIdList = (await fetchRedis(
        "smembers",
        `user:${session.user.id}:incoming_friend_requests`
    )) as string[];

    const incomingRequests: FriendRequest[] = await Promise.all(
        friendRequestSenderIdList.map(async (id) => {
            const user: User = JSON.parse(
                await fetchRedis("get", `user:${id}`)
            );
            return {
                senderId: user.id,
                senderName: user.name,
                senderEmail: user.email,
            };
        })
    );

    return (
        <main>
            <h1 className=" text-5xl font-bold mb-8">Friend Requests</h1>
            <div className="flex flex-col gap-4">
                <FriendRequests
                    incomingFriendRequests={incomingRequests}
                    sessionId={session.user.id}
                />
            </div>
        </main>
    );
}
