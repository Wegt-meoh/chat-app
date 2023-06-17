"use client";
import { cn, formatTimestamp } from "@/lib/utils";

type Props = {
    timestamp: number;
    isCurrentUser: boolean;
};

export default function Timestamp({ timestamp, isCurrentUser }: Props) {
    return (
        <span
            className={cn("text-xs text-gray-400 flex-shrink-0", {
                "order-3": isCurrentUser,
                "order-1": !isCurrentUser,
            })}
        >
            {formatTimestamp(timestamp)}
        </span>
    );
}
