import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitMarketArgs {
  marketId: Array<number>
  minBaseOrderSize: BN
  tickSize: BN
}

export const layout = borsh.struct([
  borsh.array(borsh.u8(), 10, "marketId"),
  borsh.u64("minBaseOrderSize"),
  borsh.u64("tickSize"),
])

export function initMarket(args: InitMarketArgs) {
  const keys: Array<AccountMeta> = []
  const identifier = Buffer.from([33, 253, 15, 116, 89, 25, 127, 236])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      marketId: args.marketId,
      minBaseOrderSize: args.minBaseOrderSize,
      tickSize: args.tickSize,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
