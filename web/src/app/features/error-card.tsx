"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

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
    <Card className="mx-auto w-full max-w-md border-red-500 bg-red-400/10">
      <CardHeader className="flex flex-col items-center space-y-2 pb-2">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <div className={`text-5xl font-bold text-red-500`}>{statusCode}</div>
          <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
        </div>
      </CardHeader>

      <CardContent className="text-center">
        <p className="text-muted-foreground">{message}</p>

        <div className="bg-muted my-6 h-px" />

        <div className="text-muted-foreground text-sm">
          If you believe this is an error, please contact support with the
          information provided above.
        </div>
      </CardContent>
    </Card>
  );
}
