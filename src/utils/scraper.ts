import axios from 'axios';
import cheerio from 'cheerio';
import { StockData } from '../typings/stock-data';
import { logger } from './logger';
import { dataTest } from '../typings/data-test-enums';

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
    const marketNoticeNode = DOM(`#quote-market-notice`);
    const leftTable = DOM(`${dataTest[1]}`);
    const rightTable = DOM(`${dataTest[2]}`);
    const fairValueNode = DOM(`#fr-val-mod`);
    const chartEventNode = DOM(`#chrt-evts-mod`);

    const getText = (dom: unknown, context: string) =>
      DOM(dom).find(context).text();

    const name = getText(headerInfo, `h1`);

    // if it exists, return first idx, otherwise N/A
    const symbol = name.match(/\((.+)\)/)?.[1] ?? 'N/A';

    const currentPrice = marketNoticeNode.prev().prev().text();

    const dayChangeText = marketNoticeNode.prev().text();
    const dayChangeMatch = dayChangeText.match(/(.+)\s\((.+%)\)/);
    const [_, dayChangeDollar, dayChangePercent] = dayChangeMatch ?? [
      '',
      'N/A',
      'N/A',
    ];

    // Left Table

    const previousClosePrice = getText(leftTable, `${dataTest[3]}`);

    const openPrice = getText(leftTable, `${dataTest[4]}`);

    const bidPrice = getText(leftTable, `${dataTest[5]}`);

    const askPrice = getText(leftTable, `${dataTest[6]}`);

    const dayRange = getText(leftTable, `${dataTest[7]}`);

    const yearRange = getText(leftTable, `${dataTest[8]}`);

    const volume = getText(leftTable, `${dataTest[9]}`);

    const avgVolume = getText(leftTable, `${dataTest[10]}`);

    // Right Table

    const marketCap = getText(rightTable, `${dataTest[11]}`);

    const fiveYearMonthly = getText(rightTable, `${dataTest[12]}`);

    const peRatio = getText(rightTable, `${dataTest[13]}`);

    const eps = getText(rightTable, `${dataTest[14]}`);

    const earningsDate = getText(rightTable, `${dataTest[15]}`);

    const forwardDividend = getText(rightTable, `${dataTest[16]}`);

    const exDividendDate = getText(rightTable, `${dataTest[17]}`);

    const oneYearTarget = getText(rightTable, `${dataTest[18]}`);

    // Other Values

    const fairValue = getText(fairValueNode, `div:contains('XX'):lt(1)`).split('XX')[2];

    const patternDetectedNode = chartEventNode.find(`span:contains('pattern detected')`);
    const chartEventValue = patternDetectedNode.prev().text();

    // Stock Data

    const stockData: StockData = {
      name,
      symbol,
      currentPrice,
      dayChangeDollar,
      dayChangePercent,
      previousClosePrice,
      openPrice,
      bidPrice,
      askPrice,
      dayRange,
      yearRange,
      volume,
      avgVolume,
      marketCap,
      fiveYearMonthly,
      peRatio,
      eps,
      earningsDate,
      forwardDividend,
      exDividendDate,
      oneYearTarget,
      fairValue,
      chartEventValue,
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
