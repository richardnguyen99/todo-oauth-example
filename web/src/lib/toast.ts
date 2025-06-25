import { type ExternalToast, toast } from "sonner";

const DURATION = 5000;

type ToastOptions = Pick<ExternalToast, "description" | "action">;

export const toastSuccess = (message: string, data?: ToastOptions) => {
  const { description, action } = data || {};

  toast.success(message, {
    description,
    action,
    duration: DURATION,
    classNames: {
      toast: "!border-green-600 dark:!border-green-500 ",
      icon: "[&>svg]:!fill-green-600 dark:[&>svg]:!fill-green-500",
      description: "!text-muted-foreground",
    },
  });
};
