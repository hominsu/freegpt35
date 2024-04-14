export class GlobalsVars {
  private static _instance: GlobalsVars
  private _token: string = ''
  private _oaiDeviceId: string = ''

  private constructor() {}

  public static getInstance(): GlobalsVars {
    if (!GlobalsVars._instance) {
      GlobalsVars._instance = new GlobalsVars()
    }
    return GlobalsVars._instance
  }

  public get token(): string {
    return this._token
  }

  public set token(val: string) {
    this._token = val
  }

  public get oaiDeviceId(): string {
    return this._oaiDeviceId
  }

  public set oaiDeviceId(val: string) {
    this._oaiDeviceId = val
  }
}
