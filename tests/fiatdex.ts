import * as anchor from "@project-serum/anchor";
import { BN } from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Fiatdex } from "../target/types/fiatdex";

import {
  Market,
  User,
  initAuctionObj,
  toFp32,
  getCreateAccountParams
} from "./sdk";

describe("fiatdex", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Fiatdex as Program<Fiatdex>;


  const auctionId = Array.from(Buffer.from("123".padEnd(10))); // Can be up to 10 characters long
  const minBaseOrderSize = new BN(1000);
  const tickSizeNum = 0.1;
  const tickSize = toFp32(tickSizeNum);
  const eventQueueBytes = 1000000;
  const bidsBytes = 64000;
  const asksBytes = 64000;
  const maxOrders = new BN(2);

  let auction: Market;
  let users: Array<User> = [];


  it("inits the market", async () => {
    // Add your test here.

    const tx = await program.methods.initMarket().rpc();
    console.log("Your transaction signature", tx);
  });
});
