"use client";

import React, { type JSX } from "react";
import { Check } from "lucide-react";

import { cn, isLightColor } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { colorOptions, toneOrder } from "./constants";

type Props = Readonly<{
  initialColor?: {
    hex: string;
    name: string;
  };
  onSelect?: (color: string, tone: string, hex: string) => void;
}>;

export default function ColorSelector({
  initialColor = {
    hex: colorOptions[2].value["bold"],
    name: `${colorOptions[2].name}-bold`,
  },
  onSelect,
}: Props): JSX.Element {
  const [selectedColor, setSelectedColor] = React.useState({
    hex: initialColor.hex,
    name: initialColor.name,
  });

  const handleColorSelect = React.useCallback(
    (color: string, tone: string, hex: string) => {
      setSelectedColor({
        hex: hex,
        name: `${color}-${tone}`,
      });
      onSelect?.(color, tone, hex);
    },
    [onSelect],
  );

  // Create a chunked array of colors to display in a 6x6 grid
  // Each chunk will contain 6 colors (half of the total 12 colors)
  const colorChunks = [
    colorOptions.slice(0, 6), // First 6 colors
    colorOptions.slice(6, 12), // Last 6 colors
  ];

  return (
    <div className="w-full">
      {colorChunks.map((chunk, chunkIndex) => (
        <div
          key={`chunk-${chunkIndex}`}
          className="mb-2 grid grid-cols-6 gap-2"
        >
          {chunk.map((color) => (
            <div key={color.name} className="flex flex-col gap-2">
              {toneOrder.map((tone) => (
                <Tooltip key={tone} delayDuration={500}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "relative flex h-10 w-full items-center justify-center rounded-md transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none",
                        selectedColor.hex === color.value[tone]
                          ? "ring-2 ring-offset-2"
                          : "hover:scale-105",
                      )}
                      style={{
                        backgroundColor: color.value[tone],
                        color: isLightColor(color.value[tone])
                          ? "#000"
                          : "#fff",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                      }}
                      onClick={() =>
                        handleColorSelect(color.name, tone, color.value[tone])
                      }
                      aria-label={`${color.name.toLowerCase()}-${tone}`}
                    >
                      {selectedColor.hex === color.value[tone] && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{`${color.name.toLowerCase()}-${tone}`}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
