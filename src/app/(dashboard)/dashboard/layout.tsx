import FriendRequestSideBarOptions from "@/components/FriendRequestSidebarOptions";
import { Icon, Icons } from "@/components/Icons";
import SidebarChatList from "@/components/SidebarChatList";
import SignOutButton from "@/components/SignOutButton";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

type SideBarOption = {
    id: number;
    name: string;
    href: string;
    icon: Icon;
};

const sideBarOptions: SideBarOption[] = [
    {
        id: 1,
        name: "Add Friend",
        href: "/dashboard/add",
        icon: "UserPlus",
    },
];

export default async function Layout({ children }: Props) {
    const session = await getServerSession(authOptions);

    if (!session) notFound();

    const friendRequestsCount = (
        (await fetchRedis(
            "smembers",
            `user:${session.user.id}:incoming_friend_requests`
        )) as string[]
    ).length;

    const friends = await getFriendsByUserId(session.user.id);

    return (
        <div className="w-full flex h-screen">
            <div className="hidden flex-shrink-0 md:flex h-full w-full max-w-xs grow flex-col overflow-x-hidden gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
                <Link
                    href="/dashboard"
                    className="flex h-16 shrink-0 items-center pl-6"
                >
                    <Icons.Logo className="h-8 w-auto text-indigo-600" />
                </Link>

                {friends.length === 0 ? null : (
                    <div className="text-xs font-semibold leading-6 text-gray-400">
                        Your chats
                    </div>
                )}

                <nav className="flex-1">
                    <ul
                        role="list"
                        className="flex flex-1 flex-col gap-y-7 h-full"
                    >
                        <li>
                            {friends.length === 0 ? null : (
                                <SidebarChatList
                                    initialFriends={friends}
                                    sessionId={session.user.id}
                                />
                            )}
                        </li>
                        <li>
                            <h2 className="pl-3 text-xs font-semibold leading-6 text-gray-400">
                                Overview
                            </h2>
                            <ul role="list" className="mt-2 space-y-1 pl-6">
                                {sideBarOptions.map((option) => {
                                    const Icon = Icons[option.icon];
                                    return (
                                        <li key={option.id}>
                                            <Link
                                                href={option.href}
                                                className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                            >
                                                <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[0.625rem] font-medium bg-white">
                                                    <Icon className="h-4 w-4" />
                                                </span>
                                                <span className="truncate">
                                                    {option.name}
                                                </span>
                                            </Link>
                                        </li>
                                    );
                                })}
                                <li>
                                    <FriendRequestSideBarOptions
                                        initialUnseenFriendRequestsCount={
                                            friendRequestsCount
                                        }
                                        sessionId={session.user.id}
                                    />
                                </li>
                            </ul>
                        </li>

                        <li className="mt-auto flex items-center justify-between">
                            <div className="flex flex-shrink items-center gap-x-4 px-4 py-3 text-sm font-semibold leading-6">
                                <div className="relative w-8 h-8 bg-gray-50">
                                    <Image
                                        fill
                                        sizes="32px"
                                        referrerPolicy="no-referrer"
                                        className=" rounded-full"
                                        src={session.user.image || ""}
                                        alt="profile picture"
                                    />
                                </div>
                                <span className="sr-only">Your profile</span>
                                <div className="flex flex-col">
                                    <span aria-hidden className="w-32 truncate">
                                        {session.user.name}
                                    </span>
                                    <span
                                        className=" text-xs text-zinc-400 w-32 truncate"
                                        aria-hidden
                                    >
                                        {session.user.email}
                                    </span>
                                </div>
                            </div>
                            <SignOutButton className="h-full aspect-square" />
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="flex-1">{children}</div>
        </div>
    );
}
