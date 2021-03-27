import { logger } from './utils/logger';
import { scanner } from './utils/scanner';

export class Scraper {
  constructor() {
    logger.info('Scaper running!');

    scanner.question('Enter a stock symbol: ', (input) => {
      logger.info('Input received:', input);
      scanner.close();
    });
  }
}
