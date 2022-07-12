import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MarketFields {
  bump: number
  bumps: types.AobBumpsFields
  authority: PublicKey
  startTime: BN
  endAsks: BN
  startBids: BN
  endBids: BN
  areAsksEncrypted: boolean
  areBidsEncrypted: boolean
  finalPriceType: types.FinalPriceTypesKind
  quoteMint: PublicKey
  baseMint: PublicKey
  quoteVault: PublicKey
  baseVault: PublicKey
  baseTokenLots: BN
  quoteTokenLots: BN
  minBaseTokenQuantity: BN
  currentAskKey: BN
  currentBidKey: BN
  quantityFilledInThisBid: BN
  quantityFilledInThisAsk: BN
  totalQuantityFilledSoFar: BN
  hasFoundClearingPrice: boolean
  totalQuantityMatched: BN
  finalAskPrice: BN
  finalBidPrice: BN
  clearingPrice: BN
}

export interface MarketJSON {
  bump: number
  bumps: types.AobBumpsJSON
  authority: string
  startTime: string
  endAsks: string
  startBids: string
  endBids: string
  areAsksEncrypted: boolean
  areBidsEncrypted: boolean
  finalPriceType: types.FinalPriceTypesJSON
  quoteMint: string
  baseMint: string
  quoteVault: string
  baseVault: string
  baseTokenLots: string
  quoteTokenLots: string
  minBaseTokenQuantity: string
  currentAskKey: string
  currentBidKey: string
  quantityFilledInThisBid: string
  quantityFilledInThisAsk: string
  totalQuantityFilledSoFar: string
  hasFoundClearingPrice: boolean
  totalQuantityMatched: string
  finalAskPrice: string
  finalBidPrice: string
  clearingPrice: string
}

export class Market {
  readonly bump: number
  readonly bumps: types.AobBumps
  readonly authority: PublicKey
  readonly startTime: BN
  readonly endAsks: BN
  readonly startBids: BN
  readonly endBids: BN
  readonly areAsksEncrypted: boolean
  readonly areBidsEncrypted: boolean
  readonly finalPriceType: types.FinalPriceTypesKind
  readonly quoteMint: PublicKey
  readonly baseMint: PublicKey
  readonly quoteVault: PublicKey
  readonly baseVault: PublicKey
  readonly baseTokenLots: BN
  readonly quoteTokenLots: BN
  readonly minBaseTokenQuantity: BN
  readonly currentAskKey: BN
  readonly currentBidKey: BN
  readonly quantityFilledInThisBid: BN
  readonly quantityFilledInThisAsk: BN
  readonly totalQuantityFilledSoFar: BN
  readonly hasFoundClearingPrice: boolean
  readonly totalQuantityMatched: BN
  readonly finalAskPrice: BN
  readonly finalBidPrice: BN
  readonly clearingPrice: BN

  static readonly discriminator = Buffer.from([
    219, 190, 213, 55, 0, 227, 198, 154,
  ])

  static readonly layout = borsh.struct([
    borsh.u8("bump"),
    types.AobBumps.layout("bumps"),
    borsh.publicKey("authority"),
    borsh.i64("startTime"),
    borsh.i64("endAsks"),
    borsh.i64("startBids"),
    borsh.i64("endBids"),
    borsh.bool("areAsksEncrypted"),
    borsh.bool("areBidsEncrypted"),
    types.FinalPriceTypes.layout("finalPriceType"),
    borsh.publicKey("quoteMint"),
    borsh.publicKey("baseMint"),
    borsh.publicKey("quoteVault"),
    borsh.publicKey("baseVault"),
    borsh.u64("baseTokenLots"),
    borsh.u64("quoteTokenLots"),
    borsh.u64("minBaseTokenQuantity"),
    borsh.u128("currentAskKey"),
    borsh.u128("currentBidKey"),
    borsh.u64("quantityFilledInThisBid"),
    borsh.u64("quantityFilledInThisAsk"),
    borsh.u64("totalQuantityFilledSoFar"),
    borsh.bool("hasFoundClearingPrice"),
    borsh.u64("totalQuantityMatched"),
    borsh.u64("finalAskPrice"),
    borsh.u64("finalBidPrice"),
    borsh.u64("clearingPrice"),
  ])

