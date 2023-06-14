import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatHrefConstructor } from "@/lib/utils";
import { messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
    params: { chatId: string };
};

async function getChatMessage(userId: string, partnerId: string) {
    try {
        const result: string[] = await fetchRedis(
            "zrange",
            `chat:${chatHrefConstructor(userId, partnerId)}:messages`,
            0,
            -1
        );

        const dbMessages = result.map(
            (message) => JSON.parse(message) as Message
        );
        const reversedDbMessages = dbMessages.reverse();
        const messages: Message[] =
            messageArrayValidator.parse(reversedDbMessages);
        return messages;
    } catch (error) {
        notFound();
    }
}

export default async function Page({ params }: Props) {
    const { chatId } = params;
    const session = await getServerSession(authOptions);

    if (!session) notFound();
    const { user } = session;
    const chatPartner = (await db.get(`user:${chatId}`)) as User;
    const initialMessages = await getChatMessage(user.id, chatId);
    return (
        <div className="flex-1 justify-between flex flex-col h-screen">
            <div className="border-gray-200 border-b-2 flex items-center gap-2 py-2 px-1">
                <div className="relative w-10 h-10">
                    <Image
                        fill
                        sizes="32px"
                        referrerPolicy="no-referrer"
                        className="rounded-full"
                        src={chatPartner.image}
                        alt={chatPartner.name + " profile picture"}
                    />
                </div>

                <div className="flex flex-col justify-between">
                    <div className="font-semibold text-xl text-zinc-800">
                        {chatPartner.name}
                    </div>
                    <span className="font-normal text-sm text-zinc-400">
                        {chatPartner.email}
                    </span>
                </div>
            </div>
            <Messages
                chatId={chatId}
                chatPartner={chatPartner}
                sessionImg={session.user.image ?? ""}
                sessionId={session.user.id}
                initialMessages={initialMessages}
            />
            <ChatInput chatId={chatId} chatPartner={chatPartner} />
        </div>
    );
}
