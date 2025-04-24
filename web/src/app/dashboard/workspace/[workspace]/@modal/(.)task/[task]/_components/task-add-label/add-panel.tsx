"use client";

import React, { type JSX } from "react";
import { ArrowLeft, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ColorSelector from "./color-selector";
import { colorOptions } from "./constants";
import { isLightColor } from "@/lib/utils";

type Props = Readonly<{
  setView: React.Dispatch<React.SetStateAction<"list" | "add">>;
}>;

export default function AddPanel({ setView }: Props): JSX.Element {
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

  return (
    <div className="flex flex-col">
      <div className="flex items-center border-b p-3">
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

        <Button className="w-full">
          <Check className="mr-1 h-4 w-4" />
          Add Item
        </Button>
      </div>
    </div>
  );
}
