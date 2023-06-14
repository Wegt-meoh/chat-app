"use client";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
    initialUnseenFriendRequestsCount: number;
    sessionId: string;
};

export default function FriendRequestSideBarOptions({
    initialUnseenFriendRequestsCount,
    sessionId,
}: Props) {
    const [unHandleRequestCount, setUnHandleRequestCount] = useState(
        initialUnseenFriendRequestsCount
    );

    const router = useRouter();

    useEffect(() => {
        function incomingFriendRequest() {
            console.log("incomingFriendRequest");
            setUnHandleRequestCount((a) => a + 1);
            router.refresh();
        }
        function acceptOrDenyFriendReqest() {
            console.log("acceptFriendReqest");
            setUnHandleRequestCount((a) => a - 1);
            router.refresh();
        }

        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_requests`)
        );
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

        pusherClient.bind("newFriend", acceptOrDenyFriendReqest);
        pusherClient.bind("deny", acceptOrDenyFriendReqest);
        pusherClient.bind("incoming_friend_requests", incomingFriendRequest);

        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`user:${sessionId}:incoming_friend_requests`)
            );
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

            pusherClient.unbind("deny", acceptOrDenyFriendReqest);
            pusherClient.unbind("newFriend", acceptOrDenyFriendReqest);
            pusherClient.unbind(
                "incoming_friend_requests",
                incomingFriendRequest
            );
        };
    }, [sessionId, router]);

    return (
        <Link
            href={"/dashboard/requests"}
            className=" text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center group gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
        >
            <div className=" text-gray-400 border-gray-200 group-hover:text-indigo-600 group-hover:border-indigo-600 flex items-center w-6 h-6 shrink-0 justify-center rounded-md border text-[0.625rem] font-medium bg-white">
                <User className="w-4 h-4" />
            </div>
            <span className=" truncate">Friend Requests</span>
            {unHandleRequestCount > 0 ? (
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white bg-indigo-600">
                    {unHandleRequestCount}
                </div>
            ) : null}
        </Link>
    );
}
