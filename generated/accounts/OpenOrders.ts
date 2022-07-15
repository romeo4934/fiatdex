import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface OpenOrdersFields {
  owner: PublicKey
  market: PublicKey
  quoteTokenFree: BN
  quoteTokenLocked: BN
  numberOfOrders: number
  orders: Array<BN>
}

export interface OpenOrdersJSON {
  owner: string
  market: string
  quoteTokenFree: string
  quoteTokenLocked: string
  numberOfOrders: number
  orders: Array<string>
}

export class OpenOrders {
  readonly owner: PublicKey
  readonly market: PublicKey
  readonly quoteTokenFree: BN
  readonly quoteTokenLocked: BN
  readonly numberOfOrders: number
  readonly orders: Array<BN>

  static readonly discriminator = Buffer.from([
    139, 166, 123, 206, 111, 2, 116, 33,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("owner"),
    borsh.publicKey("market"),
    borsh.u64("quoteTokenFree"),
    borsh.u64("quoteTokenLocked"),
    borsh.u8("numberOfOrders"),
    borsh.vec(borsh.u128(), "orders"),
  ])

  constructor(fields: OpenOrdersFields) {
    this.owner = fields.owner
    this.market = fields.market
    this.quoteTokenFree = fields.quoteTokenFree
    this.quoteTokenLocked = fields.quoteTokenLocked
    this.numberOfOrders = fields.numberOfOrders
    this.orders = fields.orders
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<OpenOrders | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<OpenOrders | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): OpenOrders {
    if (!data.slice(0, 8).equals(OpenOrders.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = OpenOrders.layout.decode(data.slice(8))

    return new OpenOrders({
      owner: dec.owner,
      market: dec.market,
      quoteTokenFree: dec.quoteTokenFree,
      quoteTokenLocked: dec.quoteTokenLocked,
      numberOfOrders: dec.numberOfOrders,
      orders: dec.orders,
    })
  }

  toJSON(): OpenOrdersJSON {
    return {
      owner: this.owner.toString(),
      market: this.market.toString(),
      quoteTokenFree: this.quoteTokenFree.toString(),
      quoteTokenLocked: this.quoteTokenLocked.toString(),
      numberOfOrders: this.numberOfOrders,
      orders: this.orders.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: OpenOrdersJSON): OpenOrders {
    return new OpenOrders({
      owner: new PublicKey(obj.owner),
      market: new PublicKey(obj.market),
      quoteTokenFree: new BN(obj.quoteTokenFree),
      quoteTokenLocked: new BN(obj.quoteTokenLocked),
      numberOfOrders: obj.numberOfOrders,
      orders: obj.orders.map((item) => new BN(item)),
    })
  }
}
