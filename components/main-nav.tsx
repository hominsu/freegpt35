'use client'

import * as React from 'react'
import Link from 'next/link'

import { siteConfig } from '@/config/site'

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="https://homing.so/about"
          className="text-foreground transition-colors hover:text-foreground/80"
        >
          Author
        </Link>
      </nav>
    </div>
  )
}
