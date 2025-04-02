import { IsIn, IsNotEmpty } from "class-validator";

export const colors = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
] as const;

export type Color = (typeof colors)[number];

export class CreateWorkspaceDto {
  @IsNotEmpty({
    message: "Title is required",
  })
  title: string;

  @IsNotEmpty({
    message: "Icon is required",
  })
  icon: string;

  @IsNotEmpty({
    message: "Color is required",
  })
  @IsIn(colors)
  color: Color;

  @IsNotEmpty({
    message: "Owner ID is required",
  })
  ownerId: string;
}
