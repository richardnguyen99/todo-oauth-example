import React, { type JSX } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import clsx from "clsx";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Footer from "@/components/footer";
import AnonymousHeader from "@/components/anonymous-header";

export default function LoginPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <AnonymousHeader />
      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mb-2 flex justify-center">
              <CheckCircle className="text-primary h-10 w-10" />
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your TaskMaster account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/discord`}
              className={clsx(
                buttonVariants({
                  variant: "outline",
                  className:
                    "!hover:bg-[#4752C4] flex h-12 w-full items-center justify-center gap-2 border-0 !bg-[#5865F2] !text-white hover:!text-white",
                }),
              )}
            >
              <DiscordIcon className="h-5 w-5" />
              <span>Continue with Discord</span>
            </a>

            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
              className={clsx(
                buttonVariants({
                  variant: "outline",
                  className:
                    "flex h-12 w-full items-center justify-center gap-2 border !border-gray-300 !bg-white !text-gray-800 hover:!bg-gray-50",
                }),
              )}
            >
              <GoogleIcon className="h-5 w-5" />
              <span>Continue with Google</span>
            </a>
          </CardContent>
          <CardFooter className="text-muted-foreground flex flex-col space-y-2 text-center text-sm">
            <p>
              By continuing, you agree to TaskMaster&apos;s{" "}
              <Link
                href="/#"
                className="hover:text-primary underline underline-offset-4"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/#"
                className="hover:text-primary underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 127.14 96.36"
      className={className}
      fill="currentColor"
    >
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
