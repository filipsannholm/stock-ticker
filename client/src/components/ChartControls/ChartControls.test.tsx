import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ChartControls from './ChartControls';
import { StockContext } from '../../App';
import { calculateDateRange } from '../../utils/dateHelpers';

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
        open: 0,
        high: 0,
        adjusted_close: 0,
        volume: 0,
        low: 0,
      },
      {
        date: '2022-01-02',
        close: 11.6,
        open: 0,
        high: 0,
        adjusted_close: 0,
        volume: 0,
        low: 0,
      },
    ],
    color: 'rgb(100,100,100)',
  },
};

describe('ChartControls.tsx', () => {
  test('Has a comparison button', () => {
    render(<ChartControls tickers={mockTickerData.data} stocks={mockStockData} />);
    const comparison = screen.getByText('Comparison');
    expect(comparison).toBeInTheDocument();
  });

  test('Has a change date button', () => {
    render(<ChartControls tickers={mockTickerData.data} stocks={mockStockData} />);
    const dateButton = screen.getByText('Date Range');
    expect(dateButton).toBeInTheDocument();
  });

  test('Has a number of quick range buttons', () => {
    render(<ChartControls tickers={mockTickerData.data} stocks={mockStockData} />);
    const buttonLabels = ['1 M', '3 M', '6 M', 'YTD', '1 Y'];
    const buttons = buttonLabels.map((label) => screen.getByText(label));
    expect(buttonLabels.length).toEqual(buttons.length);
  });

  test('Clicking comparison button opens submenu', () => {
    render(<ChartControls tickers={mockTickerData.data} stocks={mockStockData} />);
    fireEvent.click(screen.getByText('Comparison'));
    const menuCompareLabel = screen.getByTestId('comparison-menu');
    expect(menuCompareLabel).not.toHaveClass('hidden');
  });

  test('Clicking date button opens submenu', () => {
    render(<ChartControls tickers={mockTickerData.data} stocks={mockStockData} />);
    fireEvent.click(screen.getByText('Date Range'));
    const menuCompareLabel = screen.getByTestId('date-menu');
    expect(menuCompareLabel).not.toHaveClass('hidden');
  });

  test('Clicking quick date buttons changes date range', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
    const contextValue = {
      setDateRange: jest.fn(),
      setTickers: () => {},
      stocks: {},
      mainTicker: '',
    };
    const dateRange = calculateDateRange(30);
    render(
      <StockContext.Provider value={contextValue}>
        <ChartControls tickers={mockTickerData.data} stocks={mockStockData} />
      </StockContext.Provider>,
    );
    const oneMonthButton = screen.getByText('1 M');
    fireEvent.click(oneMonthButton);
    expect(contextValue.setDateRange).toHaveBeenCalledWith(dateRange);
  });
});
