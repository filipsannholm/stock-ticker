import React, { useContext } from 'react';
import { StockData, Ticker } from '../../global';
import { getYTDDays, calculateDateRange } from '../../utils/dateHelpers';
import { getIdFromStockKey } from '../../utils/dataHelpers';
import useComponentIsVisible from '../../hooks/useComponentIsVisible';
import ComparisonMenu from './ComparisonMenu';
import DateRangeMenu from './DateRangeMenu';
import { StockContext } from '../../App';

type RangeButtonOption = {
  label: string;
  daysBack: number;
};

const QUICK_RANGE_BUTTONS: RangeButtonOption[] = [
  {
    label: '1 M',
    daysBack: 30,
  },
  {
    label: '3 M',
    daysBack: 90,
  },
  {
    label: '6 M',
    daysBack: 180,
  },
  {
    label: 'YTD',
    daysBack: getYTDDays(),
  },
  {
    label: '1 Y',
    daysBack: 365,
  },
];

interface ChartControlsProps {
  tickers: Ticker[];
  stocks: StockData;
}

export default function ChartControls({ tickers, stocks }: ChartControlsProps) {
  const stockContext = useContext(StockContext);
  const comparisonMenuVisible = useComponentIsVisible(false);
  const dateMenuVisible = useComponentIsVisible(false);

  const handleComparisonButtonClick = () => {
    comparisonMenuVisible.setIsComponentVisible(true);
  };

  const handleComparisonMenuItemClick = () => {
    comparisonMenuVisible.setIsComponentVisible(false);
  };

  const handleDateRangeButtonClick = () => {
    dateMenuVisible.setIsComponentVisible(true);
  };

  const handleQuickRangeButtonClick = (daysBack: number) => {
    const dateRange = calculateDateRange(daysBack);
    stockContext.setDateRange(dateRange);
  };

  const nonSelectedTickers = tickers.filter((ticker) => {
    const activeStocks = Object.keys(stocks).map(getIdFromStockKey);
    return !activeStocks.includes(ticker.code.toLocaleLowerCase());
  });

  const comparisonMenuClasses = comparisonMenuVisible.isComponentVisible ? '' : 'hidden';
  const dateMenuClasses = dateMenuVisible.isComponentVisible ? '' : 'hidden';

  return (
    <div className='flex'>
      <div className='mr-4'>
        <button className='chart-control' onClick={handleComparisonButtonClick}>
          Comparison
        </button>
        <div data-testid='comparison-menu' className={comparisonMenuClasses}>
          <ComparisonMenu
            menuRef={comparisonMenuVisible.ref}
            tickers={nonSelectedTickers}
            close={handleComparisonMenuItemClick}
          />
        </div>
      </div>
      <div className='mx-4'>
        <button className='chart-control' onClick={handleDateRangeButtonClick}>
          Date Range
        </button>
        <div data-testid='date-menu' className={dateMenuClasses}>
          <DateRangeMenu menuRef={dateMenuVisible.ref} />
        </div>
      </div>
      <div>
        {QUICK_RANGE_BUTTONS.map((button) => (
          <button
            className='mr-2 chart-control'
            key={button.label}
            onClick={() => handleQuickRangeButtonClick(button.daysBack)}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}
