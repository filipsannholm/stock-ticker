import React from 'react';

export default function NoTickerSelected() {
  return (
    <div className='flex flex-col items-center justify-center h-full min-h-[88vh] text-gray-500 text-6xl text-center font-bold leading-normal'>
      <div>Stocks from the Helsinki stock exchange.</div>
      <div>Type the name of a company or stock ticker in the search to begin.</div>
    </div>
  );
}
