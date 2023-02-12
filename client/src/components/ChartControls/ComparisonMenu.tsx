import React, { useContext, useState } from 'react';
import { Ticker } from '../../global';
import Dropdown from '../Dropdown';
import { StockContext } from '../../App';
import { getIdFromStockKey } from '../../utils/dataHelpers';

interface ComparisonMenuProps {
  tickers: Ticker[];
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
  close: () => void;
}

export default function ComparisonMenu({ tickers, menuRef, close }: ComparisonMenuProps) {
  const stockContext = useContext(StockContext);
  const [comparisonStocks, setComparisonStocks] = useState<string[]>([]);

  const items = tickers.map((ticker) => ({ code: ticker.code, name: ticker.name }));
  const currentStockKeys = Object.keys(stockContext.stocks).map(getIdFromStockKey);

  const handleDropDownItemClick = (code: string) => {
    const newKeys = [...currentStockKeys, code.toLocaleLowerCase()];
    setComparisonStocks([...comparisonStocks, code]);
    stockContext.setTickers(newKeys);
    close();
  };

  const handleOnComparisonListItemClick = (code: string) => {
    const newList = comparisonStocks.filter((item) => item !== code);
    setComparisonStocks(newList);
    stockContext.setTickers([stockContext.mainTicker, ...newList]);
  };

  return (
    <div className='bg-gray-50 absolute mt-1 py-2' ref={menuRef}>
      <div>
        <div>
          <div className='text-xs pl-1'>Selected:</div>
          <div className='flex p-1'>
            {comparisonStocks.map((item) => (
              <div
                className='rounded-full bg-gray-400 text-gray-50 p-1 px-2 text-xs cursor-pointer'
                key={item}
                onClick={() => handleOnComparisonListItemClick(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className='text-xs pl-1'>Compare stock</div>
        <Dropdown items={items} limit={3} onClick={(code) => handleDropDownItemClick(code)} />
      </div>
    </div>
  );
}
