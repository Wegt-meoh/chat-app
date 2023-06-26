"use client";
import { ButtonHTMLAttributes, useState } from "react";
import Button from "./ui/Button";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Loader2, LogOut } from "lucide-react";

type Props = {} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function SignOutButton({ ...props }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleButtonClick() {
        setIsLoading(true);
        try {
            await signOut({ callbackUrl: "/login" });
        } catch (error) {
            toast.error("There is something error when sign out");
        } finally {
            console.log("finish");
            setIsLoading(false);
        }
    }

    return (
        <Button
            {...props}
            disabled={isLoading}
            onClick={handleButtonClick}
            variant={"ghost"}
        >
            <div className="flex items-center justify-center">
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <LogOut className="w-4 h-4" />
                )}
            </div>
        </Button>
    );
}
