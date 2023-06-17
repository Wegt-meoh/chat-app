import PusherServer from "pusher";

function getPusherServerOptions() {
    if (typeof window !== "undefined") {
        throw new Error("this code is server only");
    }
    const pusherAppId = process.env.PUSHER_APP_ID;
    if (!pusherAppId) {
        throw new Error("process.env.PUSHER_APP_ID is empty");
    }
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    if (!pusherKey) {
        throw new Error("process.env.NEXT_PUBLIC_PUSHER_KEY is empty");
    }
    const pusherSecret = process.env.PUSHER_SECRET;
    if (!pusherSecret) {
        throw new Error("process.env.PUSHER_SECRET is empty");
    }

    return {
        appId: pusherAppId,
        key: pusherKey,
        secret: pusherSecret,
        cluster: "ap1",
        useTLS: true,
    };
}

export const pusherServer = new PusherServer(getPusherServerOptions());
