export type CustomError = NotImplemented | InvalidAobMarketState

export class NotImplemented extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "NotImplemented"
  readonly msg = "Function not yet implemented"

  constructor(readonly logs?: string[]) {
    super("6000: Function not yet implemented")
  }
}

export class InvalidAobMarketState extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "InvalidAobMarketState"
  readonly msg = "Invalid account data on AOB market state"

  constructor(readonly logs?: string[]) {
    super("6001: Invalid account data on AOB market state")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new NotImplemented(logs)
    case 6001:
      return new InvalidAobMarketState(logs)
  }

  return null
}
