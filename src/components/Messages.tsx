"use client";
import { chatHrefConstructor, cn, toPusherKey } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import UserImage from "./UserImage";
import { TextBlock } from "./TextBlock";
import Timestamp from "./Timestamp";
import { pusherClient } from "@/lib/pusher";

type Props = {
    chatId: string;
    chatPartner: User;
    sessionImg: string;
    sessionId: string;
    initialMessages: Message[];
};

export default function Messages({
    initialMessages,
    sessionId,
    sessionImg,
    chatPartner,
}: Props) {
    const [messages, setMessages] = useState(initialMessages);
    const scrollDownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleChat(msg: Message) {
            setMessages((prev) => [msg, ...prev]);
        }

        pusherClient.subscribe(
            toPusherKey(
                `chat:${chatHrefConstructor(
                    sessionId,
                    chatPartner.id
                )}:messages`
            )
        );
        pusherClient.bind("chat", handleChat);
        return () => {
            pusherClient.unsubscribe(
                toPusherKey(
                    `chat:${chatHrefConstructor(
                        sessionId,
                        chatPartner.id
                    )}:messages`
                )
            );
            pusherClient.unbind("chat", handleChat);
        };
    }, [chatPartner, sessionId]);

    return (
        <div
            id="messages"
            className="flex h-full flex-col-reverse gap-4 overflow-y-auto p-3 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded"
        >
            <div ref={scrollDownRef} />

            {messages.map((msg, index) => {
                const isCurrentUser = msg.senderId === sessionId;
                const needShowProfilePicture =
                    messages[index - 1]?.senderId !== messages[index].senderId;
                return (
                    <div
                        key={msg.id + "-" + msg.timestamp}
                        className="chat-message"
                    >
                        <div
                            className={cn("flex items-end gap-2", {
                                "justify-end": !isCurrentUser,
                            })}
                        >
                            <UserImage
                                isCurrentUser={isCurrentUser}
                                needShowProfilePicture={needShowProfilePicture}
                                sessionImg={sessionImg}
                                charPartnerImg={chatPartner.image}
                            />
                            <TextBlock
                                isCurrentUser={isCurrentUser}
                                needShowProfilePicture={needShowProfilePicture}
                                text={msg.text}
                            />
                            <Timestamp
                                timestamp={msg.timestamp}
                                isCurrentUser={isCurrentUser}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
