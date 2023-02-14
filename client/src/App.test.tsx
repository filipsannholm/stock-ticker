import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

const mockTickerData = {
  data: [
    {
      code: 'AKTIA',
      name: 'Aktia',
      country: 'Finland',
      exchange: 'HE',
      currency: 'Euro',
      type: '',
      isin: '',
      fetched: true,
    },
    {
      code: 'AKTIA 2',
      name: 'Aktia 2',
      country: 'Finland',
      exchange: 'HE',
      currency: 'Euro',
      type: '',
      isin: '',
      fetched: true,
    },
  ],
};

const mockStockData = {
  'he-aktia': {
    dataPoints: [
      {
        date: '2022-01-01',
        close: 10.5,
      },
      {
        date: '2022-01-02',
        close: 11.6,
      },
    ],
    color: 'rgb(100,100,100)',
  },
};

const noop = () => {};

jest.mock('./api/api', () => ({
  useGetTickerData: () => {
    return [{ data: mockStockData, isLoading: false, isError: false }, noop, noop, noop];
  },
  useGetMarketTickers: (initialMarket: string) => {
    return [mockTickerData, false, false, noop];
  },
}));

describe('App.tsx', () => {
  test('Has a header', () => {
    render(<App />);
    const header = screen.getByText('Stocks, yeah!');
    expect(header).toBeInTheDocument();
  });

  test('Has a search input', () => {
    render(<App />);
    const search = screen.getByPlaceholderText('Search...');
    expect(search).toBeInTheDocument();
  });

  test('Shows a stock chart when stock data is loaded', () => {
    render(<App />);
    const canvas = screen.getByRole('img');
    expect(canvas).toBeInTheDocument();
  });
});
