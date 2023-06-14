"use client";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
    incomingFriendRequests: IncomingFriendRequest[];
    sessionId: string;
};

export default function FriendRequests({
    incomingFriendRequests,
    sessionId,
}: Props) {
    const router = useRouter();
    const [friendRequests, setFriendRequests] = useState(
        incomingFriendRequests
    );

    async function acceptFriend(senderId: string) {
        await axios.post("/api/friend/accept", { senderId });

        setFriendRequests((prev) =>
            prev.filter((item) => item.senderId !== senderId)
        );

        router.refresh();
    }

    async function denyFriend(senderId: string) {
        await axios.post("/api/friend/deny", { senderId });

        setFriendRequests((prev) =>
            prev.filter((item) => item.senderId !== senderId)
        );

        router.refresh();
    }

    useEffect(() => {
        function friendRequestHandler({
            senderId,
            senderEmail,
        }: IncomingFriendRequest) {
            setFriendRequests((prev) => [{ senderEmail, senderId }, ...prev]);
            router.refresh();
        }
        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_requests`)
        );
        pusherClient.bind("incoming_friend_requests", friendRequestHandler);

        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`user:${sessionId}:incoming_friend_requests`)
            );
            pusherClient.unbind(
                "incoming_friend_requests",
                friendRequestHandler
            );
        };
    }, [sessionId, router]);

    return (
        <>
            {friendRequests.length === 0 ? (
                <p className=" text-sm text-zinc-500">
                    No friend requests now...
                </p>
            ) : (
                friendRequests.map((request) => {
                    return (
                        <div
                            key={request.senderId}
                            className="flex gap-4 items-center"
                        >
                            <UserPlus className=" text-black" />
                            <p className="font-medium text-lg">
                                {request.senderEmail}
                            </p>
                            <button
                                onClick={() => acceptFriend(request.senderId)}
                                aria-label="accept friend"
                                className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
                            >
                                <Check className="font-semibold text-white w-3/4 h-3/4" />
                            </button>
                            <button
                                onClick={() => denyFriend(request.senderId)}
                                aria-label="deny friend"
                                className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
                            >
                                <X className="font-semibold text-white w-3/4 h-3/4" />
                            </button>
                        </div>
                    );
                })
            )}
        </>
    );
}
