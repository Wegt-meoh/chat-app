import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

type Props = { children: ReactNode };

export default function Providers({ children }: Props) {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            {children}
        </>
    );
}