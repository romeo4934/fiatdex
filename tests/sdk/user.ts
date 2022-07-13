import * as anchor from "@project-serum/anchor";
import { BN } from "@project-serum/anchor";
import { PublicKey, Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createAssociatedTokenAccount, mintTo, getAssociatedTokenAddress } from "@solana/spl-token";
import nacl from "tweetnacl";
import { Fiatdex } from "../../target/types/fiatdex";
import * as genTypes from "../../generated/types";
import * as genAccs from "../../generated/accounts";
import { Market } from "./market";
import { SSL_OP_NETSCAPE_CA_DN_BUG } from "constants";


export interface User {
  userKeypair?: Keypair,
  user: PublicKey,
  openOrders: PublicKey,
  orderHistory: PublicKey,
  userBase: PublicKey,
  userQuote: PublicKey,
  side: genTypes.SideKind,
}

export async function initUser(program: anchor.Program<Fiatdex>, provider: anchor.Provider, wallet: anchor.Wallet, auction: Auction, side: genTypes.SideKind, numBaseTokens: BN, numQuoteTokens: BN, maxOrders: BN): Promise<User> {
  let userKeypair = new anchor.web3.Keypair();
  let user = userKeypair.publicKey;
  await provider.connection.requestAirdrop(user, 1_000_000_00)
  let userBase = await createAssociatedTokenAccount(
    provider.connection,
    wallet.payer,
    auction.baseMint,
    user
  );
  let userQuote = await createAssociatedTokenAccount(
    provider.connection,
    wallet.payer,
    auction.quoteMint,
    user
  );
  if (numBaseTokens.gt(new BN(0))) {
    await mintTo(
      provider.connection,
      wallet.payer,
      auction.baseMint,
      userBase,
      wallet.publicKey,
      numBaseTokens.toNumber(),
    );
  }
  if (numQuoteTokens.gt(new BN(0))) {
    await mintTo(
      provider.connection,
      wallet.payer,
      auction.quoteMint,
      userQuote,
      wallet.publicKey,
      numQuoteTokens.toNumber(),
    );
  }
  let [openOrders] = await anchor.web3.PublicKey.findProgramAddress(
    [user.toBuffer(), Buffer.from("open_orders"), Buffer.from(auction.auctionId), wallet.publicKey.toBuffer()],
    program.programId
  );
  let [orderHistory] = await anchor.web3.PublicKey.findProgramAddress(
    [user.toBuffer(), Buffer.from("order_history"), Buffer.from(auction.auctionId), wallet.publicKey.toBuffer()],
    program.programId
  );
  return {
    userKeypair,
    user,
    openOrders,
    orderHistory,
    userBase,
    userQuote,
    side,
  }
}