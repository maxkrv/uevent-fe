import { type ClassValue, clsx } from 'clsx';
import { HTTPError } from 'ky';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const handleErrorMessage = (error: HTTPError) => {
  const messagesToIgnore: string[] = ['refresh', 'Unauthorized', 'undefined'];

  if (messagesToIgnore.some((message) => error.message.toLowerCase().includes(message.toLowerCase()))) return;

  toast(error.message, {
    richColors: true
  });
};
