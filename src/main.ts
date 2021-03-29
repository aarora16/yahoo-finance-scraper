// import { logger, scanner, Scraper } from './utils';

import { logger } from './utils/logger';
import { scanner } from './utils/scanner';
import { Scraper } from './utils/scraper';

scanner.question('Enter a stock symbol: ', async (symbol) => {
  logger.info('Input received:', symbol);
  // eslint-disable-next-line no-unused-vars
  const _ = new Scraper(symbol);
  scanner.close();
});
