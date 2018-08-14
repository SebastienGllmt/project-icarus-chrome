Feature: Wallet Settings

  Background:
    Given I have opened the chrome extension
    And I have completed the basic setup
    And I am testing "Wallet Settings Screen"
    And There is a wallet stored named Test

  Scenario: User tries to set Wallet password with invalid password format
    When I navigate to the general settings screen
    And I click on secondary menu "wallet" item
    And I click on the "change" password label
    And I should see the "change" wallet password dialog
    And I change wallet password:
    | currentPassword    | password | repeatedPassword |
    | Secret_123         | secret   | secret           |
    And I submit the wallet password dialog
    Then I should see the following error messages:
    | message                             |
    | global.errors.invalidWalletPassword |

  Scenario: User changes Wallet password
    When I navigate to the general settings screen
    And I click on secondary menu "wallet" item
    And I click on the "change" password label
    And I should see the "change" wallet password dialog
    And I change wallet password:
    | currentPassword    | password     | repeatedPassword |
    | Secret_123         | newSecret123 | newSecret123     |
    And I submit the wallet password dialog
    Then I should not see the change password dialog anymore
  
  Scenario: User tries to change the password with an invalid old password
    When I navigate to the general settings screen
    And I click on secondary menu "wallet" item
    And I click on the "change" password label
    And I should see the "change" wallet password dialog
    And I change wallet password:
    | currentPassword    | password     | repeatedPassword |
    | InvalidPrevious123 | newSecret123 | newSecret123     |
    And I submit the wallet password dialog
    Then I should see the following submit error messages:
    | message                           |
    | api.errors.IncorrectPasswordError |

  Scenario: User tries to change the password omitting special characters in their current password
    When I navigate to the general settings screen
    And I click on secondary menu "wallet" item
    And I click on the "change" password label
    And I should see the "change" wallet password dialog
    And I change wallet password:
    | currentPassword    | password     | repeatedPassword |
    | Secret123          | newSecret123 | newSecret123     |
    And I submit the wallet password dialog
    Then I should see the following submit error messages:
    | message                           |
    | api.errors.IncorrectPasswordError |

  Scenario: User renames Wallet
    When I navigate to the general settings screen
    And I click on secondary menu "wallet" item
    And I click on "name" input field
    And I enter new wallet name:
    | name         |
    | first Edited |
    And I click outside "name" input field
    And I navigate to wallet transactions screen
    Then I should see new wallet name "first Edited"

  Scenario: User fails to change password due to incomplete fields
    When I navigate to the general settings screen
    And I click on secondary menu "wallet" item
    And I click on the "change" password label
    And I should see the "change" wallet password dialog
    And I change wallet password:
    | currentPassword    | password     | repeatedPassword |
    | Secret_123         | newSecret123 | newSecret123     |
    And I clear the current wallet password Secret_123
    And I submit the wallet password dialog
    Then I should stay in the change password dialog
