import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
    isCurrentUser: boolean;
    needShowProfilePicture: boolean;
    sessionImg: string;
    charPartnerImg: string;
};

export default function UserImage({
    isCurrentUser,
    needShowProfilePicture,
    sessionImg,
    charPartnerImg,
}: Props) {
    return (
        <div
            className={cn("relative w-8 h-8 flex-shrink-0", {
                "order-1": isCurrentUser,
                "order-3": !isCurrentUser,
            })}
        >
            {needShowProfilePicture ? (
                <Image
                    fill
                    sizes="32px"
                    className="rounded-full"
                    referrerPolicy="no-referrer"
                    src={isCurrentUser ? sessionImg : charPartnerImg}
                    alt="user profile picture"
                />
            ) : null}
        </div>
    );
}
