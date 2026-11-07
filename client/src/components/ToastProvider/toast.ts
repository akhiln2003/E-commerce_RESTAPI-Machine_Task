import { toast } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const showSuccessToast = ({
  title,
  description,
  duration = 3000,
}: ToastOptions) => {
  toast.success(title, {
    description,
    duration,
  });
};

export const showErrorToast = ({
  title,
  description,
  duration = 4000,
}: ToastOptions) => {
  toast.error(title, {
    description,
    duration,
  });
};
