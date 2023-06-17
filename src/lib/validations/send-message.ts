import { z } from "zod";

export const sendMessageValidator = z.object({
    chatId: z.string(),
    text: z.string(),
    timestamp: z.number(),
});

export type SendMessageType = z.infer<typeof sendMessageValidator>;
