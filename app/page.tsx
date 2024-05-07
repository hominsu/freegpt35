import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Announcement } from '@/components/announcement'
import { Icons } from '@/components/icons'
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/page-header'
import { Usage } from '@/components/usage'

export default function IndexPage() {
  return (
    <div className="container relative">
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>freegpt35</PageHeaderHeading>
        <PageHeaderDescription>Unlimited free GPT-3.5 turbo API service.</PageHeaderDescription>
        <PageActions>
          <Link
            target="_blank"
            rel="noreferrer"
            href={siteConfig.links.github}
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            <Icons.gitHub className="mr-2 size-4" />
            GitHub
          </Link>
        </PageActions>
      </PageHeader>
      <Usage className="mx-auto max-w-screen-sm items-center justify-center" />
    </div>
  )
}
