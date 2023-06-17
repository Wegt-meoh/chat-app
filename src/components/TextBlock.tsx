import { cn } from "@/lib/utils";

type Props = {
    isCurrentUser: boolean;
    needShowProfilePicture: boolean;
    text: string;
};

export function TextBlock({
    isCurrentUser,
    needShowProfilePicture,
    text,
}: Props) {
    return (
        <div
            className={cn("px-4 py-2 text-white rounded-lg order-2 max-w-xs", {
                "bg-indigo-600": isCurrentUser,
                "bg-gray-400": !isCurrentUser,
                "rounded-bl-none": isCurrentUser && needShowProfilePicture,
                "rounded-br-none": !isCurrentUser && needShowProfilePicture,
            })}
        >
            {text}{" "}
        </div>
    );
}
