import { FC } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* you are currently at not-found */
interface NotFoundProps {
  className?: string;
}

const NotFound: FC<NotFoundProps> = ({ className }) => {
  return (
    <div
      className={cn(
        className,
        "flex flex-col items-center justify-center min-h-screen space-y-4"
      )}
    >
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p className="text-gray-500">
        The page you are looking for does not exist.
      </p>
      <p className="text-gray-500">
        Please check the URL or return to the home page.
      </p>
      <Link
        prefetch={false}
        referrerPolicy="no-referrer"
        href="/"
        className="text-blue-500 hover:underline mt-4"
      >
        Go to Home Page
      </Link>
    </div>
  );
};

export default NotFound;
