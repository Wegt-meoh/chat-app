import { ReactNode } from "react";

type Props = { children: ReactNode };

export default function Layout({ children }: Props) {
    return <div className="py-8 px-4">{children}</div>;
}
