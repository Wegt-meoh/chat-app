"use client";
import { pusherClient } from "@/lib/pusher-client";
import { toPusherKey } from "@/lib/utils";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
    initialFriendRequestCount: number;
    sessionId: string;
};

export default function FriendRequestSideBarOption({
    initialFriendRequestCount,
    sessionId,
}: Props) {
    const router = useRouter();
    const unHandleRequestCount = initialFriendRequestCount;

    useEffect(() => {
        const channek = pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_requests:count`)
        );
        channek.bind("added", () => {
            router.refresh();
        });
        channek.bind("deny", () => {
            router.refresh();
        });
        channek.bind("accept", () => {
            router.refresh();
            console.log("accept");
        });
        return () => {
            channek.unsubscribe();
            channek.unbind_all();
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
