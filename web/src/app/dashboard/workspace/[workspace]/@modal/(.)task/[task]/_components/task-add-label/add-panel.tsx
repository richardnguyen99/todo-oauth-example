"use client";

import React, { type JSX } from "react";
import { ArrowLeft, Check, Loader2, X } from "lucide-react";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ColorSelector from "./color-selector";
import { isLightColor } from "@/lib/utils";
import api from "@/lib/axios";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { colorOptions } from "@/app/dashboard/workspace/_constants/colors";
import { useTaskAddLabelContext } from "./provider";
import {
  AddTagErrorResponse,
  AddTagResponse,
  AddTagVariables,
} from "@/_types/tag";
import { Workspace } from "@/_types/workspace";
import { invalidateWorkspaces } from "@/lib/fetch-workspaces";
import { invalidateTasks } from "@/lib/fetch-tasks";

export default function AddPanel(): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { setView, setOpen } = useTaskAddLabelContext();
  const { activeWorkspace, workspaces, setWorkspaces } = useWorkspaceStore(
    (s) => s,
  );

  const { mutate } = useMutation<
    AddTagResponse,
    AxiosError<AddTagErrorResponse>,
    AddTagVariables
  >({
    mutationKey: ["add-label"],
    mutationFn: async (data: { text: string; color: string }) => {
      setLoading(true);

      const res = await api.post(
        `/workspaces/${activeWorkspace!._id}/tags`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return res.data;
    },

    onSuccess: async (data) => {
      const updatedWorkspace: Workspace = {
        ...activeWorkspace!,
        tagIds: data.data.tagIds,
        tags: data.data.tags.map((tag) => ({
          _id: tag._id,
          text: tag.text,
          color: tag.color,
        })),
      };

      const updatedWorkspaces = workspaces.map((workspace) => {
        if (workspace._id === activeWorkspace!._id) {
          return updatedWorkspace;
        }
        return workspace;
      });

      setWorkspaces({
        workspaces: updatedWorkspaces,
        activeWorkspace: updatedWorkspace,
        status: "loading",
      });

      await invalidateWorkspaces();
      await invalidateTasks(activeWorkspace!._id);
      setView("list");
    },

    onError: (error) => {
      setError(error.response?.data.message || "An error occurred");
    },

    onSettled: () => {
      setLoading(false);
    },
  });

  const [value, setValue] = React.useState<string>("");
  const [color, setColor] = React.useState({
    hex: colorOptions[2].value["bold"],
    name: `${colorOptions[2].name}-bold`,
  });

  const handleColorSelect = React.useCallback(
    (color: string, tone: string, hex: string) => {
      setColor({
        hex: hex,
        name: `${color}-${tone}`,
      });
    },
    [],
  );

  const handleSubmit = React.useCallback(() => {
    mutate({
      text: value,
      color: color.name,
    });
  }, [color.name, mutate, value]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center border-b p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView("list")}
          className="mr-2 h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>

        <h3 className="font-medium">Add New Item</h3>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(false)}
          className="ml-auto"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <Label htmlFor="item-text">Preview</Label>
          <div className="flex items-center gap-2 rounded-md border p-2">
            <span
              className="min-h-8 w-full rounded-md px-2 py-2"
              style={{
                backgroundColor: color.hex,
                color: isLightColor(color.hex) ? "black" : "white",
              }}
            >
              {value.length > 0 ? value : ""}
            </span>
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="item-text">Text</Label>
          <Input
            id="item-text"
            placeholder="Enter item text"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="item-color">Color</Label>
          <ColorSelector onSelect={handleColorSelect} />
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-1 h-4 w-4" />
          )}
          Add Item
        </Button>
      </div>
    </div>
  );
}
