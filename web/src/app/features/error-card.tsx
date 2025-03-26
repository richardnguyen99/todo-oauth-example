"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

interface ErrorCardProps {
  statusCode: number;
  title: string;
  message: string;
}

export default function ErrorCard({
  statusCode,
  title,
  message,
}: ErrorCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto border-red-500 bg-red-400/10">
      <CardHeader className="flex flex-col items-center space-y-2 pb-2">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <div className={`text-5xl font-bold text-red-500`}>{statusCode}</div>
          <h2 className="text-2xl font-semibold mt-2">{title}</h2>
        </div>
      </CardHeader>

      <CardContent className="text-center">
        <p className="text-muted-foreground">{message}</p>

        <div className="h-px bg-muted my-6" />

        <div className="text-sm text-muted-foreground">
          If you believe this is an error, please contact support with the
          information provided above.
        </div>
      </CardContent>
    </Card>
  );
}
