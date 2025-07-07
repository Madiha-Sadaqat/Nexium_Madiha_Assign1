<<<<<<< HEAD
import { type ClassValue, clsx } from "clsx"
=======
import { clsx, type ClassValue } from "clsx"
>>>>>>> e33f10e4325cdeec7f0ef8b28cbdb513d11e6c60
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
<<<<<<< HEAD
} 
=======
}
>>>>>>> e33f10e4325cdeec7f0ef8b28cbdb513d11e6c60
