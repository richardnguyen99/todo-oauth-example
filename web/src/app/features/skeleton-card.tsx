import React, { type JSX } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function SkeletonCard(): JSX.Element {
  return (
    <Card className="w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        {/* Title skeleton */}
        <div className="h-7 bg-muted rounded-md w-3/5 mx-auto animate-pulse" />
        {/* Description skeleton */}
        <div className="h-4 bg-muted rounded-md w-4/5 mx-auto animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text skeleton */}
        <div className="h-4 bg-muted rounded-md w-full mx-auto animate-pulse" />

        {/* Discord button skeleton */}
        <div className="h-10 bg-muted rounded-md w-full animate-pulse" />

        {/* Google button skeleton */}
        <div className="h-10 bg-muted rounded-md w-full animate-pulse" />
      </CardContent>
      <CardFooter className="flex justify-center">
        {/* Footer text skeleton */}
        <div className="h-3 bg-muted rounded-md w-4/5 animate-pulse" />
      </CardFooter>
    </Card>
  );
}
