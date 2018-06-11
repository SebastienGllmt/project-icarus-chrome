Feature: Create wallet

  Background:
    Given I have opened the chrome extension
    And There is no wallet stored

  Scenario: Successfully creating a wallet
    When I click the create button
    And I enter the name "Created Wallet"
    And I enter the created wallet password:
    | password  | repeatedPassword |
    | Secret123 | Secret123        |
    And I click the "Create personal wallet" button
    And I accept the creation terms
    And I copy and enter the displayed mnemonic phrase
    Then I should see the opened wallet