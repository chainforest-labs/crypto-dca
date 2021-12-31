import { addFunds } from './addFunds';
import { buyCoins } from './buyCoins';

console.log('Initializing jobs...');

// new CronJob('0 50 11 * * *', addFunds, '', true, 'America/New_York');
// new CronJob('0 00 12 * * *', buyCoins, '', true, 'America/New_York');

addFunds().then(() => buyCoins());
