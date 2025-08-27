"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";

/* you are currently at vegan-result */
interface VeganResultProps {
  className?: string;
  handleOnClick?: () => void;
  isVegan: boolean;
  eNumbers?: Array<{ code: string; name: string }>;
}

const VeganResult: FC<VeganResultProps> = ({
  className,
  handleOnClick,
  isVegan,
  eNumbers,
}) => {
  return (
    <div
      className={cn(
        className,
        "flex flex-col items-center justify-center min-h-screen space-y-4"
      )}
    >
      <h1 className="text-2xl font-bold">
        {isVegan ? (
          <span>
            Yes Product <b className="text-emerald-500">IS</b> Vegan
          </span>
        ) : (
          <span>
            No Product is <b className="text-red-500">NOT</b> Vegan
          </span>
        )}
      </h1>

      {eNumbers && eNumbers.length > 0 && (
        <div className="max-w-md w-full space-y-2">
          <h2 className="text-lg font-semibold text-center">
            E-numbers found:
          </h2>
          <div className="bg-muted rounded-lg p-4 space-y-1">
            {eNumbers.map(({ code, name }) => (
              <div key={code} className="text-sm">
                <span className="font-mono font-medium">{code}</span>
                <span className="text-muted-foreground"> - {name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Image
        src={isVegan ? "/yes.gif" : "/no.gif"}
        alt={
          isVegan
            ? "Yes, this product is vegan!"
            : "No, this product is not vegan!"
        }
        unoptimized
        width={300}
        height={300}
        className="rounded-lg object-cover"
      />
      <Button
        onClick={handleOnClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        <span className="sr-only">Check another product</span>
        <span className="hidden md:inline">Check Another Product</span>
        <IoArrowBack className=" md:hidden block size-5" />
      </Button>
    </div>
  );
};

export default VeganResult;
