import { scheduler } from '@/cron/session'

export async function register() {
  await scheduler()
}
