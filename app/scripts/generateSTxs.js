// @flow

import { mapToList } from '../api/ada/lib/utils';
import { newAdaAddress, getAdaAddressesMap } from '../api/ada/adaAddress';
import { getSingleCryptoAccount } from '../api/ada/adaAccount';
import { getAdaTransactionFromSenders, newAdaTransaction, _getAdaTransaction } from '../api/ada/adaTransactions/adaNewTransactions';

const CONFIRMATION_TIME = 60 * 1000; // 60 seconds
const AMOUNT_SENT = '180000';        // 0.18 ada. This amount should be bigger than
                                     //           the fee of the txs (In general ≃0.17)
const AMOUNT_TO_BE_SENT = '1';       // 0.000001 ada. Amount transfered on the generated stxs.

export async function generateSingleStx(password : string) {
  const cryptoAccount = getSingleCryptoAccount();
  const newAddress = _generateNewAddress(cryptoAccount).cadId;

  const createSTxResult = await _getAdaTransaction(
    newAddress,
    AMOUNT_TO_BE_SENT,
    password
  );
  const cborEncodedStx = createSTxResult[0].result.cbor_encoded_tx;
  const bs64STx = Buffer.from(cborEncodedStx).toString('base64');

  console.log(`[generateSTxs] Generated stx ${bs64STx} to ${newAddress}`);
}

/**
 * Generates 'numberOfTxs' signed txs. The generated txs can be executed in any order,
 * given that the loaded wallet is not used after the stxs have been generated.
 *
 * @param {*} password of the loaded address
 * @param {*} numberOfTxs to be generated
 * @param {*} debugging, whether the function should be executed in debugging mode
 * @requires being called in a context where the Rust module has been loaded
 * @requires being called in a context where a wallet has been stored on local storage,
 *           with it having 'numberOfTxs * 0.36' ada.
 */
export async function generateSTxs(password: string,
                                   numberOfTxs: number,
                                   debugging: boolean = false) {
  const log = _logIfDebugging(debugging);
  const cryptoAccount = getSingleCryptoAccount();

  log('[generateSTxs] Starting generating stxs');

  const wallets = [];
  for (let i = 0; i < numberOfTxs; i++) {
    const newAddress = _generateNewAddress(cryptoAccount);
    wallets.push(newAddress);
    log(`[generateSTxs] Generated the address ${newAddress.cadId}`);
  }
  log('[generateSTxs] Generated addresses');

  for (let i = 0; i < numberOfTxs; i++) {
    const newWalletAddr = wallets[i].cadId;
    await newAdaTransaction(newWalletAddr, AMOUNT_SENT, password);
    log(`[generateSTxs] Gave funds to ${newWalletAddr}`);
  }

  log('[generateSTxs] Waiting for the txs that provide funds to be confirmed');
  await new Promise(resolve => setTimeout(resolve, CONFIRMATION_TIME));

  log('[generateSTxs] Starting generating stxs');
  const newAddress = _generateNewAddress(cryptoAccount).cadId;
  for (let i = 0; i < numberOfTxs; i++) {
    const sender = wallets[i];
    const createSTxResult = await getAdaTransactionFromSenders(
      [sender],
      newAddress,
      AMOUNT_TO_BE_SENT,
      password
    );
    const cborEncodedStx = createSTxResult[0].result.cbor_encoded_tx;
    const bs64STx = Buffer.from(cborEncodedStx).toString('base64');

    if (!debugging) {
      console.log(`${bs64STx}`);
    }
    log(`[generateSTxs] Generated stx ${bs64STx} from ${sender.cadId} to ${newAddress}`);
  }

  log(`[generateSTxs] Generated ${numberOfTxs} stxs`);
}


function _logIfDebugging(debugging) {
  function printMsg(msg) {
    if (debugging) {
      console.log(msg);
    }
  }
  return printMsg;
}

function _generateNewAddress(cryptoAccount) {
  const addresses = mapToList(getAdaAddressesMap());
  return newAdaAddress(cryptoAccount, addresses, 'External');
}
