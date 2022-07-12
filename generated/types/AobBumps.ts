import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface AobBumpsFields {
  quoteVault: number
  baseVault: number
  orderbookManager: number
}

export interface AobBumpsJSON {
  quoteVault: number
  baseVault: number
  orderbookManager: number
}

export class AobBumps {
  readonly quoteVault: number
  readonly baseVault: number
  readonly orderbookManager: number

  constructor(fields: AobBumpsFields) {
    this.quoteVault = fields.quoteVault
    this.baseVault = fields.baseVault
    this.orderbookManager = fields.orderbookManager
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u8("quoteVault"),
        borsh.u8("baseVault"),
        borsh.u8("orderbookManager"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new AobBumps({
      quoteVault: obj.quoteVault,
      baseVault: obj.baseVault,
      orderbookManager: obj.orderbookManager,
    })
  }

  static toEncodable(fields: AobBumpsFields) {
    return {
      quoteVault: fields.quoteVault,
      baseVault: fields.baseVault,
      orderbookManager: fields.orderbookManager,
    }
  }

  toJSON(): AobBumpsJSON {
    return {
      quoteVault: this.quoteVault,
      baseVault: this.baseVault,
      orderbookManager: this.orderbookManager,
    }
  }

  static fromJSON(obj: AobBumpsJSON): AobBumps {
    return new AobBumps({
      quoteVault: obj.quoteVault,
      baseVault: obj.baseVault,
      orderbookManager: obj.orderbookManager,
    })
  }

  toEncodable() {
    return AobBumps.toEncodable(this)
  }
}
