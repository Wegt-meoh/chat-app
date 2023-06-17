import PusherClient from "pusher-js";

function getPusherClientOptions() {
    const appKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    if (!appKey) {
        throw new Error("process.env.NEXT_PUBLIC_PUSHER_KEY is empty");
    }
    return appKey;
}

export const pusherClient = new PusherClient(getPusherClientOptions(), {
    cluster: "ap1",
});
