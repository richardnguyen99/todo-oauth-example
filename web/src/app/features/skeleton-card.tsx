import React, { type JSX } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function SkeletonCard(): JSX.Element {
  return (
    <Card className="mx-auto w-md">
      <CardHeader className="space-y-2 text-center">
        {/* Title skeleton */}
        <div className="bg-muted mx-auto h-7 w-3/5 animate-pulse rounded-md" />
        {/* Description skeleton */}
        <div className="bg-muted mx-auto h-4 w-4/5 animate-pulse rounded-md" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text skeleton */}
        <div className="bg-muted mx-auto h-4 w-full animate-pulse rounded-md" />

        {/* Discord button skeleton */}
        <div className="bg-muted h-10 w-full animate-pulse rounded-md" />

        {/* Google button skeleton */}
        <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
      </CardContent>
      <CardFooter className="flex justify-center">
        {/* Footer text skeleton */}
        <div className="bg-muted h-3 w-4/5 animate-pulse rounded-md" />
      </CardFooter>
    </Card>
  );
}
