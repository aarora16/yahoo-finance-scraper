import { logger } from './logger';
import { scanner } from './scanner';

export class Scraper {
  constructor() {
    logger.info('Scaper running!');

    scanner.question('Enter a stock symbol: ', (input: string) => {
      logger.info('Input received:', input);
      scanner.close();
    });
  }
}
