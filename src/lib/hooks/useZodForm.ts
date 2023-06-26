import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function useZodForm<T extends z.ZodType<any, any, any>>(schema: T) {
    return useForm<z.infer<T>>({
        resolver: zodResolver(schema),
    });
}
