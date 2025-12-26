'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (password === 'papa123') {
        localStorage.setItem('admin_logged', 'true');
        router.push('/admin/dashboard');
      } else {
        setError('Contraseña incorrecta');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className='min-h-screen bg-black flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <motion.div className='text-center mb-8' initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div
            className='inline-block mb-4'
            animate={{
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.3)',
                '0 0 40px rgba(59, 130, 246, 0.5)',
                '0 0 20px rgba(59, 130, 246, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}>
            <div className='w-20 h-20 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50'>
              <Lock className='w-10 h-10 text-white' />
            </div>
          </motion.div>
          <h1 className='text-4xl font-black text-white mb-2'>Panel Admin</h1>
          <p className='text-gray-400'>Tortillería Eduardo</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className='bg-gray-950/90 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl shadow-blue-500/10 p-8'
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}>
          <form onSubmit={handleLogin} className='space-y-6'>
            {/* Password */}
            <div>
              <label className='block text-gray-300 font-semibold mb-2 text-sm'>Contraseña de Administrador</label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className='w-full px-4 py-3 bg-black border-2 border-gray-800 rounded-xl text-white focus:border-blue-500 focus:outline-none text-lg pr-12'
                  placeholder='••••••••'
                  required
                  disabled={loading}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors'>
                  {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
              </div>
              {error && (
                <motion.p
                  className='text-red-400 text-sm mt-2 flex items-center space-x-1'
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}>
                  <span>❌</span>
                  <span>{error}</span>
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type='submit'
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className='w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/50 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed'>
              {loading ? (
                <span className='flex items-center justify-center space-x-2'>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    ⚙️
                  </motion.span>
                  <span>Verificando...</span>
                </span>
              ) : (
                'Entrar al Panel'
              )}
            </motion.button>
          </form>

          {/* Helper */}
          <p className='text-center text-gray-500 text-xs mt-6'>
            Contraseña de prueba: <span className='font-mono font-semibold text-blue-400'>papa123</span>
          </p>
        </motion.div>

        {/* Volver */}
        <motion.div
          className='text-center mt-6'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}>
          <Link
            href='/'
            className='text-gray-500 hover:text-blue-400 text-sm transition-colors flex items-center justify-center space-x-1'>
            <span>←</span>
            <span>Volver al inicio</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
