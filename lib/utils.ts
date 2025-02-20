import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Turndown from 'turndown';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function kebabToTitleCase(theme: string) {
  return theme
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function htmlToMarkdown(element: HTMLDivElement) {
  const turndown = new Turndown();
  return turndown.turndown(element);
}

export function stripQueryParams(url: string) {
  return url.split('?')[0];
}
