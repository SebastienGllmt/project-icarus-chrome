import axios from 'axios';

const BackendApiRoute = '18.206.30.1';
const BackendApiPort = 443;
const order = 'DESC';
export const transactionsLimit = 20;
export const addressesLimit = 20;

// TODO: Refactor service call in order to re-use common parameters
// TODO: Map errors in a more specific way

export const getUTXOsForAddresses = addresses =>
  axios(`https://${BackendApiRoute}:${BackendApiPort}/api/txs/utxoForAddresses`,
    {
      method: 'post',
      data: {
        addresses
      }
    }
  ).then(response => response.data);

export const getUTXOsSumsForAddresses = addresses =>
  axios(`https://${BackendApiRoute}:${BackendApiPort}/api/txs/utxoSumForAddresses`,
    {
      method: 'post',
      data: {
        addresses
      }
    }
  ).then(response => response.data);

export const getTransactionsHistoryForAddresses = (addresses, dateFrom) =>
  axios(`https://${BackendApiRoute}:${BackendApiPort}/api/txs/history?order=${order}`,
    {
      method: 'post',
      data: {
        addresses,
        dateFrom
      }
    }
  ).then(response => response.data);

export const getPendingTransactionsForAddresses = (addresses) =>
  axios(`https://${BackendApiRoute}:${BackendApiPort}/api/txs/pending`,
    {
      method: 'post',
      data: {
        addresses
      }
    }
  ).then(response => response.data);

export const sendTx = signedTx =>
  axios(`https://${BackendApiRoute}:${BackendApiPort}/api/txs/signed`,
    {
      method: 'post',
      data: {
        signedTx
      }
    }
  ).then(response => response.data);

export const checkAddressesInUse = addresses =>
  axios(`https://${BackendApiRoute}:${BackendApiPort}/api/addresses/filterUsed`,
    {
      method: 'post',
      data: {
        addresses
      }
    }
  ).then(response => response.data);
