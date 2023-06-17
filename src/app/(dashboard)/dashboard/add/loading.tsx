import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Props = {};

export default function Loading({}: Props) {
    return (
        <div className="w-full flex flex-col gap-3 py-8 px-4">
            <Skeleton width={500} height={60} className="mb-8" />
            <Skeleton width={500} height={20} />
            <Skeleton width={500} height={40} />
        </div>
    );
}
