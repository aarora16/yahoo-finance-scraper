import axios from 'axios';
import cheerio from 'cheerio';
import { StockData } from '../typings/stock-data';
import { logger } from './logger';

export class Scraper {
  private static readonly BASE_URL = 'https://finance.yahoo.com/quote/';

  private static client = axios.create();

  public static async fetch(stockSymbol: string) {
    logger.info('Scraper running!');
    const html = await this.requestHTML(stockSymbol);
    const stockData = this.parseHTML(html);
    return stockData;
  }

  private static parseHTML(html: string) {
    const DOM = cheerio.load(html);

    const headerInfo = DOM(`#quote-header-info`);
    const quoteSummary = DOM('#quote-summary');

    const getText = (dom: unknown, context: string) =>
      DOM(dom).find(context).text();

    const name = getText(headerInfo, `h1[data-reactid='7']`);

    // if it exists, return first idx, otherwise N/A
    const symbol = name.match(/\((.+)\)/)?.[1] ?? 'N/A';

    const currentPrice = getText(headerInfo, `span[data-reactid='50']`);

    const dayChangeText = getText(headerInfo, `span[data-reactid='51']`);
    const dayChangeMatch = dayChangeText.match(/(.+)\s\((.+%)\)/);
    const [_, dayChangeDollar, dayChangePercent] = dayChangeMatch ?? [
      '',
      'N/A',
      'N/A',
    ];

    const previousClosePrice = getText(
      quoteSummary,
      `[data-test="PREV_CLOSE-value"]`,
    );

    const openPrice = getText(quoteSummary, `[data-test="OPEN-value"]`);

    const dayRange = getText(quoteSummary, `[data-test="DAYS_RANGE-value"]`);

    const yearRange = getText(
      quoteSummary,
      `[data-test="FIFTY_TWO_WK_RANGE-value"]`,
    );

    const stockData: StockData = {
      name,
      symbol,
      currentPrice,
      dayChangeDollar,
      dayChangePercent,
      previousClosePrice,
      openPrice,
      dayRange,
      yearRange,
    };

    return stockData;
  }

  private static async requestHTML(stockSymbol: string): Promise<string> {
    try {
      logger.info(`Scraping HTML for stock symbol '${stockSymbol}'...`);
      const { data } = await this.client.get(`${this.BASE_URL}${stockSymbol}`);
      // logger.info(data);
      return data;
    } catch (e: unknown) {
      logger.error(e);
      throw new Error('Error making GET request!');
    }
  }
}
