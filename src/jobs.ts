import { CronJob } from 'cron';
import { buyCoins } from './buyCoins';

console.log('Initializing jobs...');

new CronJob('0 00 12 * * *', buyCoins, '', true, 'America/New_York');
