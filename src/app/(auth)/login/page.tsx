"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { FacebookIcon, Loader2, LockIcon, MailIcon } from "lucide-react";
import GithubIcon from "@/components/icon/GithubIcon";
import { emailCredentialValidator } from "@/lib/validations/email-credential";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

type Props = {};

type FormData = z.infer<typeof emailCredentialValidator>;

export default function Login({}: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [succ, setSucc] = useState(false);
    const { register, handleSubmit, formState, setError } = useForm<FormData>({
        resolver: zodResolver(emailCredentialValidator),
    });

    async function mySignIn(
        provider: Parameters<typeof signIn>["0"],
        param?: Record<string, string>
    ) {
        setIsLoading(true);
        try {
            if (provider === "email") {
                emailCredentialValidator.parse(param);
            }
            await signIn(provider, { callbackUrl: "/dashboard", ...param });
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError("email", { message: error.message });
            }

            if (error instanceof AxiosError) {
                setError("email", { message: error.response?.data });
            }

            toast.error("Something went wrong with your login.");
            setIsLoading(false);
        } finally {
            setSucc(true);
        }
    }

    function loginInWithEmail(data: FormData) {
        mySignIn("email", data);
    }

    function loginWithFaceBook(): void {
        mySignIn("facebook");
    }

    function loginWithGithub(): void {
        mySignIn("github");
    }

    return (
        <div className="min-h-screen bg-gray-100 pt-16">
            <h2 className="mx-auto mb-8 text-center text-3xl font-bold tracking-tight text-gray-900">
                Sign In
            </h2>

            {formState.errors.email ? (
                <p className="mx-auto max-w-xs w-full px-4 py-2 border border-red-600 bg-red-300 text-red-600 rounded-sm">
                    &gt; {formState.errors.email.message}
                </p>
            ) : null}

            <div className="mx-auto max-w-xs w-full bg-white min-h-[16rem] p-4 relative">
                {isLoading ? (
                    <div className="absolute z-[1000] top-0 left-0 w-full h-full bg-white bg-opacity-70">
                        <div className="w-16 h-16 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Loader2 className="w-full h-full animate-spin text-slate-400 " />
                        </div>
                    </div>
                ) : null}

                <Button
                    type="button"
                    className="px-4 w-full mb-4 hover:bg-slate-600"
                    onClick={loginWithGithub}
                >
                    <div className="flex items-center">
                        {" "}
                        <GithubIcon />
                        Sign in with Github
                    </div>
                </Button>
                <Button
                    type="button"
                    className="px-4 w-full bg-blue-500 hover:bg-blue-400"
                    onClick={loginWithFaceBook}
                >
                    <div className="flex items-center">
                        <FacebookIcon
                            fill="white"
                            className="mr-4 bg-blue-600 text-blue-600 rounded-full"
                        />
                        Sign in with Facebook
                    </div>
                </Button>

                <div className="h-16 flex items-center gap-4">
                    <div className="border-t-[1px] border-slate-300 my-auto flex-1"></div>
                    <span className="flex-shrink-0 leading-8 text-slate-400">
                        or
                    </span>
                    <div className="border-t-[1px] border-slate-300 my-auto flex-1"></div>
                </div>
                <form
                    onSubmit={handleSubmit(loginInWithEmail)}
                    className="space-y-4"
                >
                    <div className="h-10 border border-slate-300 rounded-sm pl-10 relative overflow-hidden">
                        <MailIcon className="text-slate-400 w-10 h-10 p-2 bg-slate-200 rounded-l-sm absolute top-0 left-0" />
                        <input
                            autoComplete="email"
                            className="px-2 outline-none w-full h-full placeholder:text-slate-300"
                            placeholder="yours@example.com"
                            {...register("email")}
                        />
                    </div>
                    {/* <div className="h-10 border border-slate-300 rounded-sm relative pl-10 overflow-hidden">
                        <LockIcon className="w-10 h-10 bg-slate-200 p-2 text-slate-400 rounded-l-sm absolute top-0 left-0" />
                        <input
                            type="password"
                            autoComplete="current-password"
                            className="px-2 outline-none w-full h-full placeholder:text-slate-300 border-none"
                            placeholder="your password"
                            {...register("password")}
                        />
                    </div> */}
                    <Button
                        className="w-full h-10 bg-black text-white"
                        type="submit"
                    >
                        Login In
                    </Button>
                </form>
            </div>
        </div>
    );
}
