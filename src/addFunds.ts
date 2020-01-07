import { authedClient, checkSufficientFunds, makeDeposit } from './coinbase';

export async function addFunds() {
  const accounts = await authedClient.getAccounts();
  if (!checkSufficientFunds(accounts, 'USD', 250)) {
    console.log('Insufficient funds!');
    const result = await makeDeposit(250);
    console.log(
      `Initiated deposit of ${result.amount} with id ${result.id} paying out at ${result.payout_at}`,
    );
  } else {
    console.log('Sufficient funds!');
  }
}
