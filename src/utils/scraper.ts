import axios from 'axios';
import { logger } from './logger';
import { scanner } from './scanner';

export class Scraper {
  private readonly BASE_URL = 'https://finance.yahoo.com/quote/';

  constructor() {
    logger.info('Scraper running!');

    const AxiosInstance = axios.create(); // Create a new Axios Instance

    scanner.question('Enter a stock symbol: ', async (symbol) => {
      logger.info('Input received:', symbol);

      let html = '';

      try {
        logger.info(`Scraping HTML for stock symbol '${symbol}'...`);

        const response = await AxiosInstance.get(`${this.BASE_URL}${symbol}`);
        html = response.data;

        logger.info(html);
      } catch (e: unknown) {
        logger.error(e);
      }

      scanner.close();
    });
  }
}
