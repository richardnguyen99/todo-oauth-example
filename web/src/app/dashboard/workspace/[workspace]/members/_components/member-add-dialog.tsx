"use client";

import React, { type JSX } from "react";
import { Check, ChevronsUpDown, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@uidotdev/usehooks";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";

const FormSchema = z.object({
  language: z.string({
    required_error: "Please select a language.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

type ComboBoxItem = {
  label: string;
  value: string;
};

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

export default function MemberAddDialog(): JSX.Element {
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [loading, setLoading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [items, setItems] = React.useState<ComboBoxItem[]>([]);
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const { data, isFetching } = useQuery({
    queryKey: ["members", debouncedSearchTerm],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = languages.filter((language) =>
        language.label
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()),
      );

      setItems(data);
      return data;
    },
    enabled: Boolean(debouncedSearchTerm),
  });

  const onSubmit = React.useCallback((data: FormData) => {}, []);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DialogTrigger asChild>
            <Button variant="secondary" className="p-2">
              <UserPlus className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Invite Member</span>
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Invite new members to your workspace to work with you.
            </DialogDescription>

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Language</FormLabel>
                  <Popover
                    modal
                    open={popoverOpen}
                    onOpenChange={setPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? languages.find(
                                (language) => language.value === field.value,
                              )?.label
                            : "Select language"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search framework..."
                          className="h-9"
                          value={searchTerm}
                          onValueChange={setSearchTerm}
                        />
                        <CommandList
                          className={cn({
                            "[&_[cmdk-empty]]:opacity-50":
                              debouncedSearchTerm !== searchTerm || isFetching,
                            "[&_[cmdk-empty]]:opacity-100":
                              debouncedSearchTerm === searchTerm && !isFetching,
                          })}
                        >
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup
                            className={cn({
                              "opacity-50":
                                debouncedSearchTerm !== searchTerm ||
                                isFetching,
                              "opacity-100":
                                debouncedSearchTerm === searchTerm &&
                                !isFetching,
                            })}
                          >
                            {items.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("language", language.value);
                                }}
                              >
                                {language.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    language.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the language that will be used in the dashboard.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                onClick={() => {
                  setDialogOpen(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
