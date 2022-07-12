import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface EncryptedOrderFields {
  nonce: Uint8Array
  cipherText: Uint8Array
}

export interface EncryptedOrderJSON {
  nonce: Array<number>
  cipherText: Array<number>
}

export class EncryptedOrder {
  readonly nonce: Uint8Array
  readonly cipherText: Uint8Array

  constructor(fields: EncryptedOrderFields) {
    this.nonce = fields.nonce
    this.cipherText = fields.cipherText
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.vecU8("nonce"), borsh.vecU8("cipherText")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new EncryptedOrder({
      nonce: new Uint8Array(
        obj.nonce.buffer,
        obj.nonce.byteOffset,
        obj.nonce.length
      ),
      cipherText: new Uint8Array(
        obj.cipherText.buffer,
        obj.cipherText.byteOffset,
        obj.cipherText.length
      ),
    })
  }

  static toEncodable(fields: EncryptedOrderFields) {
    return {
      nonce: Buffer.from(
        fields.nonce.buffer,
        fields.nonce.byteOffset,
        fields.nonce.length
      ),
      cipherText: Buffer.from(
        fields.cipherText.buffer,
        fields.cipherText.byteOffset,
        fields.cipherText.length
      ),
    }
  }

  toJSON(): EncryptedOrderJSON {
    return {
      nonce: Array.from(this.nonce.values()),
      cipherText: Array.from(this.cipherText.values()),
    }
  }

  static fromJSON(obj: EncryptedOrderJSON): EncryptedOrder {
    return new EncryptedOrder({
      nonce: Uint8Array.from(obj.nonce),
      cipherText: Uint8Array.from(obj.cipherText),
    })
  }

  toEncodable() {
    return EncryptedOrder.toEncodable(this)
  }
}
