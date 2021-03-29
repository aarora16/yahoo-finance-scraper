import axios from 'axios';
import { logger } from './logger';

export class Scraper {
  private static readonly BASE_URL = 'https://finance.yahoo.com/quote/';

  private static stockSymbol: string;

  private static client = axios.create();

  constructor(stockSymbol: string) {
    logger.info(stockSymbol);
    Scraper.stockSymbol = stockSymbol;
    Scraper.run();
  }

  private static async run() {
    logger.info('Scraper running!');
    const html = await this.requestHTML();
    // const quoteSummaryDOM = this.parseHTML(html);
    // logger.info(quoteSummaryDOM);
  }

  private static parseHTML(html: string) {}

  private static async requestHTML(): Promise<string> {
    try {
      logger.info(`Scraping HTML for stock symbol '${this.stockSymbol}'...`);
      const { data } = await this.client.get(
        `${this.BASE_URL}${this.stockSymbol}`,
      );
      logger.info(data);
      return data;
    } catch (e: unknown) {
      logger.error(e);
    }

    return '';
  }
}
