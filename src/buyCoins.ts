import { MarketOrder } from 'coinbase-pro';
import dotenv from 'dotenv';
import _ from 'lodash';
import { authedClient, checkSufficientFunds } from './coinbase';
import { wait } from './helpers';


if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const BIWEEKLY_BUY = process.env.BIWEEKLY_BUY_AMOUNT
  ? parseFloat(process.env.BIWEEKLY_BUY_AMOUNT)
  : 0;
const COIN_TO_BUY = process.env.COIN_TO_BUY;

const DAILY_BUY = _.round(BIWEEKLY_BUY / 14, 2);

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkFilled(fills: any, orderId: string) {
  for (const fill of fills) {
    if (fill.order_id === orderId) {
      return fill.settled;
    }
  }

  return false;
}

async function buyCoin(coin, amount) {
  const buyParams: MarketOrder = {
    funds: amount.toString(), // USD
    product_id: `${coin}-USD`,
    type: 'market',
    side: 'buy',
    size: null,
  };
  console.log(`Buying...$${amount} ${coin}`);
  const order = await authedClient.placeOrder(buyParams);

  await sleep(5000);

  const fills = await authedClient.getFills({
    product_id: `${coin}-USD`,
    order_id: order.id,
  });

  await wait(60 * 1000);
  if (checkFilled(fills, order.id)) {
    console.log(`Success! Order: ${order.id}`);
  } else {
    console.log(`Order ${order.id} did not fill`);
  }
}

export async function buyCoins() {
  const accounts = await authedClient.getAccounts();
  if (!checkSufficientFunds(accounts, 'USD', DAILY_BUY)) {
    console.log(`Insufficient funds for daily buy ($${DAILY_BUY}) !`);
  } else {
    await buyCoin(COIN_TO_BUY, DAILY_BUY);
  }
}
