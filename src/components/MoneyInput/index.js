'use client';

import { NumericFormat } from 'react-number-format';

export default function MoneyInput({ value, onChange, placeholder = '$0' }) {
  return (
    <NumericFormat
      value={value}
      onValueChange={(values) => onChange(values.value)}
      thousandSeparator=','
      prefix='$'
      className='w-full px-4 py-3 bg-black border-2 border-gray-800 rounded-lg text-white text-center focus:border-blue-500 focus:outline-none text-lg font-semibold'
      placeholder={placeholder}
      allowNegative={false}
    />
  );
}
