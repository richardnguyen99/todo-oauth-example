"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Menu, X } from "lucide-react";
import clsx from "clsx";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <CheckCircle className="text-primary h-6 w-6" />
          <span>TaskMaster</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md p-2 md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          <Link
            href="#features"
            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
          >
            FAQ
          </Link>
          <div className="ml-4 flex items-center space-x-2">
            <Link
              href="/login"
              className={clsx(buttonVariants({ size: "sm" }))}
            >
              Login
            </Link>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "bg-background absolute top-full right-0 left-0 border-b shadow-lg md:hidden",
            isMenuOpen ? "block" : "hidden",
          )}
        >
          <div className="container mx-auto space-y-4 px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
            </nav>
            <div className="flex flex-col space-y-2 border-t pt-2">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full justify-center">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
