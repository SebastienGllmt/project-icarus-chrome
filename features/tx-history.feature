Feature: Txs History

  Background:
    Given I have opened the chrome extension
    And I have completed the basic setup
    And I am testing "Transaction History"

  Scenario: Open the tx history of an empty wallet
    Given There is a wallet stored named empty-wallet
    When I see the transactions summary
    Then I should see that the number of transactions is 0
    And I should see no transactions

  Scenario: Open the tx history of a simple wallet
    And There is a wallet stored named simple-wallet
    When I see the transactions summary
    Then I should see that the number of transactions is 3
    And I should see 2 pending transactions in simple-wallet
    And I should see 1 confirmed transactions in simple-wallet

  Scenario: Open the tx history of a complex wallet
    Given There is a wallet stored named complex-wallet
    When I see the transactions summary
    Then I should see that the number of transactions is 45
    And I should see 45 confirmed transactions in complex-wallet

  Scenario: Open the tx history of a wallet with a big input tx
    Given There is a wallet stored named tx-big-input-wallet
    When I see the transactions summary
    Then I should see that the number of transactions is 1
    And I should see 1 confirmed transactions in tx-big-input-wallet

  Scenario: Open the tx history of an already loaded wallet
    Given There are transactions already stored
    And There is a wallet stored named simple-wallet
    When I see the transactions summary
    Then I should see that the number of transactions is 3
    And I should see 2 pending transactions in simple-wallet
    And I should see 1 confirmed transactions in simple-wallet

