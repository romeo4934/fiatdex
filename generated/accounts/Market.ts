import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MarketFields {
  bump: number
  bumps: types.AobBumpsFields
  authority: PublicKey
  marketId: Array<number>
  eventQueue: PublicKey
  bids: PublicKey
  asks: PublicKey
  quoteMint: PublicKey
  baseMint: PublicKey
  quoteVault: PublicKey
  baseVault: PublicKey
  minBaseOrderSize: BN
  tickSize: BN
  askSearchStackDepth: number
  bidSearchStackDepth: number
  askSearchStackValues: Array<number>
  bidSearchStackValues: Array<number>
  currentBidKey: BN
  currentAskKey: BN
  currentBidQuantityFilled: BN
  currentAskQuantityFilled: BN
  totalQuantityFilledSoFar: BN
  hasFoundClearingPrice: boolean
  totalQuantityMatched: BN
  remainingAskFills: BN
  remainingBidFills: BN
  finalBidPrice: BN
  finalAskPrice: BN
  clearingPrice: BN
}

export interface MarketJSON {
  bump: number
  bumps: types.AobBumpsJSON
  authority: string
  marketId: Array<number>
  eventQueue: string
  bids: string
  asks: string
  quoteMint: string
  baseMint: string
  quoteVault: string
  baseVault: string
  minBaseOrderSize: string
  tickSize: string
  askSearchStackDepth: number
  bidSearchStackDepth: number
  askSearchStackValues: Array<number>
  bidSearchStackValues: Array<number>
  currentBidKey: string
  currentAskKey: string
  currentBidQuantityFilled: string
  currentAskQuantityFilled: string
  totalQuantityFilledSoFar: string
  hasFoundClearingPrice: boolean
  totalQuantityMatched: string
  remainingAskFills: string
  remainingBidFills: string
  finalBidPrice: string
  finalAskPrice: string
  clearingPrice: string
}

export class Market {
  readonly bump: number
  readonly bumps: types.AobBumps
  readonly authority: PublicKey
  readonly marketId: Array<number>
  readonly eventQueue: PublicKey
  readonly bids: PublicKey
  readonly asks: PublicKey
  readonly quoteMint: PublicKey
  readonly baseMint: PublicKey
  readonly quoteVault: PublicKey
  readonly baseVault: PublicKey
  readonly minBaseOrderSize: BN
  readonly tickSize: BN
  readonly askSearchStackDepth: number
  readonly bidSearchStackDepth: number
  readonly askSearchStackValues: Array<number>
  readonly bidSearchStackValues: Array<number>
  readonly currentBidKey: BN
  readonly currentAskKey: BN
  readonly currentBidQuantityFilled: BN
  readonly currentAskQuantityFilled: BN
  readonly totalQuantityFilledSoFar: BN
  readonly hasFoundClearingPrice: boolean
  readonly totalQuantityMatched: BN
  readonly remainingAskFills: BN
  readonly remainingBidFills: BN
  readonly finalBidPrice: BN
  readonly finalAskPrice: BN
  readonly clearingPrice: BN

  static readonly discriminator = Buffer.from([
    219, 190, 213, 55, 0, 227, 198, 154,
  ])

  static readonly layout = borsh.struct([
    borsh.u8("bump"),
    types.AobBumps.layout("bumps"),
    borsh.publicKey("authority"),
    borsh.array(borsh.u8(), 10, "marketId"),
    borsh.publicKey("eventQueue"),
    borsh.publicKey("bids"),
    borsh.publicKey("asks"),
    borsh.publicKey("quoteMint"),
    borsh.publicKey("baseMint"),
    borsh.publicKey("quoteVault"),
    borsh.publicKey("baseVault"),
    borsh.u64("minBaseOrderSize"),
    borsh.u64("tickSize"),
    borsh.u8("askSearchStackDepth"),
    borsh.u8("bidSearchStackDepth"),
    borsh.array(borsh.u32(), 32, "askSearchStackValues"),
    borsh.array(borsh.u32(), 32, "bidSearchStackValues"),
    borsh.u128("currentBidKey"),
    borsh.u128("currentAskKey"),
    borsh.u64("currentBidQuantityFilled"),
    borsh.u64("currentAskQuantityFilled"),
    borsh.u64("totalQuantityFilledSoFar"),
    borsh.bool("hasFoundClearingPrice"),
    borsh.u64("totalQuantityMatched"),
    borsh.u64("remainingAskFills"),
    borsh.u64("remainingBidFills"),
    borsh.u64("finalBidPrice"),
    borsh.u64("finalAskPrice"),
    borsh.u64("clearingPrice"),
  ])

