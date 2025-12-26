'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
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

    const totalGastos = gastosProveedores + gastosOtros;

    const deberiaHaber = totalVentas - totalGastos;
    const diferencia = (parseFloat(dineroEnCaja) || 0) - deberiaHaber;

    return {
      totalBultos,
      ventaTortilla,
      ventaProductos,
      totalVentas,
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
      description: 'El corte del día ha sido registrado.',
      duration: 3000,
    });
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  return (
    <div className='min-h-screen bg-black'>
      {/* Header */}
      <div className='backdrop-blur-md bg-gray-950/80 shadow-2xl border-b border-blue-900/20 sticky top-0 z-10'>
        <div className='max-w-2xl mx-auto px-6 py-5'>
          <div className='flex items-center justify-between'>
            <Link href='/' className='flex items-center space-x-3 hover:opacity-80 transition-opacity'>
              <ChevronLeft className='w-6 h-6 text-gray-400' />
              <div>
                <h1 className='text-xl font-black text-white'>Corte del Día</h1>
                <p className='text-sm text-gray-400'>Paso {paso} de 6</p>
              </div>
            </Link>

            {/* Indicador de progreso */}
            <div className='flex items-center space-x-1'>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <motion.div
                  key={num}
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: num === paso ? 1.2 : 1,
                    width: num === paso ? 32 : 8,
                  }}
                  className={`h-2 rounded-full transition-all ${
                    num === paso ? 'bg-linear-to-r from-blue-500 to-cyan-500' : num < paso ? 'bg-cyan-500' : 'bg-gray-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido con animación */}
      <div className='max-w-2xl mx-auto px-6 py-8'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={paso}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}>
            {/* PASO 1: Inventario Final */}
            {paso === 1 && (
              <div className='space-y-6'>
                <div className='text-center mb-8'>
                  <motion.div
                    className='text-6xl mb-4'
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    📦
                  </motion.div>
                  <h2 className='text-3xl font-black text-white mb-2'>Inventario Final</h2>
                  <p className='text-gray-400'>¿Cuántas unidades quedaron?</p>
                </div>

                <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6 space-y-3'>
                  {productos.map((producto) => (
                    <NumberInput
                      key={producto.key}
                      label={`${producto.emoji} ${producto.nombre}`}
                      value={inventarioFinal[producto.key]}
                      onChange={(val) => setInventarioFinal({ ...inventarioFinal, [producto.key]: val })}
                    />
                  ))}
                </Card>
              </div>
            )}

            {/* PASO 2: Proveedores */}
            {paso === 2 && (
              <div className='space-y-6'>
                <div className='text-center mb-8'>
                  <motion.div
                    className='text-6xl mb-4'
                    animate={{ x: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    🚚
                  </motion.div>
                  <h2 className='text-3xl font-black text-white mb-2'>Proveedores</h2>
                  <p className='text-gray-400'>¿Pasaron proveedores hoy?</p>
                </div>

                <div className='space-y-4'>
                  {Object.entries(proveedores).map(([key, value]) => (
                    <Card key={key} className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6'>
                      <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-bold text-white capitalize'>Proveedor de {key}</h3>
                        <div className='flex items-center space-x-3'>
                          <span className={`text-sm font-semibold ${value.paso ? 'text-cyan-400' : 'text-gray-500'}`}>
                            {value.paso ? 'SÍ' : 'NO'}
                          </span>
                          <Switch
                            checked={value.paso}
                            onCheckedChange={(checked) => setProveedores({ ...proveedores, [key]: { ...value, paso: checked } })}
                          />
                        </div>
                      </div>

                      <AnimatePresence>
                        {value.paso && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className='grid grid-cols-2 gap-4 overflow-hidden'>
                            <div>
                              <label className='block text-sm text-gray-400 mb-2'>Dejó (piezas)</label>
                              <input
                                type='number'
                                value={value.dejo}
                                onChange={(e) => setProveedores({ ...proveedores, [key]: { ...value, dejo: e.target.value } })}
                                className='w-full px-4 py-3 bg-black border-2 border-gray-800 rounded-lg text-white focus:border-blue-500 focus:outline-none text-lg text-center font-semibold'
                                placeholder='0'
                              />
                            </div>
                            <div>
                              <label className='block text-sm text-gray-400 mb-2'>Cobró</label>
                              <MoneyInput
                                value={value.cobro}
                                onChange={(val) => setProveedores({ ...proveedores, [key]: { ...value, cobro: val } })}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 3: Producción de Tortilla */}
            {paso === 3 && (
              <div className='space-y-6'>
                <div className='text-center mb-8'>
                  <motion.div
                    className='text-6xl mb-4'
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}>
                    🌽
                  </motion.div>
                  <h2 className='text-3xl font-black text-white mb-2'>Producción de Tortilla</h2>
                  <p className='text-gray-400'>Registra las tandas del día</p>
                </div>

                <div className='space-y-4'>
                  {tandas.map((tanda, index) => (
                    <Card key={index} className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6'>
                      <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-bold text-white'>Tanda {index + 1}</h3>
                        <Badge variant='outline' className='text-blue-400 border-blue-500/50'>
                          {(parseFloat(tanda.harina || 0) + parseFloat(tanda.masa || 0)).toFixed(2)} bultos
                        </Badge>
                      </div>

                      <div className='space-y-4'>
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
                  ))}

                  {/* Total calculado */}
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className='bg-linear-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/50 rounded-xl p-6 text-center backdrop-blur-sm'>
                    <p className='text-gray-400 mb-2'>Total en bultos</p>
                    <p className='text-5xl font-black text-blue-400'>{calcularTotales().totalBultos.toFixed(2)}</p>
                    <Separator className='my-3 bg-gray-800' />
                    <p className='text-sm text-gray-400 mb-1'>Venta de tortilla</p>
                    <p className='text-3xl font-bold text-cyan-400'>${calcularTotales().ventaTortilla.toLocaleString()}</p>
                  </motion.div>
                </div>
              </div>
            )}

            {/* PASO 4: Gastos Extras */}
            {paso === 4 && (
              <div className='space-y-6'>
                <div className='text-center mb-8'>
                  <div className='text-6xl mb-4'>💸</div>
                  <h2 className='text-3xl font-black text-white mb-2'>Gastos Extras</h2>
                  <p className='text-gray-400'>Otros gastos del día</p>
                </div>

                <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6 space-y-4'>
                  <AnimatePresence>
                    {gastosExtras.map((gasto, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className='space-y-2'>
                        <div className='flex items-center space-x-2'>
                          <input
                            type='text'
                            value={gasto.concepto}
                            onChange={(e) => {
                              const newGastos = [...gastosExtras];
                              newGastos[index].concepto = e.target.value;
                              setGastosExtras(newGastos);
                            }}
                            className='flex-1 px-4 py-2 bg-black border-2 border-gray-800 rounded-lg text-white focus:border-blue-500 focus:outline-none text-sm'
                            placeholder='Concepto'
                          />
                          {gastosExtras.length > 1 && (
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => eliminarGasto(index)}
                              className='p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors'>
                              <Trash2 className='w-5 h-5' />
                            </motion.button>
                          )}
                        </div>
                        <MoneyInput
                          value={gasto.monto}
                          onChange={(val) => {
                            const newGastos = [...gastosExtras];
                            newGastos[index].monto = val;
                            setGastosExtras(newGastos);
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Botón agregar gasto */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={agregarGasto}
                    className='w-full py-3 bg-gray-900 hover:bg-gray-800 border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-lg text-gray-400 hover:text-blue-400 font-semibold transition-colors flex items-center justify-center space-x-2'>
                    <Plus className='w-5 h-5' />
                    <span>Agregar otro gasto</span>
                  </motion.button>
                </Card>
              </div>
            )}

            {/* PASO 5: Dinero en Caja */}
            {paso === 5 && (
              <div className='space-y-6'>
                <div className='text-center mb-8'>
                  <div className='text-6xl mb-4'>💵</div>
                  <h2 className='text-3xl font-black text-white mb-2'>Dinero en Caja</h2>
                  <p className='text-gray-400'>¿Cuánto dinero hay en efectivo?</p>
                </div>

                <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-8'>
                  <div className='text-center space-y-4'>
                    <label className='block text-gray-400 text-lg'>Efectivo contado</label>
                    <input
                      type='number'
                      value={dineroEnCaja}
                      onChange={(e) => setDineroEnCaja(e.target.value)}
                      className='w-full px-6 py-6 bg-black border-2 border-blue-500 rounded-xl text-white text-center focus:border-blue-400 focus:outline-none text-4xl font-black'
                      placeholder='$0'
                      autoFocus
                    />
                  </div>
                </Card>
              </div>
            )}

            {/* PASO 6: Preview */}
            {paso === 6 && (
              <div className='space-y-6'>
                <div className='text-center mb-8'>
                  <div className='text-6xl mb-4'>📋</div>
                  <h2 className='text-3xl font-black text-white mb-2'>Resumen del Día</h2>
                  <Badge variant='outline' className='text-blue-400 border-blue-500/50 text-sm'>
                    ⚠️ Revisa antes de guardar
                  </Badge>
                </div>

                {(() => {
                  const totales = calcularTotales();
                  return (
                    <div className='space-y-4'>
                      {/* Ventas */}
                      <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6'>
                        <h3 className='text-xl font-bold text-cyan-400 mb-4 flex items-center space-x-2'>
                          <span>💰</span>
                          <span>VENTAS</span>
                        </h3>
                        <div className='space-y-2 text-white'>
                          <div className='flex justify-between'>
                            <span>Tortillas:</span>
                            <span className='font-bold'>${totales.ventaTortilla.toLocaleString()}</span>
                          </div>
                          <div className='flex justify-between'>
                            <span>Productos:</span>
                            <span className='font-bold'>${totales.ventaProductos.toLocaleString()}</span>
                          </div>
                          <Separator className='my-2 bg-gray-800' />
                          <div className='flex justify-between text-xl'>
                            <span className='font-bold'>Total:</span>
                            <span className='font-black text-cyan-400'>${totales.totalVentas.toLocaleString()}</span>
                          </div>
                        </div>
                      </Card>

                      {/* Gastos */}
                      <Card className='bg-gray-950/90 backdrop-blur-sm border-gray-800 p-6'>
                        <h3 className='text-xl font-bold text-red-400 mb-4 flex items-center space-x-2'>
                          <span>💸</span>
                          <span>GASTOS</span>
                        </h3>
                        <div className='space-y-2 text-white'>
                          <div className='flex justify-between text-xl'>
                            <span className='font-bold'>Total:</span>
                            <span className='font-black text-red-400'>${totales.totalGastos.toLocaleString()}</span>
                          </div>
                        </div>
                      </Card>

                      {/* Resultado Final */}
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className={`backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-2 ${
                          totales.diferencia === 0
                            ? 'bg-cyan-500/20 border-cyan-500 shadow-cyan-500/50'
                            : totales.diferencia < 0
                            ? 'bg-red-500/20 border-red-500 shadow-red-500/50'
                            : 'bg-blue-500/20 border-blue-500 shadow-blue-500/50'
                        }`}>
                        <div className='text-center space-y-4'>
                          <div>
                            <p className='text-gray-300 text-sm'>Debería haber</p>
                            <p className='text-4xl font-black text-white'>${totales.deberiaHaber.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className='text-gray-300 text-sm'>Hay en caja</p>
                            <p className='text-4xl font-black text-white'>${totales.dineroEnCaja.toLocaleString()}</p>
                          </div>
                          <Separator className='bg-white/20' />
                          <div>
                            <p
                              className={`text-5xl font-black ${
                                totales.diferencia === 0
                                  ? 'text-cyan-400'
                                  : totales.diferencia < 0
                                  ? 'text-red-400'
                                  : 'text-blue-400'
                              }`}>
                              {totales.diferencia === 0
                                ? '✅ CUADRÓ'
                                : totales.diferencia < 0
                                ? `❌ FALTAN $${Math.abs(totales.diferencia).toLocaleString()}`
                                : `⚠️ SOBRAN $${totales.diferencia.toLocaleString()}`}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <p className='text-center text-gray-400 text-sm'>⚠️ Una vez guardado NO podrás modificar este corte</p>
                    </div>
                  );
                })()}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Botones de navegación */}
        <motion.div
          className='flex gap-4 mt-8'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}>
          {paso > 1 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAtras}
              className='flex-1 px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 border border-gray-800'>
              <ChevronLeft className='w-5 h-5' />
              <span>Atrás</span>
            </motion.button>
          )}

          {paso < 6 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSiguiente}
              className='flex-1 px-6 py-4 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/50 transition-all flex items-center justify-center space-x-2'>
              <span>Siguiente</span>
              <ChevronRight className='w-5 h-5' />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGuardar}
              className='flex-1 px-6 py-4 bg-linear-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/50 transition-all text-xl'>
              ✅ GUARDAR CORTE
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
