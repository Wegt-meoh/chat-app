import { chatHrefConstructor, cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { type Toast } from "react-hot-toast";

type Props = {
    t: Toast;
    chatId: string;
    senderImage: string;
    senderName: string;
    senderMsg: string;
};

export default function UnseenChatToast({
    t,
    chatId,
    senderImage,
    senderName,
    senderMsg,
}: Props) {
    function dismiss() {
        toast.dismiss(t.id);
    }

    return (
        <div
            className={cn(
                "max-w-md w-full bg-white shadow-lg rounded-lg flex ring-1 ring-black ring-opacity-5",
                { "animate-enter": t.visible, "animate-leave": !t.visible }
            )}
        >
            <Link
                onClick={dismiss}
                className="flex-1 w-0 p-4"
                href={`/dashboard/chat/${chatId}`}
            >
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 pt-0.5">
                        <div className="relative w-10 h-10">
                            <Image
                                fill
                                src={senderImage}
                                alt={`${senderName} profile picture `}
                                className="rounded-full"
                                referrerPolicy="no-referrer"
                                sizes="32px"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                            {senderName}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                            {senderMsg}
                        </p>
                    </div>
                </div>
            </Link>

            <div className="flex border-l border-gray-200">
                <button
                    type="button"
                    title="close"
                    className="w-full border border-transparent rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={dismiss}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
