import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyContent = async (content: string) => {
  try {
    await window.navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  } catch (error) {
    console.error(error);
    toast.error("failed to copy");
  }
};

export const getFileIcon = (name: string) => {
  switch (name) {

  }
};

export const getLanguageId = (lang: string) => {
  switch (lang) {
    case "py":
      return 71;
    case "cpp":
      return 53;
    case "c":
      return 50;
    case "java":
      return 62;
    case "js":
      return 63;
  }
};
