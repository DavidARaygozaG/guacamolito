'use client';

import { useEffect, useState, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Badge, Card } from '@/components/ui';

export default function CalendarioPage() {
  const router = useRouter();
  const [mesActual, setMesActual] = useState(new Date());
  const authCheckedRef = useRef(false);
  const [isAuthed, setIsAuthed] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (authCheckedRef.current) return;
    authCheckedRef.current = true;

    const logged = localStorage.getItem('admin_logged');
    if (logged !== 'true') {
      startTransition(() => {
        setIsAuthed(false);
      });
      router.push('/admin');
    }
  }, [router]);

  if (!isAuthed) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className='text-6xl'>
          ⚙️
        </motion.div>
      </div>
    );
  }

  // Datos de ejemplo (después conectaremos con la BD)
  const cortesDelMes = {
    1: { ventas: 3200, diferencia: 0, estado: 'cuadro' },
    2: { ventas: 3450, diferencia: 150, estado: 'sobro' },
    3: { ventas: 3100, diferencia: -50, estado: 'falto' },
    4: { ventas: 3890, diferencia: 0, estado: 'cuadro' },
    5: { ventas: 4320, diferencia: -120, estado: 'falto' },
    6: { ventas: 3650, diferencia: 0, estado: 'cuadro' },
    7: { ventas: 4100, diferencia: 0, estado: 'cuadro' },
    8: { ventas: 3890, diferencia: 0, estado: 'cuadro' },
    9: { ventas: 4250, diferencia: 0, estado: 'cuadro' },
  };

  // Obtener días del mes
  const getDiasDelMes = () => {
    const año = mesActual.getFullYear();
    const mes = mesActual.getMonth();
    const primerDia = new Date(año, mes, 1).getDay();
    const ultimoDia = new Date(año, mes + 1, 0).getDate();

    return { primerDia, ultimoDia };
  };

  const { primerDia, ultimoDia } = getDiasDelMes();

  const cambiarMes = (direccion) => {
    const nuevoMes = new Date(mesActual);
    nuevoMes.setMonth(mesActual.getMonth() + direccion);
    setMesActual(nuevoMes);
  };

  const nombreMes = mesActual.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className='min-h-screen bg-black'>
      {/* Header */}
      <div className='backdrop-blur-md bg-gray-950/80 shadow-2xl border-b border-blue-900/20 sticky top-0 z-10'>
        <div className='max-w-6xl mx-auto px-6 py-5'>
          <div className='flex items-center justify-between'>
            <Link href='/admin/dashboard' className='flex items-center space-x-3 hover:opacity-80 transition-opacity'>
              <ChevronLeft className='w-6 h-6 text-gray-400' />
              <div>
                <h1 className='text-2xl font-black text-white'>Calendario</h1>
                <p className='text-sm text-gray-400'>Historial de cortes</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className='max-w-6xl mx-auto px-6 py-8'>
        {/* Controles del mes */}
        <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6 mb-6'>
          <div className='flex items-center justify-between'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => cambiarMes(-1)}
              className='p-3 bg-gray-900 hover:bg-gray-800 rounded-xl border border-gray-800 transition-colors'>
              <ChevronLeft className='w-5 h-5 text-gray-400' />
            </motion.button>

            <div className='flex items-center space-x-3'>
              <CalendarIcon className='w-6 h-6 text-blue-400' />
              <h2 className='text-2xl font-black text-white capitalize'>{nombreMes}</h2>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => cambiarMes(1)}
              className='p-3 bg-gray-900 hover:bg-gray-800 rounded-xl border border-gray-800 transition-colors'>
              <ChevronRight className='w-5 h-5 text-gray-400' />
            </motion.button>
          </div>
        </Card>

        {/* Calendario */}
        <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6'>
          {/* Días de la semana */}
          <div className='grid grid-cols-7 gap-2 mb-4'>
            {diasSemana.map((dia) => (
              <div key={dia} className='text-center py-3'>
                <span className='text-sm font-bold text-gray-500 uppercase'>{dia}</span>
              </div>
            ))}
          </div>

          {/* Grid de días */}
          <div className='grid grid-cols-7 gap-2'>
            {/* Espacios vacíos antes del primer día */}
            {Array.from({ length: primerDia }).map((_, index) => (
              <div key={`empty-${index}`} className='aspect-square' />
            ))}

            {/* Días del mes */}
            {Array.from({ length: ultimoDia }).map((_, index) => {
              const dia = index + 1;
              const corte = cortesDelMes[dia];
              const hoy = new Date();
              const esHoy =
                dia === hoy.getDate() &&
                mesActual.getMonth() === hoy.getMonth() &&
                mesActual.getFullYear() === hoy.getFullYear();

              return (
                <motion.div
                  key={dia}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: dia * 0.01 }}
                  className={`
                    aspect-square rounded-xl p-2 flex flex-col items-center justify-center
                    transition-all cursor-pointer relative
                    ${
                      esHoy
                        ? 'bg-blue-500/20 border-2 border-blue-500 shadow-lg shadow-blue-500/30'
                        : corte
                        ? 'bg-gray-900 border border-gray-800 hover:border-gray-700'
                        : 'bg-black/30 border border-gray-900'
                    }
                  `}>
                  {/* Número del día */}
                  <span
                    className={`text-sm font-bold mb-1 ${
                      esHoy ? 'text-blue-400' : corte ? 'text-white' : 'text-gray-600'
                    }`}>
                    {dia}
                  </span>

                  {/* Estado del corte */}
                  {corte && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + dia * 0.01 }}
                      className='space-y-1'>
                      {/* Emoji según estado */}
                      <div className='text-2xl'>
                        {corte.estado === 'cuadro' && '✅'}
                        {corte.estado === 'falto' && '❌'}
                        {corte.estado === 'sobro' && '⚠️'}
                      </div>

                      {/* Ventas del día */}
                      <div className='text-[10px] text-gray-400 font-semibold'>
                        ${(corte.ventas / 1000).toFixed(1)}k
                      </div>
                    </motion.div>
                  )}

                  {/* Badge de "Hoy" */}
                  {esHoy && (
                    <div className='absolute -top-1 -right-1'>
                      <Badge className='bg-blue-500 text-white text-[10px] px-1.5 py-0.5'>Hoy</Badge>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Leyenda */}
        <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6 mt-6'>
          <h3 className='text-sm font-bold text-gray-400 uppercase tracking-wider mb-4'>Leyenda</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='flex items-center space-x-3 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30'>
              <span className='text-3xl'>✅</span>
              <div>
                <p className='font-bold text-white'>Cuadró</p>
                <p className='text-xs text-gray-400'>Diferencia = $0</p>
              </div>
            </div>

            <div className='flex items-center space-x-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30'>
              <span className='text-3xl'>❌</span>
              <div>
                <p className='font-bold text-white'>Faltó</p>
                <p className='text-xs text-gray-400'>Diferencia negativa</p>
              </div>
            </div>

            <div className='flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30'>
              <span className='text-3xl'>⚠️</span>
              <div>
                <p className='font-bold text-white'>Sobró</p>
                <p className='text-xs text-gray-400'>Diferencia positiva</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Resumen del mes */}
        <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6 mt-6'>
          <h3 className='text-lg font-black text-white mb-4 flex items-center space-x-2'>
            <span>📊</span>
            <span>Resumen del Mes</span>
          </h3>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center p-4 bg-black/50 rounded-xl border border-gray-800'>
              <p className='text-sm text-gray-400 mb-1'>Cortes</p>
              <p className='text-3xl font-black text-white'>9</p>
            </div>

            <div className='text-center p-4 bg-black/50 rounded-xl border border-gray-800'>
              <p className='text-sm text-gray-400 mb-1'>Cuadraron</p>
              <p className='text-3xl font-black text-cyan-400'>7</p>
            </div>

            <div className='text-center p-4 bg-black/50 rounded-xl border border-gray-800'>
              <p className='text-sm text-gray-400 mb-1'>Faltaron</p>
              <p className='text-3xl font-black text-red-400'>2</p>
            </div>

            <div className='text-center p-4 bg-black/50 rounded-xl border border-gray-800'>
              <p className='text-sm text-gray-400 mb-1'>Promedio</p>
              <p className='text-3xl font-black text-blue-400'>$3.8k</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
