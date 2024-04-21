import { createHash, randomInt } from 'crypto'

type ProofTokenConfig = {
  seed: string
  difficulty: string
  userAgent: string
}

export class ProofTokenGenerator {
  private static readonly CORE_COUNTS: number[] = [8, 12, 16, 24]
  private static readonly SCREEN_RESOLUTIONS: number[] = [3000, 4000, 6000]
  private static readonly HASH_ATTEMPTS = 100000
  private static readonly BASE64_PREFIX = 'gAAAAAB'

  public static generateToken({ seed, difficulty, userAgent }: ProofTokenConfig): string {
    const core = this.getRandomElement(this.CORE_COUNTS)
    const screen = this.getRandomElement(this.SCREEN_RESOLUTIONS)
    const timestamp = this.getFormattedTimestamp()
    const config = [core + screen, timestamp, 4294705152, 0, userAgent]
    const diffLength = difficulty.length / 2

    for (let i = 0; i < this.HASH_ATTEMPTS; i++) {
      config[3] = i
      const jsonData = JSON.stringify(config)
      const base = Buffer.from(jsonData).toString('base64')
      const hashValue = this.generateHash(seed + base)

      if (hashValue.substring(0, diffLength) <= difficulty) {
        return this.BASE64_PREFIX + base
      }
    }

    return this.fallbackToken(seed)
  }

  private static getRandomElement<T>(array: T[]): T {
    return array[randomInt(0, array.length)]
  }

  private static getFormattedTimestamp(): string {
    const now = new Date(Date.now() - 8 * 3600 * 1000)
    return now.toUTCString().replace('GMT', 'GMT-0500 (Eastern Time)')
  }

  private static generateHash(data: string): string {
    return createHash('sha3-512').update(data).digest('hex')
  }

  private static fallbackToken(seed: string): string {
    const fallbackBase = Buffer.from(`"${seed}"`).toString('base64')
    return this.BASE64_PREFIX + 'wQ8Lk5FbGpA2NcR9dShT6gYjU7VxZ4D' + fallbackBase
  }
}
