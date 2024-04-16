import * as process from 'process'

import { siteConfig } from '@/config/site'

export async function scheduler() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { default: axios } = await import('axios')

    const refreshSession = async () => {
      axios.get(`http://localhost:3000/api/refresh`).catch((err) => {
        if (err.response) {
          console.error(
            `Error executing the scheduler: ${err.response.status}, ${err.response.statusText}`
          )
        } else {
          console.error(`Error executing the scheduler: ${err}`)
        }
      })
    }

    await refreshSession()
    const { CronJob } = await import('cron')
    const job = new CronJob(siteConfig.server.cron, refreshSession)
    job.start()
  }
}
