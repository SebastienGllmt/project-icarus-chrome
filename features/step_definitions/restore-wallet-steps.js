import { When, Then } from 'cucumber';
import { By } from 'selenium-webdriver';
import i18n from '../support/helpers/i18n-helpers';

When(/^I click the restore button$/, async function () {
  await this.click('.restoreWalletButton');
});

When(/^I enter the recovery phrase:$/, async function (table) {
  const fields = table.hashes()[0];
  const recoveryPhrase = fields.recoveryPhrase.split(' ');
  for (let i = 0; i < recoveryPhrase.length; i++) {
    const word = recoveryPhrase[i];
    await this.input('.SimpleAutocomplete_autocompleteWrapper input', word);
    await this.click(`//li[contains(text(), '${word}')]`, By.xpath);
  }
});

When(/^I clear the recovery phrase$/, async function () {
  await this.clearInputUpdatingForm('.SimpleAutocomplete_autocompleteWrapper input', 15);
});

When(/^I enter the restored wallet password:$/, async function (table) {
  const fields = table.hashes()[0];
  await this.input('#walletPassword--4', fields.password);
  await this.input('#repeatPassword--5', fields.repeatedPassword);
});

When(/^I clear the restored wallet password ([^"]*)$/, async function (password) {
  await this.clearInputUpdatingForm('#walletPassword--4', password.length);
});

When(/^I click the "Restore Wallet" button$/, async function () {
  await this.click('.WalletRestoreDialog .primary');
});

Then(/^I should see an "Invalid recovery phrase" error message$/, async function () {
  await this.waitForElement('.SimpleAutocomplete_errored');
});

Then(/^I should stay in the restore wallet dialog$/, async function () {
  const restoreMessage = await i18n.formatMessage(this.driver, { id: 'wallet.restore.dialog.title.label' });
  await this.waitUntilText('.Dialog_title', restoreMessage.toUpperCase(), 2000);
});
