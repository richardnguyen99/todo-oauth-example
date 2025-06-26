"use client";

import React, { type JSX } from "react";
import { ArrowLeft, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ColorSelector from "./color-selector";
import { isLightColor } from "@/lib/utils";
import { colorOptions } from "@/app/dashboard/workspace/_constants/colors";
import { useTaskAddLabelContext } from "./provider";
import { ColorOption } from "@/app/dashboard/workspace/_types/color";
import UpdateLabelButton from "./update-label-button";
import DeleteLabelButton from "./delete-label-button";

export default function EditPanel(): JSX.Element {
  const { setView, setOpen, editTag, setEditTag } = useTaskAddLabelContext();

  if (!editTag) {
    throw new Error("Edit tag is not defined");
  }

  const [error, setError] = React.useState<string | null>(null);

  const [color, tone] = editTag.color.split("-");
  const hexColor = (
    colorOptions.filter((c) => c.name === color)[0] as ColorOption
  ).value[tone as keyof ColorOption["value"]];

  const [value, setValue] = React.useState<string>(editTag.text);
  const [colorOption, setColorOption] = React.useState({
    hex: hexColor,
    name: editTag.color,
  });

  const handleColorSelect = React.useCallback(
    (color: string, tone: string, hex: string) => {
      setColorOption({
        hex: hex,
        name: `${color}-${tone}`,
      });
    },
    [],
  );

  const handleBackClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      setEditTag(null);
      setView("list");
    },
    [setEditTag, setView],
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center border-b p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="mr-2 h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>

        <h3 className="font-medium">Edit Label &apos;{editTag.text}&apos;</h3>

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

      <div className="max-h-154 space-y-4 overflow-scroll p-4">
        <div className="space-y-2">
          <Label htmlFor="item-text">Preview</Label>
          <div className="flex items-center gap-2 rounded-md border p-2">
            <span
              className="min-h-8 w-full rounded-md px-2 py-2"
              style={{
                backgroundColor: colorOption.hex,
                color: isLightColor(colorOption.hex) ? "black" : "white",
              }}
            >
              {value.length > 0 ? value : ""}
            </span>
          </div>

          {error && <p className="break-words text-red-500">{error}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="item-text">Text</Label>
          <Input
            id="item-text"
            placeholder={editTag.text}
            defaultValue={editTag.text}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="item-color">Color</Label>
          <ColorSelector
            initialColor={colorOption}
            onSelect={handleColorSelect}
          />
        </div>

        <UpdateLabelButton
          text={value}
          colorOption={colorOption}
          setErrorMessage={setError}
        />

        <DeleteLabelButton setErrorMessage={setError} />
      </div>
    </div>
  );
}
