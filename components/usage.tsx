import React, { FC, useMemo } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code'

interface UsageProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Usage: FC<UsageProps> = ({ className, ...props }: UsageProps) => {
  const code = useMemo(
    () =>
      'curl -X POST "http://127.0.0.1:3000/v1/chat/completions" \\\n' +
      '     -H "Authorization: Bearer ${process.env.API_KEY}" \\\n' +
      '     -H "Content-Type: application/json" \\\n' +
      "     -d '{\n" +
      '           "model": "gpt-3.5-turbo",\n' +
      '           "messages": [{"role": "user", "content": "Hello"}],\n' +
      "         }'",
    []
  )

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Test your deploy</CardTitle>
        <CardDescription>Replace the host to yours, then run</CardDescription>
      </CardHeader>
      <CardContent>
        <CodeBlock code={code} />
      </CardContent>
    </Card>
  )
}
