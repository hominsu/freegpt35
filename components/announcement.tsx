import Link from 'next/link'
import { ArrowRightIcon } from '@radix-ui/react-icons'

import { siteConfig } from '@/config/site'
import { Separator } from '@/components/ui/separator'

export function Announcement() {
  return (
    <Link
      href={siteConfig.links.github}
      className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
    >
      🎉 <Separator className="mx-2 h-4" orientation="vertical" />{' '}
      <span className="sm:hidden">quick one - hit up & smash that ⭐️ !</span>
      <span className="hidden sm:inline">hey peeps! quick one - hit up & smash that ⭐️ !</span>
      <ArrowRightIcon className="ml-1 size-4" />
    </Link>
  )
}
