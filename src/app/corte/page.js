'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Trash2, Layers, Info } from 'lucide-react';
import { Badge, Card, Switch, Separator, badgeVariants } from '@/components/ui';
import { toast } from 'sonner';

import NumberInput from '@/components/NumberInput';
import FractionSelector from '@/components/FractionSelector';
import MoneyInput from '@/components/MoneyInput';

export default function CortePage() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);

  // Estados del formulario
  const [inventarioFinal, setInventarioFinal] = useState({
    frijoles: '0',
    arroz: '0',
    totopos: '0',
    salsas: '0',
    jarochas: '0',
    molcajete: '0',
    guacamoles: '0',
    sopes: '0',
    tostadas: '0',
  });

  const [proveedores, setProveedores] = useState({
    salsas: { paso: false, dejo: '', cobro: '' },
    jarochas: { paso: false, dejo: '', cobro: '' },
    arroces: { paso: false, dejo: '', cobro: '' },
    guacamoles: { paso: false, dejo: '', cobro: '' },
  });

  const [tandas, setTandas] = useState([
    { harina: '0', masa: '0' },
    { harina: '0', masa: '0' },
    { harina: '0', masa: '0' },
    { harina: '0', masa: '0' },
  ]);

  const [gastosExtras, setGastosExtras] = useState([
    { concepto: 'Luz', monto: '' },
    { concepto: 'Gas', monto: '' },
  ]);

  const [tortillaSobrante, setTortillaSobrante] = useState('');
  const [dineroEnCaja, setDineroEnCaja] = useState('');

  const productos = [
    { key: 'frijoles', nombre: 'Frijoles', emoji: '🫘', precio: 25 },
    { key: 'arroz', nombre: 'Arroz', emoji: '🍚', precio: 25 },
    { key: 'totopos', nombre: 'Totopos', emoji: '🔺', precio: 35 },
    { key: 'salsas', nombre: 'Salsas', emoji: '🌶️', precio: 20 },
    { key: 'jarochas', nombre: 'Jarochas', emoji: '🥙', precio: 20 },
    { key: 'molcajete', nombre: 'Salsa Molcajete', emoji: '🪨', precio: 20 },
    { key: 'guacamoles', nombre: 'Guacamoles', emoji: '🥑', precio: 20 },
    { key: 'sopes', nombre: 'Sopes', emoji: '🫓', precio: 25 },
    { key: 'tostadas', nombre: 'Tostadas', emoji: '🍘', precio: 17 },
  ];

  // Agregar gasto
  const agregarGasto = () => {
    setGastosExtras([...gastosExtras, { concepto: '', monto: '' }]);
  };

  // Eliminar gasto
  const eliminarGasto = (index) => {
    if (gastosExtras.length > 1) {
      const newGastos = gastosExtras.filter((_, i) => i !== index);
      setGastosExtras(newGastos);
    }
  };

  // Calcular totales
  const calcularTotales = () => {
    // Calcular venta de tortilla
    const totalBultos = tandas.reduce((sum, tanda) => {
      const h = parseFloat(tanda.harina) || 0;
      const m = parseFloat(tanda.masa) || 0;
      return sum + h + m;
    }, 0);
    const ventaTortilla = totalBultos * 880;

    // Calcular venta de productos (temporal)
    const ventaProductos = productos.reduce((sum, g) => {
      let subTotal = inventarioFinal[g.key] * g.precio;
      return sum + (parseFloat(subTotal) || 0);
    }, 0);

    const totalVentas = ventaTortilla + ventaProductos;

    // Calcular gastos
    const gastosProveedores = Object.values(proveedores).reduce((sum, p) => {
      return sum + (parseFloat(p.cobro) || 0);
    }, 0);

    const gastosOtros = gastosExtras.reduce((sum, g) => {
      return sum + (parseFloat(g.monto) || 0);
    }, 0);

    const kilosSobrantes = parseFloat(tortillaSobrante) || 0;
    const costoTortillaSobrante = kilosSobrantes * 22;

    const totalGastos = gastosProveedores + gastosOtros + costoTortillaSobrante;

    const deberiaHaber = totalVentas - totalGastos;
    const diferencia = (parseFloat(dineroEnCaja) || 0) - deberiaHaber;

    return {
      totalBultos,
      ventaTortilla,
      ventaProductos,
      totalVentas,
      gastosProveedores,
      gastosOtros,
      costoTortillaSobrante,
      totalGastos,
      deberiaHaber,
      dineroEnCaja: parseFloat(dineroEnCaja) || 0,
      diferencia,
    };
  };

  const handleSiguiente = () => {
    if (paso < 6) {
      setPaso(paso + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAtras = () => {
    if (paso > 1) {
      setPaso(paso - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGuardar = () => {
    console.log('Guardando corte...', calcularTotales());
    toast.success('¡Corte guardado exitosamente!', {
      description: 'El corte del día ha sido registrado con éxito.',
      duration: 3000,
    });
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  return (
    <div className='min-h-screen bg-[#070b14] text-slate-200 selection:bg-cyan-500/30 font-sans relative overflow-hidden'>
      {/* Dynamic Background */}
      <div className='absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,rgba(16,185,129,0.05)_50%,transparent_100%)] opacity-60 z-0 pointer-events-none' />
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay z-0 pointer-events-none" />

      {/* Header */}
      <div className='sticky top-0 z-20 backdrop-blur-3xl bg-[#0a0f1c]/70 border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'>
        <div className='max-w-2xl mx-auto px-6 py-5'>
          <div className='flex items-center justify-between'>
            <Link href='/' className='flex items-center space-x-4 group'>
              <div className='p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors shadow-inner'>
                <ChevronLeft className='w-5 h-5 text-gray-300' />
              </div>
              <div>
                <h1 className='text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-indigo-400 drop-shadow-sm tracking-tight'>
                  Corte del Día
                </h1>
                <p className='text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5'>Paso {paso} de 6</p>
              </div>
            </Link>

            {/* Indicador de progreso */}
            <div className='flex items-center space-x-1.5'>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <motion.div
                  key={num}
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: num === paso ? 1.1 : 1,
                    width: num === paso ? 36 : 10,
                  }}
                  className={`h-2.5 rounded-full transition-all shadow-sm ${
                    num === paso
                      ? 'bg-linear-to-r from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(56,189,248,0.6)]'
                      : num < paso
                        ? 'bg-cyan-900/40 border border-cyan-500/30'
                        : 'bg-white/5 border border-white/5'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido con animación */}
      <div className='max-w-2xl mx-auto px-6 py-10 relative z-10'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={paso}
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
            {/* PASO 1: Inventario Final */}
            {paso === 1 && (
              <div className='space-y-8'>
                <div className='text-center mb-10'>
                  <motion.div
                    className='text-6xl mb-6 inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    animate={{ rotate: [0, 8, -8, 0], y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                    📦
                  </motion.div>
                  <h2 className='text-4xl font-black text-white mb-3 tracking-tight'>Inventario Final</h2>
                  <p className='text-slate-400 text-lg'>¿Cuántas unidades quedaron al cerrar?</p>
                </div>

                <Card className='bg-[#111827]/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-2 sm:p-4 rounded-4xl space-y-2 overflow-hidden relative'>
                  <div className='absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none' />

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-4'>
                    {productos.map((producto, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={producto.key}
                        className='relative z-10 bg-black/40 border border-white/5 rounded-2xl p-4 hover:border-cyan-500/30 hover:bg-black/60 transition-all shadow-inner group'>
                        <NumberInput
                          label={`${producto.emoji} ${producto.nombre}`}
                          value={inventarioFinal[producto.key]}
                          onChange={(val) => setInventarioFinal({ ...inventarioFinal, [producto.key]: val })}
                        />
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* PASO 2: Proveedores */}
            {paso === 2 && (
              <div className='space-y-8'>
                <div className='text-center mb-10'>
                  <motion.div
                    className='text-6xl mb-6 inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    animate={{ x: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                    🚚
                  </motion.div>
                  <h2 className='text-4xl font-black text-white mb-3 tracking-tight'>Proveedores</h2>
                  <p className='text-slate-400 text-lg'>¿Pasaron proveedores a surtir u hoy?</p>
                </div>

                <div className='space-y-5'>
                  {Object.entries(proveedores).map(([key, value], idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      key={key}>
                      <Card className='bg-[#111827]/60 backdrop-blur-2xl border border-white/10 shadow-lg p-6 rounded-3xl overflow-hidden relative group hover:border-indigo-500/30 transition-colors'>
                        <div className='absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/10 to-transparent group-hover:via-indigo-500/50 transition-colors' />

                        <div className='flex items-center justify-between mb-2 relative z-10'>
                          <h3 className='text-xl font-black text-white capitalize tracking-wide'>Proveedor de {key}</h3>
                          <div className='flex items-center space-x-3 bg-black/30 px-3 py-1.5 rounded-full border border-white/5'>
                            <span
                              className={`text-sm font-bold tracking-wider ${value.paso ? 'text-indigo-400' : 'text-slate-500'}`}>
                              {value.paso ? 'SÍ' : 'NO'}
                            </span>
                            <Switch
                              checked={value.paso}
                              onCheckedChange={(checked) =>
                                setProveedores({ ...proveedores, [key]: { ...value, paso: checked } })
                              }
                              className='data-[state=checked]:bg-indigo-500'
                            />
                          </div>
                        </div>

                        <AnimatePresence>
                          {value.paso && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              className='grid grid-cols-2 gap-6 overflow-hidden relative z-10'>
                              <div className='bg-black/40 p-4 rounded-2xl border border-white/5'>
                                <label className='block text-xs uppercase font-bold text-slate-400 mb-3 tracking-wider'>
                                  Dejó (piezas)
                                </label>
                                <input
                                  type='number'
                                  value={value.dejo}
                                  onChange={(e) => setProveedores({ ...proveedores, [key]: { ...value, dejo: e.target.value } })}
                                  className='w-full px-4 py-3 bg-[#0a0f1c] border border-white/10 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none text-2xl text-center font-black transition-all shadow-inner'
                                  placeholder='0'
                                />
                              </div>
                              <div className='bg-black/40 p-4 rounded-2xl border border-white/5'>
                                <label className='block text-xs uppercase font-bold text-slate-400 mb-3 tracking-wider'>
                                  Cobró
                                </label>
                                <MoneyInput
                                  value={value.cobro}
                                  onChange={(val) => setProveedores({ ...proveedores, [key]: { ...value, cobro: val } })}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 3: Producción de Tortilla */}
            {paso === 3 && (
              <div className='space-y-8'>
                <div className='text-center mb-10'>
                  <motion.div
                    className='text-6xl mb-6 inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                    🌽
                  </motion.div>
                  <h2 className='text-4xl font-black text-white mb-3 tracking-tight'>Producción de Tortilla</h2>
                  <p className='text-slate-400 text-lg'>Registra las tandas y bultos del día</p>
                </div>

                <div className='space-y-5'>
                  {tandas.map((tanda, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}>
                      <Card className='bg-[#111827]/60 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-colors'>
                        <div className='absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full blur-[20px] pointer-events-none' />
                        <div className='flex items-center justify-between mb-6 relative z-10'>
                          <h3 className='text-xl font-black text-white'>
                            Tanda <span className='text-amber-400'>{index + 1}</span>
                          </h3>
                          <Badge
                            variant='outline'
                            className='text-amber-400 border-amber-500/30 bg-amber-950/30 px-3 py-1 text-sm font-bold tracking-wider'>
                            {(parseFloat(tanda.harina || 0) + parseFloat(tanda.masa || 0)).toFixed(2)} bultos
                          </Badge>
                        </div>

                        <div className='space-y-5 relative z-10 bg-black/30 p-5 rounded-2xl border border-white/5'>
                          <FractionSelector
                            label='Harina'
                            value={tanda.harina}
                            onChange={(val) => {
                              const newTandas = [...tandas];
                              newTandas[index].harina = val;
                              setTandas(newTandas);
                            }}
                          />

                          <FractionSelector
                            label='Masa'
                            value={tanda.masa}
                            onChange={(val) => {
                              const newTandas = [...tandas];
                              newTandas[index].masa = val;
                              setTandas(newTandas);
                            }}
                          />
                        </div>
                      </Card>
                    </motion.div>
                  ))}

                  {/* Total calculado */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className='relative overflow-hidden rounded-[2.5rem] mt-8 group'>
                    <div className='absolute inset-0 bg-linear-to-r from-amber-600/20 via-orange-500/20 to-amber-600/20 group-hover:opacity-100 transition-opacity opacity-80 backdrop-blur-3xl' />
                    <div className='absolute inset-0 border border-amber-500/40 rounded-[2.5rem]' />

                    <div className='p-8 text-center relative z-10'>
                      <p className='text-amber-200/70 text-sm font-black uppercase tracking-widest mb-2'>Total en bultos</p>
                      <p className='text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] tracking-tighter'>
                        {calcularTotales().totalBultos.toFixed(2)}
                      </p>
                      <Separator className='my-6 bg-amber-500/20 h-px' />
                      <p className='text-amber-200/70 text-sm font-black uppercase tracking-widest mb-2'>
                        Venta Estimada de Tortilla
                      </p>
                      <p className='text-4xl font-black bg-clip-text text-transparent bg-linear-to-r from-amber-200 to-orange-400'>
                        ${calcularTotales().ventaTortilla.toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* PASO 4: Gastos Extras y Mermas */}
            {paso === 4 && (
              <div className='space-y-8'>
                <div className='text-center mb-10'>
                  <motion.div
                    className='text-6xl mb-6 inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                    💸
                  </motion.div>
                  <h2 className='text-4xl font-black text-white mb-3 tracking-tight'>Gastos y Mermas</h2>
                  <p className='text-slate-400 text-lg'>Registra los gastos del día y la tortilla sobrante</p>
                </div>

                {/* Sección Tortilla Sobrante */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='mb-6'>
                  <Card className='bg-linear-to-br from-[#111827]/80 to-[#1e1b4b]/80 backdrop-blur-2xl border border-indigo-500/30 shadow-[0_4px_30px_rgba(79,70,229,0.15)] p-6 sm:p-8 rounded-4xl space-y-6 relative overflow-hidden'>
                    <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-[100px] pointer-events-none blur-xl' />

                    <div className='flex items-start space-x-4 relative z-10'>
                      <div className='p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl'>
                        <Layers className='w-6 h-6' />
                      </div>
                      <div>
                        <h3 className='text-xl font-black text-white leading-none'>
                          Tortilla Sobrante{' '}
                          <span className='text-xs ml-2 font-medium bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30'>
                            Merma
                          </span>
                        </h3>
                        <p className='text-sm text-slate-400 mt-2'>
                          Introduce los kilos de tortilla fría que sobraron. Se calculará a $22 MXN por kilo y se sumará a los
                          gastos.
                        </p>
                      </div>
                    </div>

                    <div className='bg-black/40 p-5 rounded-2xl border border-white/5 flex items-center gap-4 relative z-10'>
                      <div className='flex-1'>
                        <label className='block text-xs uppercase font-bold text-slate-400 mb-2 tracking-wider'>
                          Kilos Sobrantes
                        </label>
                        <input
                          type='number'
                          step='0.1'
                          value={tortillaSobrante}
                          onChange={(e) => setTortillaSobrante(e.target.value)}
                          className='w-full px-4 py-3 bg-[#0a0f1c] border border-white/10 rounded-xl text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none text-2xl font-black transition-all shadow-inner'
                          placeholder='0.0'
                        />
                      </div>
                      <div className='text-center px-4'>
                        <span className='block text-xs uppercase font-bold text-slate-500 mb-2'>Total</span>
                        <span className='text-2xl font-black text-indigo-400'>
                          ${(parseFloat(tortillaSobrante || 0) * 22).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Gastos Adicionales */}
                <Card className='bg-[#111827]/60 backdrop-blur-2xl border border-white/10 shadow-lg p-6 sm:p-8 rounded-4xl space-y-6 overflow-hidden relative'>
                  <div className='flex items-center space-x-3 mb-4'>
                    <div className='p-2 bg-pink-500/20 text-pink-400 rounded-xl'>
                      <Trash2 className='w-5 h-5' />
                    </div>
                    <h3 className='text-xl font-black text-white'>Gastos Adicionales</h3>
                  </div>

                  <div className='space-y-4 relative z-10'>
                    <AnimatePresence>
                      {gastosExtras.map((gasto, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9, x: -20 }}
                          className='flex flex-col sm:flex-row gap-3 bg-black/30 p-4 rounded-2xl border border-white/5'>
                          <div className='flex-1 flex items-center gap-2'>
                            <input
                              type='text'
                              value={gasto.concepto}
                              onChange={(e) => {
                                const newGastos = [...gastosExtras];
                                newGastos[index].concepto = e.target.value;
                                setGastosExtras(newGastos);
                              }}
                              className='flex-1 px-4 py-3 bg-[#0a0f1c] border border-white/10 rounded-xl text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 focus:outline-none text-lg font-semibold transition-all shadow-inner'
                              placeholder='Concepto (ej. Luz)'
                            />
                            {gastosExtras.length > 1 && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => eliminarGasto(index)}
                                className='p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 transition-colors border border-red-500/20'>
                                <Trash2 className='w-5 h-5' />
                              </motion.button>
                            )}
                          </div>
                          <div className='w-full sm:w-48'>
                            <MoneyInput
                              value={gasto.monto}
                              onChange={(val) => {
                                const newGastos = [...gastosExtras];
                                newGastos[index].monto = val;
                                setGastosExtras(newGastos);
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Botón agregar gasto */}
                  <motion.button
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={agregarGasto}
                    className='relative w-full py-4 mt-6 bg-transparent border-2 border-dashed border-white/10 hover:border-pink-500/50 rounded-2xl text-slate-400 hover:text-pink-400 font-bold transition-all flex items-center justify-center space-x-2 group z-10'>
                    <div className='p-1 bg-white/5 rounded-full group-hover:bg-pink-500/20 transition-colors'>
                      <Plus className='w-5 h-5' />
                    </div>
                    <span>Añadir otro gasto</span>
                  </motion.button>
                </Card>
              </div>
            )}

            {/* PASO 5: Dinero en Caja */}
            {paso === 5 && (
              <div className='space-y-8'>
                <div className='text-center mb-10'>
                  <motion.div
                    className='text-6xl mb-6 inline-block drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                    💵
                  </motion.div>
                  <h2 className='text-4xl font-black text-white mb-3 tracking-tight'>Dinero en Caja</h2>
                  <p className='text-slate-400 text-lg'>Efectivo físico total al cerrar la caja</p>
                </div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring' }}>
                  <Card className='bg-[#0a101d]/80 backdrop-blur-3xl border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)] p-10 sm:p-14 rounded-[3rem] relative overflow-hidden group'>
                    <div className='absolute inset-0 bg-linear-to-b from-emerald-500/5 to-transparent pointer-events-none' />

                    <div className='text-center space-y-8 relative z-10'>
                      <label className='block text-emerald-400/80 font-black uppercase tracking-widest text-sm'>
                        Ingresa el monto exacto
                      </label>
                      <div className='relative max-w-sm mx-auto'>
                        <span className='absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-emerald-500/50'>
                          $
                        </span>
                        <input
                          type='number'
                          value={dineroEnCaja}
                          onChange={(e) => setDineroEnCaja(e.target.value)}
                          className='w-full pl-16 pr-8 py-6 bg-black/50 border-2 border-emerald-500/50 rounded-3xl text-white text-center focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none text-5xl font-black shadow-inner transition-all'
                          placeholder='0.00'
                          autoFocus
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            )}

            {/* PASO 6: Preview */}
            {paso === 6 && (
              <div className='space-y-8'>
                <div className='text-center mb-10'>
                  <motion.div
                    className='text-6xl mb-6 inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}>
                    📋
                  </motion.div>
                  <h2 className='text-4xl font-black text-white mb-3 tracking-tight'>Resumen del Día</h2>
                  <Badge
                    variant='outline'
                    className='text-amber-400 border-amber-500/50 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md rounded-full font-bold uppercase tracking-wider text-xs'>
                    Revisa con atención antes de guardar
                  </Badge>
                </div>

                {(() => {
                  const totales = calcularTotales();
                  return (
                    <div className='space-y-6'>
                      {/* Ventas */}
                      <Card className='bg-[#111827]/70 backdrop-blur-2xl border border-white/5 p-7 rounded-4xl overflow-hidden relative shadow-lg'>
                        <div className='absolute top-0 left-0 w-2 h-full bg-cyan-500' />
                        <h3 className='text-sm uppercase tracking-widest font-black text-cyan-400 mb-6 flex items-center space-x-3'>
                          <span className='p-2 bg-cyan-500/10 rounded-lg'>💰</span>
                          <span>Ingresos Calculados</span>
                        </h3>
                        <div className='space-y-4 text-white pl-4'>
                          <div className='flex justify-between items-center bg-white/5 p-3 rounded-xl'>
                            <span className='text-slate-300 font-medium'>Tortillas</span>
                            <span className='font-bold text-lg text-white'>${totales.ventaTortilla.toLocaleString()}</span>
                          </div>
                          <div className='flex justify-between items-center bg-white/5 p-3 rounded-xl'>
                            <span className='text-slate-300 font-medium'>Productos Extra</span>
                            <span className='font-bold text-lg text-white'>${totales.ventaProductos.toLocaleString()}</span>
                          </div>
                          <div className='pt-2'>
                            <div className='flex justify-between items-center pt-4 border-t border-white/10'>
                              <span className='font-black text-white text-xl'>TOTAL VENTAS</span>
                              <span className='font-black text-3xl text-cyan-400 drop-shadow-md'>
                                ${totales.totalVentas.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Gastos */}
                      <Card className='bg-[#111827]/70 backdrop-blur-2xl border border-white/5 p-7 rounded-4xl overflow-hidden relative shadow-lg'>
                        <div className='absolute top-0 left-0 w-2 h-full bg-pink-500' />
                        <h3 className='text-sm uppercase tracking-widest font-black text-pink-400 mb-6 flex items-center space-x-3'>
                          <span className='p-2 bg-pink-500/10 rounded-lg'>📉</span>
                          <span>Egresos y Mermas</span>
                        </h3>
                        <div className='space-y-4 text-white pl-4'>
                          <div className='flex justify-between items-center bg-white/5 p-3 rounded-xl'>
                            <span className='text-slate-300 font-medium'>Pago Proveedores</span>
                            <span className='font-bold text-lg text-white'>${totales.gastosProveedores.toLocaleString()}</span>
                          </div>
                          {(totales.costoTortillaSobrante > 0 || parseFloat(tortillaSobrante) > 0) && (
                            <div className='flex justify-between items-center bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20'>
                              <span className='text-indigo-300 font-medium'>Tortilla Sobrante ({tortillaSobrante || 0} kg)</span>
                              <span className='font-bold text-lg text-indigo-400'>
                                ${totales.costoTortillaSobrante.toLocaleString()}
                              </span>
                            </div>
                          )}
                          <div className='flex justify-between items-center bg-white/5 p-3 rounded-xl'>
                            <span className='text-slate-300 font-medium'>Gastos Adicionales</span>
                            <span className='font-bold text-lg text-white'>${totales.gastosOtros.toLocaleString()}</span>
                          </div>
                          <div className='pt-2'>
                            <div className='flex justify-between items-center pt-4 border-t border-white/10'>
                              <span className='font-black text-white text-xl'>TOTAL GASTOS</span>
                              <span className='font-black text-3xl text-pink-400 drop-shadow-md'>
                                ${totales.totalGastos.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Resultado Final */}
                      <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className={`backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-8 sm:p-10 border-2 overflow-hidden relative ${
                          totales.diferencia === 0
                            ? 'bg-emerald-900/30 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)]'
                            : totales.diferencia < 0
                              ? 'bg-red-900/30 border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.3)]'
                              : 'bg-indigo-900/30 border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.3)]'
                        }`}>
                        <div className='text-center space-y-8 relative z-10'>
                          <div className='grid grid-cols-2 gap-4'>
                            <div className='bg-black/40 p-5 rounded-2xl border border-white/5'>
                              <p className='text-slate-400 text-xs font-bold uppercase tracking-widest mb-2'>Debería haber</p>
                              <p className='text-3xl font-black text-white'>${totales.deberiaHaber.toLocaleString()}</p>
                            </div>
                            <div className='bg-black/40 p-5 rounded-2xl border border-white/5'>
                              <p className='text-slate-400 text-xs font-bold uppercase tracking-widest mb-2'>Hay en caja</p>
                              <p className='text-3xl font-black text-white'>${totales.dineroEnCaja.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className='pt-6 border-t border-white/10'>
                            <p
                              className={`text-5xl sm:text-6xl font-black tracking-tighter drop-shadow-lg ${
                                totales.diferencia === 0
                                  ? 'text-emerald-400'
                                  : totales.diferencia < 0
                                    ? 'text-red-400'
                                    : 'text-indigo-400'
                              }`}>
                              {totales.diferencia === 0 && <span className='block mb-2 text-2xl'>✅ Cuadre Perfecto</span>}
                              {totales.diferencia === 0 ? (
                                '$0.00'
                              ) : totales.diferencia < 0 ? (
                                <>
                                  <span className='block text-2xl mb-1 text-red-400/80 uppercase tracking-widest font-black'>
                                    Faltante de
                                  </span>{' '}
                                  -${Math.abs(totales.diferencia).toLocaleString()}
                                </>
                              ) : (
                                <>
                                  <span className='block text-2xl mb-1 text-indigo-400/80 uppercase tracking-widest font-black'>
                                    Sobrante de
                                  </span>{' '}
                                  +${totales.diferencia.toLocaleString()}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <p className='text-center text-slate-500 font-medium text-sm mt-8 flex items-center justify-center gap-2'>
                        <Info className='w-4 h-4' /> Una vez guardado el corte será definitivo y se registrará
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Botones de navegación */}
        <motion.div
          className='flex flex-col sm:flex-row gap-4 mt-12 relative z-20'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}>
          {paso > 1 && (
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(30,41,59,1)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAtras}
              className='flex-1 px-6 py-5 bg-[#0a0f1c] text-white font-bold rounded-3xl transition-all flex items-center justify-center space-x-2 border border-white/10 shadow-lg hover:shadow-white/5'>
              <ChevronLeft className='w-5 h-5' />
              <span>Paso Anterior</span>
            </motion.button>
          )}

          {paso < 6 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSiguiente}
              className='flex-2 px-6 py-5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center space-x-2 text-lg'>
              <span>Continuar al Paso {paso + 1}</span>
              <ChevronRight className='w-5 h-5' />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGuardar}
              className='flex-2 px-6 py-5 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center space-x-3 text-xl'>
              <span className='text-2xl mb-1'>✅</span>
              <span>Guardar Corte del Día</span>
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
