import dotenv from 'dotenv';
import _ from 'lodash';

import { authedClient, checkSufficientFunds, makeDeposit } from './coinbase';
import { wait } from './helpers';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const BIWEEKLY_BUY = process.env.BIWEEKLY_BUY_AMOUNT
  ? parseFloat(process.env.BIWEEKLY_BUY_AMOUNT)
  : 0;

const DAILY_BUY = _.round(BIWEEKLY_BUY / 14, 2);

export async function addFunds() {
  const accounts = await authedClient.getAccounts();
  if (!checkSufficientFunds(accounts, 'USD', DAILY_BUY)) {
    console.log(`Insufficient funds for upcoming week ($${DAILY_BUY})!`);
    const result = await makeDeposit(DAILY_BUY); // it takes 1 days for DAILY_BUY to clear
    console.log(
      `Initiated deposit of ${result.amount} with id ${result.id} paying out at ${result.payout_at}`,
    );
    // Wait 15 minutes for funds to clear
    await wait(15 * 60 * 1000);
  } else {
    console.log('Sufficient funds!');
  }
}
