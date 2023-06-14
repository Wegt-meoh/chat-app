"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";

type Props = { initialFriends: User[]; sessionId: string };

type ExtendMessage = Message & {
    senderImg: string;
    senderName: string;
};

export default function SidebarChatList({ initialFriends, sessionId }: Props) {
    const [friends, setFriends] = useState(initialFriends);
    const pathname = usePathname();
    const [unseenMessages, setUnseenMessages] = useState<ExtendMessage[]>([]);
    const router = useRouter();

    useEffect(() => {
        function handleAcceptFriendRequest(newFriend: User) {
            console.log("new friend", newFriend);
            setFriends((prev) => [...prev, newFriend].sort());
            router.refresh();
        }

        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));
        pusherClient.bind("newFriend", handleAcceptFriendRequest);

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
            pusherClient.unbind("newFriend", handleAcceptFriendRequest);
        };
    }, [sessionId, router]);

    useEffect(() => {
        function handleMessageComing(msg: ExtendMessage) {
            console.log("handleMessageComing");
            const shouldNotify = pathname !== `/dashboard/chat/${msg.senderId}`;
            if (!shouldNotify) return;
            toast.custom((t) => {
                return (
                    <UnseenChatToast
                        t={t}
                        chatId={msg.senderId}
                        senderImage={msg.senderImg}
                        senderName={msg.senderName}
                        senderMsg={msg.text}
                    />
                );
            });

            setUnseenMessages((prev) => [...prev, msg]);
            router.refresh();
        }

        pusherClient.subscribe(toPusherKey(`receiver:${sessionId}:newMessage`));
        pusherClient.bind("message_coming", handleMessageComing);

        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`receiver:${sessionId}:newMessage`)
            );
            pusherClient.unbind("message_coming", handleMessageComing);
        };
    }, [pathname, sessionId, router]);

    useEffect(() => {
        if (pathname?.includes("chat")) {
            setUnseenMessages((prev) => {
                return prev.filter((msg) => !pathname.includes(msg.senderId));
            });
        }
    }, [pathname]);
    return (
        <ul
            role="list"
            className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1"
        >
            {friends.sort().map((friend) => {
                const unseenMsgCount = unseenMessages.filter((msg) => {
                    return msg.senderId === friend.id;
                }).length;
                return (
                    <li key={friend.id}>
                        <a
                            className="flex gap-x-2 items-center text-gray-500 hover:bg-gray-50 p-2 group hover:text-indigo-600 rounded-md text-sm leading-6 font-semibold "
                            href={"/dashboard/chat/" + friend.id}
                        >
                            {friend.name}
                            {unseenMsgCount > 0 ? (
                                <span className="flex items-center justify-center w-4 h-4 bg-indigo-600 text-white text-xs font-medium rounded-full">
                                    {unseenMsgCount}
                                </span>
                            ) : null}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}
