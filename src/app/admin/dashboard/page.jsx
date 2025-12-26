'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Package,
  FileText,
  LogOut,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';
import { Badge, Separator, Card } from '@/components/ui';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const logged = localStorage.getItem('admin_logged');
    if (logged !== 'true') {
      router.push('/admin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged');
    router.push('/');
  };

  // Datos de ejemplo (después conectaremos con la BD)
  const stats = {
    ventasHoy: 4250,
    gastosHoy: 1820,
    diferencia: 2430,
    cortesRealizados: 28,
    promedioDiario: 3890,
  };

  const ultimosCortes = [
    { fecha: '9 Dic', ventas: 4250, gastos: 1820, diferencia: 2430, estado: 'cuadro' },
    { fecha: '8 Dic', ventas: 3890, gastos: 1950, diferencia: 1940, estado: 'cuadro' },
    { fecha: '7 Dic', ventas: 4100, gastos: 2050, diferencia: 2050, estado: 'cuadro' },
    { fecha: '6 Dic', ventas: 3650, gastos: 1700, diferencia: 1950, estado: 'cuadro' },
    { fecha: '5 Dic', ventas: 4320, gastos: 2150, diferencia: 2120, estado: 'falto' },
  ];

  return (
    <div className='min-h-screen bg-black'>
      {/* Header */}
      <div className='backdrop-blur-md bg-gray-950/80 shadow-2xl border-b border-blue-900/20 sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-6 py-5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30'>
                <LayoutDashboard className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-black text-white'>Panel Admin</h1>
                <p className='text-sm text-gray-400'>Tortillería Eduardo</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className='flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors'>
              <LogOut className='w-4 h-4' />
              <span className='text-sm font-semibold'>Salir</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {/* Ventas Hoy */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center'>
                  <DollarSign className='w-6 h-6 text-cyan-400' />
                </div>
                <Badge variant='outline' className='text-cyan-400 border-cyan-500/50'>
                  Hoy
                </Badge>
              </div>
              <div className='space-y-1'>
                <p className='text-sm text-gray-400'>Ventas</p>
                <p className='text-3xl font-black text-white'>${stats.ventasHoy.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          {/* Gastos Hoy */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center'>
                  <TrendingDown className='w-6 h-6 text-red-400' />
                </div>
                <Badge variant='outline' className='text-red-400 border-red-500/50'>
                  Hoy
                </Badge>
              </div>
              <div className='space-y-1'>
                <p className='text-sm text-gray-400'>Gastos</p>
                <p className='text-3xl font-black text-white'>${stats.gastosHoy.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          {/* Diferencia */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center'>
                  <TrendingUp className='w-6 h-6 text-blue-400' />
                </div>
                <Badge variant='outline' className='text-blue-400 border-blue-500/50'>
                  Hoy
                </Badge>
              </div>
              <div className='space-y-1'>
                <p className='text-sm text-gray-400'>Diferencia</p>
                <p className='text-3xl font-black text-blue-400'>${stats.diferencia.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          {/* Promedio */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center'>
                  <ShoppingCart className='w-6 h-6 text-gray-400' />
                </div>
                <Badge variant='outline' className='text-gray-400 border-gray-600'>
                  Mes
                </Badge>
              </div>
              <div className='space-y-1'>
                <p className='text-sm text-gray-400'>Promedio</p>
                <p className='text-3xl font-black text-white'>${stats.promedioDiario.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Grid de 2 columnas */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Últimos Cortes */}
          <div className='lg:col-span-2'>
            <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-black text-white flex items-center space-x-2'>
                  <span>📊</span>
                  <span>Últimos Cortes</span>
                </h2>
                <Link href='/admin/calendario' className='text-sm text-blue-400 hover:text-blue-300 transition-colors'>
                  Ver todos →
                </Link>
              </div>

              <div className='space-y-3'>
                {ultimosCortes.map((corte, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className='flex items-center justify-between p-4 bg-black/50 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors'>
                    <div className='flex items-center space-x-4'>
                      <div className='text-center min-w-[60px]'>
                        <p className='text-xs text-gray-500 uppercase'>Fecha</p>
                        <p className='text-sm font-bold text-white'>{corte.fecha}</p>
                      </div>
                      <Separator orientation='vertical' className='h-10 bg-gray-800' />
                      <div className='space-y-1'>
                        <div className='flex items-center space-x-4 text-sm'>
                          <span className='text-gray-400'>Ventas:</span>
                          <span className='font-semibold text-cyan-400'>${corte.ventas.toLocaleString()}</span>
                        </div>
                        <div className='flex items-center space-x-4 text-sm'>
                          <span className='text-gray-400'>Gastos:</span>
                          <span className='font-semibold text-red-400'>${corte.gastos.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center space-x-3'>
                      <div className='text-right'>
                        <p className='text-xs text-gray-500'>Diferencia</p>
                        <p className='text-lg font-bold text-blue-400'>${corte.diferencia.toLocaleString()}</p>
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-lg font-semibold text-xs ${
                          corte.estado === 'cuadro'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : corte.estado === 'falto'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                        {corte.estado === 'cuadro' ? '✅' : corte.estado === 'falto' ? '❌' : '⚠️'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Navegación Rápida */}
          <div className='space-y-6'>
            <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6'>
              <h2 className='text-xl font-black text-white mb-6 flex items-center space-x-2'>
                <span>🚀</span>
                <span>Acciones</span>
              </h2>

              <div className='space-y-3'>
                <Link href='/admin/calendario'>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className='flex items-center space-x-3 p-4 bg-linear-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-500/30 rounded-xl transition-all cursor-pointer'>
                    <div className='w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center'>
                      <Calendar className='w-5 h-5 text-blue-400' />
                    </div>
                    <div>
                      <p className='font-bold text-white'>Calendario</p>
                      <p className='text-xs text-gray-400'>Ver historial completo</p>
                    </div>
                  </motion.div>
                </Link>

                <Link href='/admin/inventario'>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className='flex items-center space-x-3 p-4 bg-linear-to-r from-cyan-500/10 to-teal-500/10 hover:from-cyan-500/20 hover:to-teal-500/20 border border-cyan-500/30 rounded-xl transition-all cursor-pointer'>
                    <div className='w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center'>
                      <Package className='w-5 h-5 text-cyan-400' />
                    </div>
                    <div>
                      <p className='font-bold text-white'>Inventario</p>
                      <p className='text-xs text-gray-400'>Control de productos</p>
                    </div>
                  </motion.div>
                </Link>

                <Link href='/admin/reportes'>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className='flex items-center space-x-3 p-4 bg-linear-to-r from-teal-500/10 to-green-500/10 hover:from-teal-500/20 hover:to-green-500/20 border border-teal-500/30 rounded-xl transition-all cursor-pointer'>
                    <div className='w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center'>
                      <FileText className='w-5 h-5 text-teal-400' />
                    </div>
                    <div>
                      <p className='font-bold text-white'>Reportes</p>
                      <p className='text-xs text-gray-400'>Generar PDF/Excel</p>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </Card>

            {/* Info de Cortes */}
            <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6'>
              <h3 className='text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4'>Este Mes</h3>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-300'>Cortes realizados</span>
                  <span className='text-2xl font-black text-white'>{stats.cortesRealizados}</span>
                </div>
                <Separator className='bg-gray-800' />
                <div className='flex items-center justify-between'>
                  <span className='text-gray-300'>Días restantes</span>
                  <span className='text-2xl font-black text-blue-400'>{31 - stats.cortesRealizados}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
