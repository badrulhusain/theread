"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, PersonIcon, ArrowRightIcon } from "@radix-ui/react-icons";

interface Author {
  name: string | null;
  image: string | null;
}

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  featuredImage?: string | null;
  author: Author;
  createdAt: string;
  tags?: { id: string; name: string }[];
}

export default function BlogCard({
  id,
  title,
  content,
  featuredImage,
  author,
  createdAt,
  tags,
}: BlogCardProps) {
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Simple excerpt from content
  const excerpt = content.replace(/<[^>]*>/g, "").substring(0, 120) + "...";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-xl hover:-translate-y-1">
      <Link href={`/blogs/${id}`} className="block h-52 overflow-hidden">
        {featuredImage ? (
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-4xl font-bold text-muted-foreground/20">
              theread
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {tags?.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <Link href={`/blogs/${id}`} className="group/title">
          <h3 className="mb-2 text-xl font-bold leading-tight text-foreground transition-colors group-hover/title:text-primary">
            {title}
          </h3>
        </Link>

        <p className="mb-6 line-clamp-2 text-sm text-muted-foreground">
          {excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted border border-border">
              {author.image ? (
                <Image src={author.image} alt={author.name || "Author"} fill />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                {author.name || "Anonymous"}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <CalendarIcon className="h-2.5 w-2.5" />
                <span>{date}</span>
              </div>
            </div>
          </div>

          <Link
            href={`/blogs/${id}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
