import React, { useState } from 'react';
import useComponentIsVisible from '../../hooks/useComponentIsVisible';

interface DropdownProps {
  items: { name: string; code: string }[];
  limit?: number;
  placeholder?: string;
  onClick: (key: string) => void;
}

export default function Dropdown({ items, limit, placeholder, onClick }: DropdownProps) {
  const [inputValue, setInputValue] = useState('');
  const dropdownVisibility = useComponentIsVisible(false);

  let values = items.filter((item) => {
    if (inputValue.length < 3) {
      return false;
    }
    const name = item.name.toLowerCase();
    const code = item.code.toLowerCase();
    return name.includes(inputValue.toLowerCase()) || code.includes(inputValue.toLowerCase());
  });

  if (limit) {
    values = values.slice(0, limit);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleDropDownItemClick = (value: string) => {
    dropdownVisibility.setIsComponentVisible(false);
    setInputValue('');
    onClick(value);
  };

  return (
    <div ref={dropdownVisibility.ref}>
      <input
        className='p-1 border border-gray-200 m-1 rounded-sm'
        type='text'
        onChange={handleInputChange}
        placeholder={placeholder}
        value={inputValue}
      />
      {values.length ? (
        <div className='absolute flex flex-col'>
          {values.map((value) => (
            <TickerDropdownElement
              key={value.code}
              code={value.code}
              name={value.name}
              onClick={handleDropDownItemClick}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface TickerDropdownProps {
  code: string;
  name: string;
  onClick: (key: string) => void;
}

export function TickerDropdownElement({ code, name, onClick }: TickerDropdownProps) {
  return (
    <div
      className='min-w-[180px] ml-1 p-2 text-sm bg-gray-50 cursor-pointer hover:bg-amaranth-purple hover:text-white'
      onClick={() => onClick(code)}
    >
      <div>{code}</div>
      <div>{name}</div>
    </div>
  );
}
