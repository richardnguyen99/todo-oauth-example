import { z } from "zod";

export const colors = [
  "slate",
  "stone",
  "zinc",
  "red",
  "orange",
  "amber",
  "lime",
  "green",
  "teal",
  "cyan",
  "blue",
  "purple",
] as const;

export const addNewTagDtoSchema = z.object({
  text: z
    .string({
      required_error: "Tag text is required",
      invalid_type_error: "Tag text must be a string",
    })
    .min(1, "Tag text cannot be empty"),

  color: z
    .string({
      required_error: "Tag color is required",
      invalid_type_error: `Tag color must be one of the following: ${colors.join(", ")}`,
    })
    .refine((color) => {
      const [colorName, tone] = color.split("-");
      return (
        colors.includes(colorName as (typeof colors)[number]) &&
        ["bold", "default", "subtle"].includes(tone)
      );
    }),
});

export type AddNewTagDto = z.infer<typeof addNewTagDtoSchema>;
