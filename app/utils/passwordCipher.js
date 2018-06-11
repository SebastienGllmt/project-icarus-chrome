// @flow

import { Blake2b } from 'rust-cardano-crypto';
import aesjs from 'aes-js';
import { Buffer } from 'safe-buffer';

const iv = Buffer.alloc(16); // it's iv = 0 simply
const getCipher = (key) => new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(iv)); // eslint-disable-line
const getAesKeyFrom = (password) => Buffer.from((Blake2b.blake2b_256(password)));

export function encryptWithPassword(
  password: string,
  bytes: Uint8Array
): string {
  const aesKey = getAesKeyFrom(password);
  const encryptedBytes = getCipher(aesKey).encrypt(bytes);
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
}

export function decryptWithPassword(
  password: string,
  encryptedHex: string
): Uint8Array {
  const aesKey = getAesKeyFrom(password);
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
  const decryptedBytes = getCipher(aesKey).decrypt(encryptedBytes);
  return decryptedBytes;
}
