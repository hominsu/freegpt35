import React from 'react'

import { highlightCode } from '@/lib/highlight-code'
import { cn } from '@/lib/utils'
import { BlockCopyButton } from '@/components/code-copy-button'

interface CodeBlockProps {
  code: string
  className?: string
}

export async function CodeBlock({ code, className, ...props }: CodeBlockProps) {
  const html = await highlightCode(code)
  return (
    <div
      className={cn(
        'relative overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900 [&_pre]:relative [&_pre]:rounded [&_pre]:bg-transparent [&_pre]:px-4 [&_pre]:py-[2px] [&_pre]:font-mono [&_pre]:text-sm',
        className
      )}
      {...props}
    >
      <div data-rehype-pretty-code-fragment dangerouslySetInnerHTML={{ __html: html }} />
      <BlockCopyButton
        name="copy code"
        className="absolute right-4 top-4 z-10 size-6 border-none bg-zinc-950 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 focus-visible:ring-1 focus-visible:ring-ring dark:bg-zinc-900 [&_svg]:size-3"
        code={code}
      ></BlockCopyButton>
    </div>
  )
}
