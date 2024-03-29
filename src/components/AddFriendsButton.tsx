"use client";

import { useState } from "react";
import Button from "./ui/Button";
import axios, { AxiosError } from "axios";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";

type Props = {};

type FormData = z.infer<typeof addFriendValidator>;

export default function AddFriendsButton({}: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessState, setShowSuccessState] = useState(false);
    const { register, handleSubmit, setError, formState } = useForm<FormData>({
        resolver: zodResolver(addFriendValidator),
    });

    const addFriend = async (email: string) => {
        setIsLoading(true);
        try {
            setShowSuccessState(false);
            const validatedEmail = addFriendValidator.parse({ email });
            await axios.post("/api/friend/add", {
                email: validatedEmail,
            });
            setShowSuccessState(true);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError("email", { message: error.message });
                return;
            }

            if (error instanceof AxiosError) {
                setError("email", { message: error.response?.data });
                return;
            }

            setError("email", { message: "Something went wrong" });
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = (data: FormData) => {
        addFriend(data.email);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
            <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
            >
                Add friend by E-Mail
            </label>

            <div className="mt-2 flex gap-2 flex-col">
                <div className="flex gap-2">
                    <input
                        {...register("email")}
                        type="text"
                        autoComplete="off"
                        className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="something@example.com"
                    />
                    <Button type="submit" disabled={isLoading}>
                        <div className="flex items-center justify-center">
                            {isLoading ? null : (
                                <PlusIcon
                                    width={"16px"}
                                    height={"16px"}
                                    className="mr-2"
                                />
                            )}
                            send
                        </div>
                    </Button>
                </div>
                {showSuccessState ? (
                    <p className="text-sm text-green-400">
                        Friend request send!
                    </p>
                ) : (
                    <p className="text-sm text-red-600">
                        {formState.errors.email?.message}
                    </p>
                )}
            </div>
        </form>
    );
}
