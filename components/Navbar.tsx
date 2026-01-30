"use client";

import Link from "next/link";
import { MagnifyingGlassIcon, ReaderIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "glass py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-105">
              <ReaderIcon className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              theread
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/blogs"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Feed
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Categories
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group hidden sm:block">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
            <input
              type="text"
              placeholder="Search stories..."
              className="h-10 w-64 rounded-full border border-border bg-muted/50 pl-10 pr-4 text-sm transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <Link
            href="/login"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-95"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
