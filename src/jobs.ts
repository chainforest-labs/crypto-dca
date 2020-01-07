import { CronJob } from 'cron';
import { buyCoins } from './buyCoins';

new CronJob('0 00 12 * * *', buyCoins, '', true, 'America/New_York');