  constructor(fields: MarketFields) {
    this.bump = fields.bump
    this.bumps = new types.AobBumps({ ...fields.bumps })
    this.authority = fields.authority
    this.startTime = fields.startTime
    this.endAsks = fields.endAsks
    this.startBids = fields.startBids
    this.endBids = fields.endBids
    this.areAsksEncrypted = fields.areAsksEncrypted
    this.areBidsEncrypted = fields.areBidsEncrypted
    this.finalPriceType = fields.finalPriceType
    this.quoteMint = fields.quoteMint
    this.baseMint = fields.baseMint
    this.quoteVault = fields.quoteVault
    this.baseVault = fields.baseVault
    this.baseTokenLots = fields.baseTokenLots
    this.quoteTokenLots = fields.quoteTokenLots
    this.minBaseTokenQuantity = fields.minBaseTokenQuantity
    this.currentAskKey = fields.currentAskKey
    this.currentBidKey = fields.currentBidKey
    this.quantityFilledInThisBid = fields.quantityFilledInThisBid
    this.quantityFilledInThisAsk = fields.quantityFilledInThisAsk
    this.totalQuantityFilledSoFar = fields.totalQuantityFilledSoFar
    this.hasFoundClearingPrice = fields.hasFoundClearingPrice
    this.totalQuantityMatched = fields.totalQuantityMatched
    this.finalAskPrice = fields.finalAskPrice
    this.finalBidPrice = fields.finalBidPrice
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
      startTime: dec.startTime,
      endAsks: dec.endAsks,
      startBids: dec.startBids,
      endBids: dec.endBids,
      areAsksEncrypted: dec.areAsksEncrypted,
      areBidsEncrypted: dec.areBidsEncrypted,
      finalPriceType: types.FinalPriceTypes.fromDecoded(dec.finalPriceType),
      quoteMint: dec.quoteMint,
      baseMint: dec.baseMint,
      quoteVault: dec.quoteVault,
      baseVault: dec.baseVault,
      baseTokenLots: dec.baseTokenLots,
      quoteTokenLots: dec.quoteTokenLots,
      minBaseTokenQuantity: dec.minBaseTokenQuantity,
      currentAskKey: dec.currentAskKey,
      currentBidKey: dec.currentBidKey,
      quantityFilledInThisBid: dec.quantityFilledInThisBid,
      quantityFilledInThisAsk: dec.quantityFilledInThisAsk,
      totalQuantityFilledSoFar: dec.totalQuantityFilledSoFar,
      hasFoundClearingPrice: dec.hasFoundClearingPrice,
      totalQuantityMatched: dec.totalQuantityMatched,
      finalAskPrice: dec.finalAskPrice,
      finalBidPrice: dec.finalBidPrice,
      clearingPrice: dec.clearingPrice,
    })
  }

  toJSON(): MarketJSON {
    return {
      bump: this.bump,
      bumps: this.bumps.toJSON(),
      authority: this.authority.toString(),
      startTime: this.startTime.toString(),
      endAsks: this.endAsks.toString(),
      startBids: this.startBids.toString(),
      endBids: this.endBids.toString(),
      areAsksEncrypted: this.areAsksEncrypted,
      areBidsEncrypted: this.areBidsEncrypted,
      finalPriceType: this.finalPriceType.toJSON(),
      quoteMint: this.quoteMint.toString(),
      baseMint: this.baseMint.toString(),
      quoteVault: this.quoteVault.toString(),
      baseVault: this.baseVault.toString(),
      baseTokenLots: this.baseTokenLots.toString(),
      quoteTokenLots: this.quoteTokenLots.toString(),
      minBaseTokenQuantity: this.minBaseTokenQuantity.toString(),
      currentAskKey: this.currentAskKey.toString(),
      currentBidKey: this.currentBidKey.toString(),
      quantityFilledInThisBid: this.quantityFilledInThisBid.toString(),
      quantityFilledInThisAsk: this.quantityFilledInThisAsk.toString(),
      totalQuantityFilledSoFar: this.totalQuantityFilledSoFar.toString(),
      hasFoundClearingPrice: this.hasFoundClearingPrice,
      totalQuantityMatched: this.totalQuantityMatched.toString(),
      finalAskPrice: this.finalAskPrice.toString(),
      finalBidPrice: this.finalBidPrice.toString(),
      clearingPrice: this.clearingPrice.toString(),
    }
  }

  static fromJSON(obj: MarketJSON): Market {
    return new Market({
      bump: obj.bump,
      bumps: types.AobBumps.fromJSON(obj.bumps),
      authority: new PublicKey(obj.authority),
      startTime: new BN(obj.startTime),
      endAsks: new BN(obj.endAsks),
      startBids: new BN(obj.startBids),
      endBids: new BN(obj.endBids),
      areAsksEncrypted: obj.areAsksEncrypted,
      areBidsEncrypted: obj.areBidsEncrypted,
      finalPriceType: types.FinalPriceTypes.fromJSON(obj.finalPriceType),
      quoteMint: new PublicKey(obj.quoteMint),
      baseMint: new PublicKey(obj.baseMint),
      quoteVault: new PublicKey(obj.quoteVault),
      baseVault: new PublicKey(obj.baseVault),
      baseTokenLots: new BN(obj.baseTokenLots),
      quoteTokenLots: new BN(obj.quoteTokenLots),
      minBaseTokenQuantity: new BN(obj.minBaseTokenQuantity),
      currentAskKey: new BN(obj.currentAskKey),
      currentBidKey: new BN(obj.currentBidKey),
      quantityFilledInThisBid: new BN(obj.quantityFilledInThisBid),
      quantityFilledInThisAsk: new BN(obj.quantityFilledInThisAsk),
      totalQuantityFilledSoFar: new BN(obj.totalQuantityFilledSoFar),
      hasFoundClearingPrice: obj.hasFoundClearingPrice,
      totalQuantityMatched: new BN(obj.totalQuantityMatched),
      finalAskPrice: new BN(obj.finalAskPrice),
      finalBidPrice: new BN(obj.finalBidPrice),
      clearingPrice: new BN(obj.clearingPrice),
    })
  }
}
