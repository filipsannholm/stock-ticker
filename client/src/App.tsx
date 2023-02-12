import React, { createContext, useState } from 'react';
import Dropdown from './components/Dropdown';
import StockChart from './components/StockChart';
import { useGetMarketTickers, useGetTickerData } from './api/api';

import './App.css';
import ChartControls from './components/ChartControls';
import { DateRange, StockData } from './global';
import NoTickerSelected from './components/NoTickerSelected';

interface StockContextProps {
  setTickers: (value: string[]) => void;
  stocks: StockData;
  setDateRange: (value: DateRange) => void;
  mainTicker: string;
}
export const StockContext = createContext<StockContextProps>({
  setTickers: () => {},
  stocks: {},
  setDateRange: () => {},
  mainTicker: '',
});

function App() {
  const [tickers] = useGetMarketTickers('he');
  const [stocks, setTickers, setDateRange] = useGetTickerData('he');
  const [mainTicker, setMainTicker] = useState('');

  const tickerDropdownItems = tickers.data.map((item) => ({ code: item.code, name: item.name }));

  const chartData = Object.entries(stocks.data).map(([id, data]) => {
    const [exchange, tickerId] = id.split('-');
    const ticker = tickers.data.find(
      (ticker) =>
        tickerId === ticker.code.toLowerCase() && exchange === ticker.exchange.toLowerCase(),
    );
    return {
      ticker,
      data: data.dataPoints,
      color: data.color,
    };
  });

  const contextData = {
    setTickers,
    stocks: stocks.data,
    setDateRange,
    mainTicker,
  };

  const handleTickerChange = (ticker: string) => {
    setTickers([ticker]);
    setMainTicker(ticker);
  };

  return (
    <div className='App'>
      <StockContext.Provider value={contextData}>
        <header className='container sticky top-0 bg-amaranth-purple max-w-full px-10 flex justify-between items-center'>
          <h1 className='text-2xl py-3 font-extrabold text-slate-50'>Stocks, yeah!</h1>
          <div>
            <div>
              <Dropdown
                items={tickerDropdownItems}
                onClick={(code: string) => handleTickerChange(code)}
                placeholder='Search...'
              />
            </div>
          </div>
        </header>
        <div className='container mx-auto'>
          {chartData.length ? (
            <div className='mt-3'>
              <div>
                <ChartControls tickers={tickers.data} stocks={stocks.data} />
              </div>
              <div>
                <StockChart stockData={chartData} />
              </div>
            </div>
          ) : (
            <NoTickerSelected />
          )}
        </div>
      </StockContext.Provider>
    </div>
  );
}

export default App;
