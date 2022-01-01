# What this does

When the cron runs `dst/dailyJob.js`, it does the following: 
1. Adds funds from your connected bank account to Coinbase. It will add enough funds for the daily buy amount (BIWEEKLY_BUY_AMOUNT / 14)
2. Waits 15 minutes for funds to clear
3. Buys the coin you indicated (COIN_TO_BUY) for the daily buy amount

---

# To run locally

```
npx ts-node src/dailyJob.ts
```

---

# To deploy, I used Heroku:

- Push this repo to the Heroku remote
- Install the "Heroku Scheduler" Add-On. 
  - You'll use this add-on to kick off the process to add funds and buy coins
  - Under "Schedule", set it to run "Every day at..." "04:00 PM" UTC. You can set it to run at whatever time you want. 
  - Under "Run Command", enter the command `node dst/dailyJob.js`
- Set environment variables
  - BIWEEKLY_BUY_AMOUNT - The total amount to buy every two weeks. The daily buy is BIWEEKLY_BUY_AMOUNT / 14
  - COINBASE_KEY - Create new API key and save the key, passphrase, and secret
  - COINBASE_PASSPHRASE 
  - COINBASE_SECRET
  - COINBASE_URI - Set to `https://api.pro.coinbase.com`
  - COIN_TO_BUY - Set to any coin available on Coinbase (eg. BTC, ETH, SOL, AVAX, etc)
  - PAYMENT_METHOD_ID - The payment ID for your connected bank account. You can get all connected payment ids via the `getPaymentMethods` method in `coinbase.ts` 
  