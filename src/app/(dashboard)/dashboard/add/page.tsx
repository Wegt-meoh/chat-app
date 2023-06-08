import AddFriendsButton from "@/components/AddFriendsButton";
import React from "react";

type Props = {};

export default function Page({}: Props) {
  return (
    <main className="py-8 px-4 w-full">
      <h1 className=" text-5xl font-bold mb-8">Add a friend</h1>
      <AddFriendsButton />
    </main>
  );
}
