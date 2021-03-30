import axios from 'axios';
import cheerio from 'cheerio';
import { StockData } from '../typings/stock-data';
import { logger } from './logger';

export class Scraper {
  private static readonly BASE_URL = 'https://finance.yahoo.com/quote/';

  private static stockSymbol: string;

  private static client = axios.create();

  constructor(stockSymbol: string) {
    Scraper.stockSymbol = stockSymbol;
    Scraper.run();
  }

  private static async run() {
    logger.info('Scraper running!');
    const html = await this.requestHTML();
    const stockData = this.parseHTML(html);
    logger.info(stockData);
  }

  private static parseHTML(html: string): StockData {
    const DOM = cheerio.load(html);
    const stockData = {} as StockData;

    const headerInfo = DOM(`#quote-header-info`);
    const quoteSummary = DOM('#quote-summary');

    const getText = (dom: unknown, context: string) => {
      return DOM(dom).find(context).text();
    };

    stockData.name = getText(headerInfo, `h1[data-reactid='7']`);

    const symbol = stockData.name.match(/\(.+\)/);
    stockData.symbol = symbol !== null ? symbol[0].slice(1, -1) : 'N/A';

    stockData.currentPrice = getText(headerInfo, `span[data-reactid='50']`);

    const dayChange = getText(headerInfo, `span[data-reactid='51']`)
      .replace('(', '')
      .replace(')', '')
      .split(' ');
    [stockData.dayChangeDollar, stockData.dayChangePercent] = dayChange;

    stockData.previousClosePrice = getText(
      quoteSummary,
      `[data-test="PREV_CLOSE-value"]`,
    );

    stockData.openPrice = getText(quoteSummary, `[data-test="OPEN-value"]`);

    stockData.dayRange = getText(
      quoteSummary,
      `[data-test="DAYS_RANGE-value"]`,
    );

    stockData.yearRange = getText(
      quoteSummary,
      `[data-test="FIFTY_TWO_WK_RANGE-value"]`,
    );

    return stockData;
  }

  private static async requestHTML(): Promise<string> {
    try {
      logger.info(`Scraping HTML for stock symbol '${this.stockSymbol}'...`);
      const { data } = await this.client.get(
        `${this.BASE_URL}${this.stockSymbol}`,
      );
      // logger.info(data);
      return data;
    } catch (e: unknown) {
      logger.error(e);
    }
    return '';
  }
}
