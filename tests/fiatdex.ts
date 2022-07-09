import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Fiatdex } from "../target/types/fiatdex";

describe("fiatdex", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Fiatdex as Program<Fiatdex>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
