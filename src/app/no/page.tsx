import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

/* you are currently at page */

const Page: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-2xl font-bold">
        No Product is <b className="text-red-500">NOT</b> Vegan
      </h1>
      <Image
        src="/no.gif"
        alt="No, this product is not vegan!"
        width={300}
        height={300}
        className="rounded-lg object-cover"
      />
      <Link
        href="/"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        <span className="sr-only">
          Go back to the home page to check another product
        </span>
        <span className="hidden md:inline">Check Another Product</span>
        <IoArrowBack className=" md:hidden block size-5" />
      </Link>
    </div>
  );
};

export default Page;
