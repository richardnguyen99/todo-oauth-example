"use client";

import React, { type JSX } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import dynamic from "next/dynamic";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import { Button } from "./ui/button";
import { Loader2, Pencil } from "lucide-react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="bg-muted h-48 w-full animate-pulse rounded-md" />
  ),
});

type Props = Readonly<{
  children?: string;
  defaultEmptyValue?: string;
  onSave?: (value: string | undefined | null) => Promise<void>;
  onCancel?: () => void;
}>;

export default function InteractiveMarkdown({
  children,
  defaultEmptyValue,
  onSave,
}: Props): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState(children);
  const [editing, setEditing] = React.useState(false);

  const handleChange = React.useCallback<
    NonNullable<React.ComponentProps<typeof MDEditor>["onChange"]>
  >((newValue) => {
    setValue(newValue);
  }, []);

  const handleSave = React.useCallback(async () => {
    setLoading(true);
    if (typeof onSave !== "undefined") {
      await onSave(value || null);
    }

    setLoading(false);
    setEditing(false);
  }, [onSave, value]);

  if (!editing) {
    return (
      <div className="group hover:bg-accent/30 relative -ml-4 rounded-md p-2 px-4">
        <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={() => setEditing(true)}
          >
            <Pencil className="h-2 w-2" />
            Edit
          </Button>
        </div>
        <MarkdownPreview
          source={value && value.length > 0 ? value : defaultEmptyValue}
          rehypeRewrite={(node, index, parent) => {
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
        <Button size="sm" onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
    </div>
  );
}
