Feature: Transfer Daedalus Wallet funds

  Background:
    Given I have opened the chrome extension
    And I have completed the basic setup
    And I am testing "Daedalus transfer funds Screen"

  Scenario: I follow setup instructions
    Given There is no wallet stored
    And I am on the Daedalus Transfer instructions screen
    When I click on the create Project Icarus wallet button
    Then I should see the Create wallet screen

  @it-33
  Scenario: "Transfer funds from Daedalus" buttons test (IT-33)
    Given There is a wallet stored named Test
    And I am on the Daedalus Transfer instructions screen
    When I click on the go to the Receive screen button
    Then I should see the Receive screen

  @it-99
  Scenario: Daedalus transfer fails when user tries to transfer funds from an invalid Icarus wallet (IT-99)
    Given There is a wallet stored named Test
    And I am on the Daedalus Transfer instructions screen
    When I click on the transfer funds from Daedalus button
    And I enter the recovery phrase:
    | recoveryPhrase                                                                                           |
    | remind style lunch result accuse upgrade atom eight limit glance frequent eternal fashion borrow monster |
    And I proceed with the recovery
    Then I should see an "Invalid recovery phrase" error message
  
  @it-84
  Scenario: Daedalus transfer should fail to recover wallet if connection was lost (IT-84)
    Given There is a wallet stored named Test
    And I am on the Daedalus Transfer instructions screen
    When I click on the transfer funds from Daedalus button
    And I enter the recovery phrase:
    | recoveryPhrase                                                          |
    | leaf immune metal phrase river cool domain snow year below result three |
    And I proceed with the recovery
    Then I should see an Error screen
    And I should see 'Connection lost' error message
  
  @withWebSocketConnection @it-45
  Scenario: User can transfer Daedalus funds to Icarus using 12-word mnemonic phrase (IT-45)
    Given There is a wallet stored named Test
    And My Daedalus wallet has funds
    And I am on the Daedalus Transfer instructions screen
    When I click on the transfer funds from Daedalus button
    And I enter the recovery phrase:
    | recoveryPhrase                                                          |
    | leaf immune metal phrase river cool domain snow year below result three |
    And I proceed with the recovery
    Then I should wait until funds are recovered:
    | daedalusAddress                                                                                          | amount |   
    | DdzFFzCqrhstBgE23pfNLvukYhpTPUKgZsXWLN5GsawqFZd4Fq3aVuGEHk11LhfMfmfBCFCBGrdZHVExjiB4FY5Jkjj1EYcqfTTNcczb | 500000 |
    | DdzFFzCqrht74dr7DYmiyCobGFQcfLCsHJCCM6nEBTztrsEk5kwv48EWKVMFU9pswAkLX9CUs4yVhVxqZ7xCVDX1TdatFwX5W39cohvm | 500000 |
    When I confirm Daedalus transfer funds
    Then I should see the summary screen
    
  @withWebSocketConnection @it-80
  Scenario: Daedalus transfer should fail if the 12-words mnemonics corresponds to an empty Daedalus wallet (IT-80)
    Given There is a wallet stored named Test
    And My Daedalus wallet hasn't funds
    And I am on the Daedalus Transfer instructions screen
    When I click on the transfer funds from Daedalus button
    And I enter the recovery phrase:
    | recoveryPhrase                                                          |
    | leaf immune metal phrase river cool domain snow year below result three |
    And I proceed with the recovery
    Then I should see an Error screen
    And I should see 'Daedalus wallet without funds' error message