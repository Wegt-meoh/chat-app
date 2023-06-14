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

    const incomingRequestIds = (await fetchRedis(
        "smembers",
        `user:${session.user.id}:incoming_friend_requests`
    )) as string[];

    const incomingRequests = await Promise.all(
        incomingRequestIds.map(async (id) => {
            const senderInfo = JSON.parse(
                await fetchRedis("get", `user:${id}`)
            ) as User;

            return {
                senderId: senderInfo.id,
                senderEmail: senderInfo.email,
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
