import { logger, scanner, Scraper } from './utils';

scanner.question('Enter a stock symbol: ', async (symbol) => {
  logger.info('Input received:', symbol);
  const stockData = await Scraper.fetch(symbol);
  logger.info(stockData);
  scanner.close();
});
