import dotenv from 'dotenv';
import { authedClient, checkSufficientFunds, makeDeposit } from './coinbase';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const BIWEEKLY_BUY = process.env.BIWEEKLY_BUY_AMOUNT
  ? parseFloat(process.env.BIWEEKLY_BUY_AMOUNT)
  : 0;

export async function addFunds() {
  const accounts = await authedClient.getAccounts();
  if (!checkSufficientFunds(accounts, 'USD', BIWEEKLY_BUY / 2)) {
    console.log(`Insufficient funds for upcoming week ($${BIWEEKLY_BUY / 2})!`);
    const result = await makeDeposit(BIWEEKLY_BUY / 10); // it takes 5 days for BIWEEKLY_BUY / 2 to clear
    console.log(
      `Initiated deposit of ${result.amount} with id ${result.id} paying out at ${result.payout_at}`,
    );
  } else {
    console.log('Sufficient funds!');
  }
}
