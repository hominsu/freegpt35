const hasKey = <T extends object>(obj: T, key: PropertyKey): key is keyof T => key in obj

export type Session = {
  [key: string]: any
  deviceId: string
  persona: string
  arkose: {
    required: boolean
    dx: any
  }
  turnstile: {
    required: boolean
  }
  proofofwork: {
    required: boolean
    seed: string
    difficulty: string
  }
  token: string
}

export class GlobalsVars {
  private static _instance: GlobalsVars
  private _session: Session

  private constructor() {
    this._session = new Proxy<Session>(
      {
        deviceId: '',
        persona: '',
        arkose: { required: false, dx: null },
        turnstile: { required: false },
        proofofwork: { required: false, seed: '', difficulty: '' },
        token: '',
      },
      {
        get: (target, key) => (hasKey(target, key) ? target[key] : undefined),
        set: (target, key, value) => {
          if (hasKey(target, key)) {
            target[key] = value
            return true
          }
          return false
        },
      }
    )
  }

  public static getInstance(): GlobalsVars {
    if (!GlobalsVars._instance) {
      GlobalsVars._instance = new GlobalsVars()
    }
    return GlobalsVars._instance
  }

  public get session(): Session {
    return this._session
  }

  public set session(newSession: Partial<Session>) {
    Object.entries(newSession).forEach(([key, value]) => {
      if (hasKey(this._session, key)) {
        this._session[key] = value
      }
    })
  }
}
