const anchor = require('@project-serum/anchor');
const BN = anchor.BN;
const PublicKey = require("@project-serum/anchor").web3.PublicKey;

// Configure the local cluster.
anchor.setProvider(anchor.Provider.local("https://api.devnet.solana.com"));