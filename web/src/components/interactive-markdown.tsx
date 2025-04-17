"use client";

import React, { type JSX } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import dynamic from "next/dynamic";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import { Button } from "./ui/button";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="bg-muted h-48 w-full animate-pulse rounded-md" />
  ),
});

type Props = Readonly<{
  children?: string;
  defaultEmptyValue?: string;
  onSave?: (value: string) => void;
  onCancel?: () => void;
}>;

export default function InteractiveMarkdown({
  children,
  defaultEmptyValue,
}: Props): JSX.Element {
  const [value, setValue] = React.useState(children);
  const [editing, setEditing] = React.useState(false);

  const handleChange = React.useCallback<
    NonNullable<React.ComponentProps<typeof MDEditor>["onChange"]>
  >((newValue) => {
    setValue(newValue);
  }, []);

  if (!editing) {
    return (
      <div
        className="hover:bg-accent/50 -mx-4 cursor-pointer rounded-md p-2"
        onClick={() => setEditing(true)}
      >
        <MarkdownPreview
          source={value && value.length > 0 ? value : defaultEmptyValue}
          rehypeRewrite={(node, index, parent) => {
            console.log("node: ", node);
            if (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              node.tagName === "a" &&
              parent &&
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              /^h(1|2|3|4|5|6)/.test(parent.tagName)
            ) {
              parent.children = parent.children.slice(1);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <MDEditor
        height={200}
        value={value}
        onChange={handleChange}
        highlightEnable
        preview="edit"
        commandsFilter={(command) => {
          if (command.name === "live") {
            return false; // Disable live code command
          }

          return command;
        }}
      />

      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </div>
    </div>
  );
}
