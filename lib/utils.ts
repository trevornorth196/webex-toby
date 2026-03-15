import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  return password.length >= 5
}

export function getInitials(email: string): string {
  return email
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase()
}

export function generateAvatarUrl(email: string): string {
  const seed = encodeURIComponent(email)
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=0078d4&textColor=ffffff`
}
