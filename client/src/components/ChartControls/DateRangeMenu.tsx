import React, { useContext, useState } from 'react';
import Datepicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { StockContext } from '../../App';

interface DateMenuProps {
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
}

export default function DateRangeMenu({ menuRef }: DateMenuProps) {
  const stockContext = useContext(StockContext);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());

  const handleSetFromDate = (date: Date) => {
    setFromDate(date);
    stockContext.setDateRange({ from: date, to: toDate });
  };

  const handleSetToDate = (date: Date) => {
    setToDate(date);
    stockContext.setDateRange({ from: fromDate, to: date });
  };

  const input = <input type='text' className='p-1 border border-gray-200 m-1 rounded-sm' />;

  return (
    <div ref={menuRef} className='flex bg-gray-50 mt-1 absolute'>
      <div className='m-2'>
        <div className='text-sm'>From</div>
        <Datepicker
          selected={fromDate}
          selectsStart
          startDate={fromDate}
          endDate={toDate}
          dateFormat={'yyyy-MM-dd'}
          onChange={handleSetFromDate}
          customInput={input}
        />
      </div>
      <div className='m-2'>
        <div className='text-sm'>To</div>
        <Datepicker
          selected={toDate}
          selectsEnd
          startDate={fromDate}
          endDate={toDate}
          minDate={fromDate}
          dateFormat={'yyyy-MM-dd'}
          onChange={handleSetToDate}
          customInput={input}
        />
      </div>
    </div>
  );
}
