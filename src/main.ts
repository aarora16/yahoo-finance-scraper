import { logger, scanner, Scraper } from './utils';

scanner.question('Enter a stock symbol: ', async (symbol) => {
  logger.info('Input received:', symbol);
  Scraper.run(symbol);
  scanner.close();
});
