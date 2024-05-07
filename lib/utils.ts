import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function CreateFullUrl(key: string, base?: string) {
  if (!base) {
    console.error('Base URL is undefined')
    return null
  }

  try {
    const baseUrl = new URL(base)
    baseUrl.pathname += `/${key}`
    return baseUrl.href
  } catch (error) {
    console.error('Invalid URL:', error)
    return ''
  }
}
