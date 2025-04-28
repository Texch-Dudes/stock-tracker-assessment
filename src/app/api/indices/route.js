import { NextResponse } from 'next/server';
import axios from 'axios';

const INDEX_DATA = {
  '^GSPC': { name: 'S&P 500', currency: 'USD' },
  '^DJI': { name: 'Dow Jones Industrial Average', currency: 'USD' },
  '^IXIC': { name: 'NASDAQ Composite', currency: 'USD' },
  '^RUT': { name: 'Russell 2000', currency: 'USD' },
  '^FTSE': { name: 'FTSE 100', currency: 'GBP' },
  '^GDAXI': { name: 'DAX Performance Index', currency: 'EUR' },
  '^FCHI': { name: 'CAC 40', currency: 'EUR' },
  '^N225': { name: 'Nikkei 225', currency: 'JPY' }
};

export const revalidate = 600; // 10 minute cache

export async function GET() {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    
    if (!apiKey) {
      throw new Error('Finnhub API key not configured');
    }

    const indices = await Promise.all(
      Object.keys(INDEX_DATA).map(async (symbol) => {
        try {
          const quoteRes = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
            { timeout: 3000 }
          );

          return {
            symbol,
            description: INDEX_DATA[symbol].name,
            currency: INDEX_DATA[symbol].currency,
            price: quoteRes.data.c,
            change: quoteRes.data.d,
            changePercent: quoteRes.data.dp,
            lastUpdated: new Date().toISOString()
          };
        } catch (error) {
          console.error(`Failed to fetch ${symbol}:`, error.message);
          return {
            symbol,
            description: INDEX_DATA[symbol].name,
            currency: INDEX_DATA[symbol].currency,
            error: 'Price data unavailable'
          };
        }
      })
    );

    return NextResponse.json(indices);
  } catch (error) {
    console.error('Indices endpoint error:', error);
    return NextResponse.json(
      Object.keys(INDEX_DATA).map(symbol => ({
        symbol,
        description: INDEX_DATA[symbol].name,
        currency: INDEX_DATA[symbol].currency,
        error: 'Live data unavailable'
      })),
      { status: 200 } // Still return 200 with fallback data
    );
  }
}