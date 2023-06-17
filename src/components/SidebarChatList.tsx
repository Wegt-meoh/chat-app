"use client";

import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";
import Link from "next/link";
import { pusherClient } from "@/lib/pusher-client";

type Props = { initialFriends: User[]; sessionId: string };

export default function SidebarChatList({ initialFriends, sessionId }: Props) {
    const friends = initialFriends;
    // const [friends, setFriends] = useState(initialFriends);
    const pathname = usePathname();
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

    // useEffect(() => {
    //     // subscribe new friend added
    //     const channel = pusherClient.subscribe(
    //         toPusherKey(`user:${sessionId}:friends`)
    //     );
    //     channel.bind("added", (newFriend: User) => {
    //         console.log("friend added");
    //         console.log(newFriend);
    //         setFriends((prev) => [...prev, newFriend].sort());
    //     });

    //     return () => {
    //         channel.unsubscribe();
    //         channel.unbind_all();
    //     };
    // }, [sessionId]);

    useEffect(() => {
        // subscribe new message recieve
        const channel = pusherClient.subscribe(
            toPusherKey(`reciever:${sessionId}:message`)
        );
        channel.bind("added", (msg: Message) => {
            if (pathname?.startsWith(`/dashboard/chat/${msg.senderId}`)) {
                return;
            }
            setUnseenMessages((prev) => [msg, ...prev]);
            let index = friends.map((f) => f.id).indexOf(msg.senderId);
            if (index !== -1) {
                toast.custom((t) => {
                    const f = friends[index];
                    return (
                        <UnseenChatToast
                            t={t}
                            chatId={f.id}
                            senderImage={f.image}
                            senderName={f.name}
                            senderMsg={msg.text}
                        />
                    );
                });
            } else {
                throw new Error("can not find friend in friend list");
            }
        });

        return () => {
            channel.unsubscribe();
            channel.unbind_all();
        };
    }, [sessionId, pathname, friends]);

    useEffect(() => {
        // clear read messages
        if (pathname?.startsWith(`/dashboard/chat`)) {
            setUnseenMessages((prev) =>
                prev.filter((msg) => !pathname.includes(msg.senderId))
            );
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
                            title="chat"
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
