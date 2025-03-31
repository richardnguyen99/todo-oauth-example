"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Briefcase,
  Calendar,
  Code,
  Cog,
  FileText,
  Folder,
  Gem,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Image,
  Inbox,
  Laptop,
  Leaf,
  Library,
  LifeBuoy,
  Lightbulb,
  Map,
  MessageSquare,
  Music,
  Package,
  Palette,
  PenTool,
  ShoppingCart,
  Star,
  LuggageIcon as Suitcase,
  Tag,
  Target,
  Ticket,
  Utensils,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { colorList, colorMap } from "../_constants/colors";
import { icons } from "../_constants/icons";

// Create a Zod schema for form validation
const formSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  icon: z
    .string({
      required_error: "Please select an icon",
    })
    .refine((value) => Object.keys(icons).includes(value), {
      message: "Please select a valid icon",
    }),
  color: z
    .string({
      required_error: "Please select a color",
    })
    .refine((value) => colorList.some((c) => c.name === value), {
      message: "Please select a valid color",
    }),
});

// Define the form values type
type FormValues = z.infer<typeof formSchema>;

interface AddWorkspaceFormProps {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

export function AddWorkspaceForm({
  onSubmit,
  onCancel,
}: AddWorkspaceFormProps) {
  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      icon: "Folder",
      color: "green",
    },
  });

  // Watch form values for preview
  const watchedValues = form.watch();
  const SelectedIconComponent = icons[watchedValues.icon];

  // Get the selected color name for display
  const selectedColorName =
    colorList.find((c) => c.name === watchedValues.color)?.name || "Color";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter workspace name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Icons</SelectLabel>
                      {Object.keys(icons).map((iconName) => {
                        const IconComponent = icons[iconName];
                        return (
                          <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              <span>{iconName}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Colors</SelectLabel>
                      {colorList.map((color) => (
                        <SelectItem key={color.name} value={color.name}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-4 w-4 rounded-full ${color.value}`}
                            />
                            <span className="capitalize">{color.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Preview */}
        <div className="mt-2">
          <Label>Preview</Label>
          <div className="flex items-center gap-3 mt-2 p-3 border rounded-md">
            <div
              className={`h-8 w-8 rounded-md flex items-center justify-center ${
                // @ts-ignore
                colorMap[watchedValues.color]
              }`}
            >
              <SelectedIconComponent className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {watchedValues.name || "Workspace Name"}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedColorName} • {watchedValues.icon}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Workspace</Button>
        </div>
      </form>
    </Form>
  );
}
