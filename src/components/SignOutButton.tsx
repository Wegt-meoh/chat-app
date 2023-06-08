"use client";
import React, { ButtonHTMLAttributes, useState } from "react";
import Button from "./ui/Button";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Loader2, LogOut } from "lucide-react";

type Props = {} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function SignOutButton({ ...props }: Props) {
  const [isSignOut, setIsSignOut] = useState(false);

  async function handleButtonClick() {
    setIsSignOut(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      toast.error("There is something error when sign out");
    } finally {
      setIsSignOut(false);
    }
  }

  return (
    <Button {...props} onClick={handleButtonClick} variant={"ghost"}>
      {isSignOut ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
    </Button>
  );
}
