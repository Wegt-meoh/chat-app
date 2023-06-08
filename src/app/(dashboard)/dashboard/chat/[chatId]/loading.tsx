import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Props = {};

export default function Loading({}: Props) {
  return (
    <div className="flex-1 justify-between flex flex-col h-screen">
      <div className="border-gray-200 border-b-2 flex items-center gap-2 py-2 px-1">
        <div className="relative w-10 h-10">
          <Skeleton width={"100%"} height={"100%"} borderRadius={"100%"} />
        </div>

        <div className="flex flex-col justify-between">
          <div className="font-semibold text-xl text-zinc-800">
            <Skeleton width={80} height={10} />
          </div>
          <span className="font-normal text-sm text-zinc-400">
            <Skeleton width={100} height={10} />
          </span>
        </div>
      </div>
      <div
        id="messages"
        className="flex h-full flex-col-reverse gap-4 overflow-y-auto p-3 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded"
      >
        <div className="flex items-end gap-2">
          <div className="relative w-8 h-8">
            <Skeleton width={"100%"} height={"100%"} borderRadius={"100%"} />
          </div>
          <Skeleton width={120} height={40} />
        </div>
        <div className="flex items-end gap-2">
          <div className="relative w-8 h-8"></div>
          <Skeleton width={60} height={40} />
        </div>
        <div className="flex items-end gap-2">
          <div className="relative w-8 h-8"></div>
          <Skeleton width={100} height={40} />
        </div>

        <div className="flex items-end gap-2 flex-row-reverse">
          <div className="relative w-8 h-8">
            <Skeleton width={"100%"} height={"100%"} borderRadius={"100%"} />
          </div>
          <Skeleton width={120} height={40} />
        </div>
        <div className="flex items-end gap-2 flex-row-reverse">
          <div className="relative w-8 h-8"></div>
          <Skeleton width={60} height={40} />
        </div>
        <div className="flex items-end gap-2 flex-row-reverse">
          <div className="relative w-8 h-8"></div>
          <Skeleton width={100} height={40} />
        </div>

        <div className="flex items-end gap-2">
          <div className="relative w-8 h-8">
            <Skeleton width={"100%"} height={"100%"} borderRadius={"100%"} />
          </div>
          <Skeleton width={120} height={40} />
        </div>
        <div className="flex items-end gap-2">
          <div className="relative w-8 h-8"></div>
          <Skeleton width={60} height={40} />
        </div>
        <div className="flex items-end gap-2">
          <div className="relative w-8 h-8"></div>
          <Skeleton width={100} height={40} />
        </div>
      </div>
      <div className="px-4 py-2 mb-2 sm:mb-0 flex items-end gap-2 justify-between">
        <div className="flex-1">
          <Skeleton height={40} width={"100%"} />
        </div>
        <Skeleton width={40} height={40} className="flex-1" />
      </div>
    </div>
  );
}
