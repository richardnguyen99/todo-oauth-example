"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import MarkdownPreview from "@uiw/react-markdown-preview";

import { cn } from "@/lib/utils";
import { Task } from "@/_types/task";

type Props = Readonly<
  {
    task: Task;
  } & React.HTMLAttributes<HTMLDivElement>
>;

export default function TaskItemDescriptionPreview({
  task,
  ...rest
}: Props): JSX.Element {
  return (
    <MarkdownPreview
      {...rest}
      disableCopy
      className={cn(
        "!prose-sm prose-headings:!text-sm", // general styles
        "!line-clamp-1 w-full [&>:not(:first-child)]:hidden", // layout and line constraint
        "[&>*]:!m-0 [&>*]:!border-b-0 [&>*]:!p-0", // remove default styles
        "[&_code]:!line-clamp-1 [&_code]:!p-0", // code styles
        "[&>pre]:!m-0 [&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!text-sm", // code block styles
      )}
      source={
        task.description && task.description.length > 0
          ? task.description
          : undefined
      }
      components={{
        a: ({ node, ...props }) => {
          const { href } = props;

          // Check if the href is external
          const isExternal = href && href.startsWith("http");

          const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.stopPropagation();
          };

          if (isExternal) {
            return (
              <a
                {...props}
                href={href}
                onClick={handleClick}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              />
            );
          }

          return (
            <Link
              {...props}
              onClick={handleClick}
              className="text-primary underline-offset-4 hover:underline"
              href={href || "#"}
            />
          );
        },
      }}
      rehypeRewrite={(node, index, parent) => {
        if (node.type !== "element") {
          return;
        }

        // Remove heading anchors
        if (
          node.tagName === "a" &&
          parent &&
          /^h(1|2|3|4|5|6)/.test((parent as typeof node).tagName)
        ) {
          parent.children = parent.children.slice(1);
          // Disable table elements
        } else if (node.tagName === "table") {
          node.tagName = "p";
          node.properties = {
            className: "text-muted-foreground italic",
          };
          node.children = [
            {
              type: "text",
              value: "Table is disabled in preview.",
            },
          ];
        } else if (node.tagName === "img") {
          node.tagName = "span";

          const { src, alt } = node.properties as {
            src: string;
            alt: string;
          };

          node.properties = {
            className: "text-muted-foreground italic",
          };
          node.children = [
            {
              type: "text",
              value: `Image: ![${alt}](${src})`,
            },
          ];
        }
      }}
    />
  );
}