  constructor(fields: MarketFields) {
    this.bump = fields.bump
    this.bumps = new types.AobBumps({ ...fields.bumps })
    this.authority = fields.authority
    this.marketId = fields.marketId
    this.eventQueue = fields.eventQueue
    this.bids = fields.bids
    this.asks = fields.asks
    this.quoteMint = fields.quoteMint
    this.baseMint = fields.baseMint
    this.quoteVault = fields.quoteVault
    this.baseVault = fields.baseVault
    this.minBaseOrderSize = fields.minBaseOrderSize
    this.tickSize = fields.tickSize
    this.askSearchStackDepth = fields.askSearchStackDepth
    this.bidSearchStackDepth = fields.bidSearchStackDepth
    this.askSearchStackValues = fields.askSearchStackValues
    this.bidSearchStackValues = fields.bidSearchStackValues
    this.currentBidKey = fields.currentBidKey
    this.currentAskKey = fields.currentAskKey
    this.currentBidQuantityFilled = fields.currentBidQuantityFilled
    this.currentAskQuantityFilled = fields.currentAskQuantityFilled
    this.totalQuantityFilledSoFar = fields.totalQuantityFilledSoFar
    this.hasFoundClearingPrice = fields.hasFoundClearingPrice
    this.totalQuantityMatched = fields.totalQuantityMatched
    this.remainingAskFills = fields.remainingAskFills
    this.remainingBidFills = fields.remainingBidFills
    this.finalBidPrice = fields.finalBidPrice
    this.finalAskPrice = fields.finalAskPrice
    this.clearingPrice = fields.clearingPrice
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<Market | null> {
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
  ): Promise<Array<Market | null>> {
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

  static decode(data: Buffer): Market {
    if (!data.slice(0, 8).equals(Market.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Market.layout.decode(data.slice(8))

    return new Market({
      bump: dec.bump,
      bumps: types.AobBumps.fromDecoded(dec.bumps),
      authority: dec.authority,
      marketId: dec.marketId,
      eventQueue: dec.eventQueue,
      bids: dec.bids,
      asks: dec.asks,
      quoteMint: dec.quoteMint,
      baseMint: dec.baseMint,
      quoteVault: dec.quoteVault,
      baseVault: dec.baseVault,
      minBaseOrderSize: dec.minBaseOrderSize,
      tickSize: dec.tickSize,
      askSearchStackDepth: dec.askSearchStackDepth,
      bidSearchStackDepth: dec.bidSearchStackDepth,
      askSearchStackValues: dec.askSearchStackValues,
      bidSearchStackValues: dec.bidSearchStackValues,
      currentBidKey: dec.currentBidKey,
      currentAskKey: dec.currentAskKey,
      currentBidQuantityFilled: dec.currentBidQuantityFilled,
      currentAskQuantityFilled: dec.currentAskQuantityFilled,
      totalQuantityFilledSoFar: dec.totalQuantityFilledSoFar,
      hasFoundClearingPrice: dec.hasFoundClearingPrice,
      totalQuantityMatched: dec.totalQuantityMatched,
      remainingAskFills: dec.remainingAskFills,
      remainingBidFills: dec.remainingBidFills,
      finalBidPrice: dec.finalBidPrice,
      finalAskPrice: dec.finalAskPrice,
      clearingPrice: dec.clearingPrice,
    })
  }

  toJSON(): MarketJSON {
    return {
      bump: this.bump,
      bumps: this.bumps.toJSON(),
      authority: this.authority.toString(),
      marketId: this.marketId,
      eventQueue: this.eventQueue.toString(),
      bids: this.bids.toString(),
      asks: this.asks.toString(),
      quoteMint: this.quoteMint.toString(),
      baseMint: this.baseMint.toString(),
      quoteVault: this.quoteVault.toString(),
      baseVault: this.baseVault.toString(),
      minBaseOrderSize: this.minBaseOrderSize.toString(),
      tickSize: this.tickSize.toString(),
      askSearchStackDepth: this.askSearchStackDepth,
      bidSearchStackDepth: this.bidSearchStackDepth,
      askSearchStackValues: this.askSearchStackValues,
      bidSearchStackValues: this.bidSearchStackValues,
      currentBidKey: this.currentBidKey.toString(),
      currentAskKey: this.currentAskKey.toString(),
      currentBidQuantityFilled: this.currentBidQuantityFilled.toString(),
      currentAskQuantityFilled: this.currentAskQuantityFilled.toString(),
      totalQuantityFilledSoFar: this.totalQuantityFilledSoFar.toString(),
      hasFoundClearingPrice: this.hasFoundClearingPrice,
      totalQuantityMatched: this.totalQuantityMatched.toString(),
      remainingAskFills: this.remainingAskFills.toString(),
      remainingBidFills: this.remainingBidFills.toString(),
      finalBidPrice: this.finalBidPrice.toString(),
      finalAskPrice: this.finalAskPrice.toString(),
      clearingPrice: this.clearingPrice.toString(),
    }
  }

  static fromJSON(obj: MarketJSON): Market {
    return new Market({
      bump: obj.bump,
      bumps: types.AobBumps.fromJSON(obj.bumps),
      authority: new PublicKey(obj.authority),
      marketId: obj.marketId,
      eventQueue: new PublicKey(obj.eventQueue),
      bids: new PublicKey(obj.bids),
      asks: new PublicKey(obj.asks),
      quoteMint: new PublicKey(obj.quoteMint),
      baseMint: new PublicKey(obj.baseMint),
      quoteVault: new PublicKey(obj.quoteVault),
      baseVault: new PublicKey(obj.baseVault),
      minBaseOrderSize: new BN(obj.minBaseOrderSize),
      tickSize: new BN(obj.tickSize),
      askSearchStackDepth: obj.askSearchStackDepth,
      bidSearchStackDepth: obj.bidSearchStackDepth,
      askSearchStackValues: obj.askSearchStackValues,
      bidSearchStackValues: obj.bidSearchStackValues,
      currentBidKey: new BN(obj.currentBidKey),
      currentAskKey: new BN(obj.currentAskKey),
      currentBidQuantityFilled: new BN(obj.currentBidQuantityFilled),
      currentAskQuantityFilled: new BN(obj.currentAskQuantityFilled),
      totalQuantityFilledSoFar: new BN(obj.totalQuantityFilledSoFar),
      hasFoundClearingPrice: obj.hasFoundClearingPrice,
      totalQuantityMatched: new BN(obj.totalQuantityMatched),
      remainingAskFills: new BN(obj.remainingAskFills),
      remainingBidFills: new BN(obj.remainingBidFills),
      finalBidPrice: new BN(obj.finalBidPrice),
      finalAskPrice: new BN(obj.finalAskPrice),
      clearingPrice: new BN(obj.clearingPrice),
    })
  }
}
