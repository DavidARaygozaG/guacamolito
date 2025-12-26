'use client';

import { motion } from 'framer-motion';

export default function FractionSelector({ value, onChange, label }) {
  const fractions = [
    { value: '0', label: '-' },
    { value: '0.25', label: '1/4' },
    { value: '0.5', label: '1/2' },
    { value: '0.75', label: '3/4' },
    { value: '1', label: '1' },
  ];

  return (
    <div className='space-y-2'>
      {label && <label className='block text-sm font-semibold text-gray-400'>{label}</label>}
      <div className='grid grid-cols-5 gap-2'>
        {fractions.map((fraction) => {
          const isSelected = value === fraction.value;
          return (
            <motion.button
              key={fraction.value}
              type='button'
              onClick={() => onChange(fraction.value)}
              whileTap={{ scale: 0.95 }}
              className={`
                relative py-3 rounded-xl font-bold text-lg transition-all
                ${
                  isSelected
                    ? 'bg-linear-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border-2 border-gray-800'
                }
              `}>
              {fraction.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
