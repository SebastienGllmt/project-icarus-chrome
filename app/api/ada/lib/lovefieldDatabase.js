import lf from 'lovefield';

const txsTableName = 'Txs';
const txsTableFields = {
  CT_AMOUNT: 'ctAmount',
  CT_BLOCK_NUMBER: 'ctBlockNumber',
  CT_ID: 'ctId',
  CT_INPUTS: 'ctInputs',
  CT_IS_OUTGOING: 'ctIsOutgoing',
  CT_META: 'ctMeta',
  CTM_DATE: 'ctmDate',
  CT_OUTPUTS: 'ctOutputs',
  CT_CONDITION: 'ctCondition'
};
const orders = {
  ASC: lf.Order.ASC,
  DESC: lf.Order.DESC
};

const LovefieldDB = {
  db: null,
  txsTableName,
  txsTableFields,
  orders
};

export default LovefieldDB;

// Ensure we are only creating a single instance of the lovefield database
export const loadLovefieldDB = async() => {
  if (LovefieldDB.db) {
    return Promise.resolve(LovefieldDB.db);
  }
  const schemaBuilder = lf.schema.create('icarus-schema', 1);
  schemaBuilder.createTable('Txs')
    .addColumn('id', lf.Type.INTEGER)
    .addColumn(txsTableFields.CT_AMOUNT, lf.Type.OBJECT)
    .addColumn(txsTableFields.CT_BLOCK_NUMBER, lf.Type.STRING)
    .addColumn(txsTableFields.CT_ID, lf.Type.STRING)
    .addColumn(txsTableFields.CT_INPUTS, lf.Type.OBJECT)
    .addColumn(txsTableFields.CT_IS_OUTGOING, lf.Type.BOOLEAN)
    .addColumn(txsTableFields.CT_META, lf.Type.OBJECT)
    .addColumn(txsTableFields.CTM_DATE, lf.Type.DATE_TIME)
    .addColumn(txsTableFields.CT_OUTPUTS, lf.Type.OBJECT)
    .addColumn(txsTableFields.CT_CONDITION, lf.Type.STRING)
    .addPrimaryKey(['id'], lf.Order.ASC)
    .addUnique('unique', [txsTableFields.CT_ID]);
  return await schemaBuilder.connect().then(db => {
    LovefieldDB.db = db;
    return db;
  });
};

export const insertOrReplaceToDB = function (rows) {
  LovefieldDB.db.insertOrReplace()
  .into(_getTxsTable())
  .values(rows)
  .exec()
  .catch(err => err);
};

export const getTxWithDBSchema = function (amount, tx, inputs, isOutgoing, outputs) {
  const isPending = tx.block_num === null;
  return {
    [LovefieldDB.txsTableFields.CT_AMOUNT]: {
      getCCoin: amount
    },
    [LovefieldDB.txsTableFields.CT_BLOCK_NUMBER]: tx.block_num,
    [LovefieldDB.txsTableFields.CT_ID]: tx.hash,
    [LovefieldDB.txsTableFields.CT_INPUTS]: { newInputs: inputs },
    [LovefieldDB.txsTableFields.CT_IS_OUTGOING]: isOutgoing,
    [LovefieldDB.txsTableFields.CT_META]: {
      ctmDate: tx.time,
      ctmDescription: undefined,
      ctmTitle: undefined
    },
    [LovefieldDB.txsTableFields.CTM_DATE]: new Date(tx.time),
    [LovefieldDB.txsTableFields.CT_OUTPUTS]: { newOutputs: outputs },
    [LovefieldDB.txsTableFields.CT_CONDITION]: isPending ? 'CPtxApplying' : 'CPtxInBlocks'
  };
};

export const getDBRow = function (newtx) {
  return _getTxsTable().createRow(newtx);
};

export const getMostRecentTxFromRows = function (previousTxsRows) {
  const previousTxsRowsLth = previousTxsRows.length;
  return previousTxsRows[previousTxsRowsLth - 1] ?
    previousTxsRows[previousTxsRowsLth - 1].m :
    previousTxsRows[previousTxsRowsLth - 1];
};

const _getTxsTable = function () {
  return LovefieldDB.db.getSchema().table(LovefieldDB.txsTable);
};
