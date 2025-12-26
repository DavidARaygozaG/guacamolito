'use client';

import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

export default function NumberInput({ value, onChange, label, min = 0, max = 999 }) {
  const numValue = parseInt(value) || 0;

  const increment = () => {
    if (numValue < max) {
      onChange(String(numValue + 1));
    }
  };

  const decrement = () => {
    if (numValue > min) {
      onChange(String(numValue - 1));
    }
  };

  return (
    <div className='flex items-center justify-between p-4 bg-black/50 rounded-xl border border-gray-800'>
      <label className='text-white font-semibold flex-1'>{label}</label>

      <div className='flex items-center space-x-3'>
        <motion.button
          type='button'
          whileTap={{ scale: 0.9 }}
          onClick={decrement}
          disabled={numValue <= min}
          className='w-10 h-10 flex items-center justify-center rounded-lg bg-black border-2 border-gray-800 text-gray-400 hover:border-blue-500 hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'>
          <Minus className='w-5 h-5' />
        </motion.button>

        <input
          type='number'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='w-20 px-3 py-2 bg-black border-2 border-gray-800 rounded-lg text-white text-center focus:border-blue-500 focus:outline-none text-xl font-bold'
          min={min}
          max={max}
        />

        <motion.button
          type='button'
          whileTap={{ scale: 0.9 }}
          onClick={increment}
          disabled={numValue >= max}
          className='w-10 h-10 flex items-center justify-center rounded-lg bg-black border-2 border-gray-800 text-gray-400 hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'>
          <Plus className='w-5 h-5' />
        </motion.button>
      </div>
    </div>
  );
}
