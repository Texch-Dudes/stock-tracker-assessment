import { NextResponse } from 'next/server';
import axios from 'axios';

// Predefined names for indices
const INDEX_NAMES = {
  '^GSPC': 'S&P 500',
  '^DJI': 'Dow Jones Industrial Average',
  '^IXIC': 'NASDAQ Composite',
  '^RUT': 'Russell 2000',
  '^FTSE': 'FTSE 100',
  '^GDAXI': 'DAX Performance Index',
  '^FCHI': 'CAC 40',
  '^N225': 'Nikkei 225'
};

export async function GET(request, { params }) {
  const { symbol } = params;
  const decodedSymbol = decodeURIComponent(symbol);

  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    const to = Math.floor(Date.now() / 1000);
    const from = to - 30 * 24 * 60 * 60; // 30 days

    // First try Finnhub
    let chartData;
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/stock/candle?symbol=${decodedSymbol}&resolution=D&from=${from}&to=${to}&token=${apiKey}`
      );

      if (response.data.s === 'ok') {
        chartData = {
          dates: response.data.t.map(t => new Date(t * 1000).toLocaleDateString()),
          prices: response.data.c,
          source: 'Finnhub'
        };
      }
    } catch (finnhubError) {
      console.log(`Finnhub failed for ${decodedSymbol}, trying alternative`);
    }

    // If Finnhub failed, try Polygon (if you have that API key)
    if (!chartData && process.env.POLYGON_API_KEY) {
      try {
        const response = await axios.get(
          `https://api.polygon.io/v2/aggs/ticker/${decodedSymbol}/range/1/day/${from * 1000}/${to * 1000}?apiKey=${process.env.POLYGON_API_KEY}`
        );
        
        if (response.data.results) {
          chartData = {
            dates: response.data.results.map(r => new Date(r.t).toLocaleDateString()),
            prices: response.data.results.map(r => r.c),
            source: 'Polygon'
          };
        }
      } catch (polygonError) {
        console.log(`Polygon also failed for ${decodedSymbol}`);
      }
    }

    if (!chartData) {
      // Fallback to mock data if APIs fail
      const mockDays = 30;
      chartData = {
        dates: Array.from({ length: mockDays }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (mockDays - i));
          return date.toLocaleDateString();
        }),
        prices: Array.from({ length: mockDays }, () => 
          Math.random() * 1000 + 3000
        ),
        source: 'mock'
      };
    }

    return NextResponse.json({
      ...chartData,
      name: INDEX_NAMES[decodedSymbol] || decodedSymbol
    });

  } catch (error) {
    console.error(`Chart data error for ${decodedSymbol}:`, error);
    return NextResponse.json(
      { 
        error: `Failed to fetch chart data for ${decodedSymbol}`,
        details: error.message 
      },
      { status: 500 }
    );
  }
}