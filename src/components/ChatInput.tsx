"use client";

import React, { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./ui/Button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Icons } from "./Icons";

type Props = {
    chatId: string;
};

export default function ChatInput({ chatId }: Props) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [input, setInput] = useState("");

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (!isFocus && e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                textareaRef.current?.focus();
            }
        };
        window.addEventListener("keypress", listener);

        return () => {
            window.removeEventListener("keypress", listener);
        };
    }, [isFocus]);

    async function sendMessage() {
        if (input.length === 0) {
            return;
        }
        setIsLoading(true);
        try {
            await axios.post("/api/message/send", {
                text: input,
                chatId: chatId,
                timestamp: new Date(),
            });
            setInput("");
            textareaRef.current?.focus();
        } catch {
            toast.error("Something went wrong, please try again later");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="px-4 py-2 mb-2 sm:mb-0 flex items-end gap-2 justify-between">
            <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                <TextareaAutosize
                    maxLength={400}
                    maxRows={16}
                    ref={textareaRef}
                    value={input}
                    onFocus={() => {
                        setIsFocus(true);
                    }}
                    onBlur={() => {
                        setIsFocus(false);
                    }}
                    onChange={(e) => setInput(e.target.value)}
                    rows={1}
                    placeholder={"(Shift + Enter to send message)"}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6 scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded"
                />
            </div>
            <Button
                disabled={input.length === 0}
                title="send message"
                isLoading={isLoading}
                onClick={sendMessage}
                variant={"ghost"}
                size={"sm"}
                className="bg-indigo-600 hover:bg-indigo-500"
                type="submit"
            >
                {isLoading ? null : (
                    <Icons.Logo className="text-white h-6 w-auto" />
                )}
            </Button>
        </div>
    );
}
