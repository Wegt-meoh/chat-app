"use client";
import { pusherClient } from "@/lib/pusher-client";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
    incomingFriendRequests: IncomingFriendRequest[];
    sessionId: string;
};

export default function FriendRequests({
    incomingFriendRequests,
    sessionId,
}: Props) {
    const friendRequests = incomingFriendRequests;
    // const [friendRequests, setFriendRequests] = useState(
    //     incomingFriendRequests
    // );

    async function acceptFriend(senderId: string) {
        await axios.post("/api/friend/accept", { senderId });
        // setFriendRequests((prev) =>
        //     prev.filter((item) => item.senderId !== senderId)
        // );
    }

    async function denyFriend(senderId: string) {
        await axios.post("/api/friend/deny", { senderId });
        // setFriendRequests((prev) =>
        //     prev.filter((item) => item.senderId !== senderId)
        // );
    }

    // useEffect(() => {
    //     const channel = pusherClient.subscribe(
    //         toPusherKey(`user:${sessionId}:incoming_friend_requests:details`)
    //     );
    //     channel.bind("added", (friendRequest: IncomingFriendRequest) => {
    //         setFriendRequests((prev) => [friendRequest, ...prev]);
    //     });
    //     return () => {
    //         channel.unsubscribe();
    //         channel.unbind_all();
    //     };
    // }, [sessionId]);

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
