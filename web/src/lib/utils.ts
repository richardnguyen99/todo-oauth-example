import { FetchedTask, Task } from "@/_types/task";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to determine if a color is light or dark
export function isLightColor(color: string): boolean {
  // Convert hex to RGB
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5;
}

export function buildSearchParams<T>(params: URLSearchParams) {
  const searchParams: Record<string, string | string[]> = {};

  params.forEach((value, key) => {
    if (searchParams[key]) {
      if (Array.isArray(searchParams[key])) {
        (searchParams[key] as string[]).push(value);
      } else {
        searchParams[key] = [searchParams[key] as string, value];
      }
    } else {
      searchParams[key] = value;
    }
  });

  return searchParams as T;
}

export function buildSearchParamsString<
  T extends Record<string, string | string[] | undefined>,
>(params: T): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v));
    } else {
      searchParams.set(key, value);
    }
  });

  return searchParams.toString();
}

export function createTaskFromFetchedData(data: FetchedTask): Task {
  return {
    ...data,

    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),

    createdByUser: {
      ...data.createdByUser,
      createdAt: new Date(data.createdByUser.createdAt),
      updatedAt: new Date(data.createdByUser.updatedAt),
    },

    completedByUser: data.completedByUser
      ? {
          ...data.completedByUser,
          createdAt: new Date(data.completedByUser.createdAt),
          updatedAt: new Date(data.completedByUser.updatedAt),
        }
      : null,

    workspace: {
      ...data.workspace,
      createdAt: new Date(data.workspace.createdAt),
      updatedAt: new Date(data.workspace.updatedAt),
    },

    tags: data.tags.map((tag) => ({
      ...tag,
      createdAt: new Date(tag.createdAt),
      updatedAt: new Date(tag.updatedAt),
    })),
  };
}
