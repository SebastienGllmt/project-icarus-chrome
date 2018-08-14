// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import type { InjectedContainerProps } from '../../types/injectedPropsType';
import WalletTransactionsList from '../../components/wallet/transactions/WalletTransactionsList';
import WalletSummary from '../../components/wallet/summary/WalletSummary';
import WalletNoTransactions from '../../components/wallet/transactions/WalletNoTransactions';
import VerticalFlexContainer from '../../components/layout/VerticalFlexContainer';
import resolver from '../../utils/imports';
import { Logger } from '../../utils/logging';

const { formattedWalletAmount } = resolver('utils/formatters');

type Props = InjectedContainerProps

export const messages = defineMessages({
  noTransactions: {
    id: 'wallet.summary.no.transactions',
    defaultMessage: '!!!No recent transactions',
    description:
      'Message shown when wallet has no transactions on wallet summary page.'
  },
  noTransactionsFound: {
    id: 'wallet.summary.no.transaction',
    defaultMessage: '!!!No transactions found',
    description: 'Message shown when wallet transaction search returns zero results.'
  }
});

@inject('stores', 'actions') @observer
export default class WalletSummaryPage extends Component<Props> {
  static defaultProps = { actions: null, stores: null };

  static contextTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { intl } = this.context;
    const actions = this.props.actions;
    const { wallets, transactions } = this.props.stores.ada;
    const {
      hasAny,
      totalAvailable,
      recent,
      searchOptions,
      recentTransactionsRequest,
      unconfirmedAmount,
    } = transactions;
    const wallet = wallets.active;
    let walletTransactions = null;
    // Guard against potential null values
    if (!wallet) {
      Logger.error('[WalletSummaryPage::render] Active wallet required');
      return null;
    }
    if (searchOptions) {
      const { searchLimit } = searchOptions;
      const noTransactionsLabel = intl.formatMessage(messages.noTransactions);
      const noTransactionsFoundLabel = intl.formatMessage(messages.noTransactionsFound);
      if (recentTransactionsRequest.isExecutingFirstTime || hasAny) {
        walletTransactions = (
          <WalletTransactionsList
            transactions={recent}
            isLoadingTransactions={recentTransactionsRequest.isExecuting}
            hasMoreToLoad={totalAvailable > searchLimit}
            onLoadMore={actions.ada.transactions.loadMoreTransactions.trigger}
            assuranceMode={wallet.assuranceMode}
            walletId={wallet.id}
            formattedWalletAmount={formattedWalletAmount}
          />
        );
      } else if (!hasAny) {
        walletTransactions = <WalletNoTransactions label={noTransactionsFoundLabel} />;
      } else if (!hasAny) {
        walletTransactions = <WalletNoTransactions label={noTransactionsLabel} />;
      }
    }

    return (
      <VerticalFlexContainer>
        <WalletSummary
          numberOfTransactions={totalAvailable}
          pendingAmount={unconfirmedAmount}
          isLoadingTransactions={recentTransactionsRequest.isExecutingFirstTime}
        />
        {walletTransactions}
      </VerticalFlexContainer>
    );
  }
}
