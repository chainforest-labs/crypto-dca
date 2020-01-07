import CoinbasePro, { MarketOrder } from 'coinbase-pro';
import dotenv from 'dotenv';
import _ from 'lodash';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const BIWEEKLY_BUY = process.env.BIWEEKLY_BUY_AMOUNT ? parseFloat(process.env.BIWEEKLY_BUY_AMOUNT) || 0;
const DAILY_BUY = _.round(BIWEEKLY_BUY / 14, 2);

const key = process.env.COINBASE_KEY || '';
const secret = process.env.COINBASE_SECRET || '';
const passphrase: string = process.env.COINBASE_PASSPHRASE || '';
const uri = process.env.COINBASE_URI;

const authedClient = new CoinbasePro.AuthenticatedClient(
  key,
  secret,
  passphrase,
  uri,
);

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkSufficientFunds(
  accounts: any[],
  currency: string,
  minFunds: number,
) {
  for (const account of accounts) {
    if (account.currency === currency) {
      return account.available >= minFunds;
    }
  }
}

function checkFilled(fills: any, orderId: string) {
  for (const fill of fills) {
    if (fill.order_id === orderId) {
      return fill.settled;
    }
  }

  return false;
}

export async function buyCoins() {
  const accounts = await authedClient.getAccounts();
  if (!checkSufficientFunds(accounts, 'USD', 250)) {
    console.log('Insufficient funds!');
  }

  const buyParams: MarketOrder = {
    funds: DAILY_BUY.toString(), // USD
    product_id: 'BTC-USD',
    type: 'market',
    side: 'buy',
    size: null,
  };
  console.log(`Buying...$${DAILY_BUY} BTC`);
  const order = await authedClient.placeOrder(buyParams);

  await sleep(5000);

  const fills = await authedClient.getFills({
    product_id: 'BTC-USD',
  });

  if (checkFilled(fills, order.id)) {
    console.log(`Success! Order: ${order.id}`);
  } else {
    console.log(`Order ${order.id} did not fill`);
  }
}
