import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

type Props = { children: ReactNode };

export default function ToastProviders({ children }: Props) {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            {children}
        </>
    );
}
