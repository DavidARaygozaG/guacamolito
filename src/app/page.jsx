import Link from 'next/link';

export default function Home() {
  const hoy = new Date();
  const fechaFormateada = hoy.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className='min-h-screen bg-black'>
      {/* Header con glassmorphism oscuro */}
      <div className='backdrop-blur-md bg-gray-950/80 shadow-2xl border-b border-blue-900/20 sticky top-0 z-10'>
        <div className='max-w-2xl mx-auto px-6 py-5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='w-14 h-14 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-500/30 transform hover:rotate-12 transition-transform'>
                🌮
              </div>
              <div>
                <h1 className='text-2xl font-black text-white tracking-tight'>Tortillería Eduardo</h1>
                <p className='text-sm text-gray-400 font-medium'>Control Diario</p>
              </div>
            </div>

            <Link
              href='/admin'
              className='text-xs text-gray-500 hover:text-blue-400 transition-colors px-3 py-1 rounded-full hover:bg-gray-900/50'>
              🔒 Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className='max-w-lg mx-auto px-6 py-12 space-y-8'>
        {/* Fecha con estilo */}
        <div className='text-center space-y-2'>
          <div className='inline-flex items-center space-x-2 px-4 py-2 bg-gray-900/60 backdrop-blur-sm rounded-full shadow-lg border border-blue-900/30'>
            <span className='text-2xl'>📅</span>
            <span className='text-sm font-semibold text-gray-200 capitalize'>{fechaFormateada}</span>
          </div>
        </div>

        {/* Botón Principal con efecto neón azul */}
        <div className='relative group'>
          {/* Glow effect */}
          <div className='absolute -inset-1 bg-linear-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity'></div>

          {/* Botón */}
          <Link
            href='/corte'
            className='relative block w-full bg-linear-to-br from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-500 hover:via-blue-600 hover:to-cyan-500 text-white rounded-3xl shadow-2xl shadow-blue-500/50 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]'>
            {/* Shine effect */}
            <div className='absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000'></div>

            {/* Contenido del botón */}
            <div className='relative px-8 py-12 text-center space-y-4'>
              <div className='text-7xl drop-shadow-lg animate-bounce'>📝</div>
              <div>
                <div className='text-3xl font-black tracking-tight mb-1'>HACER CORTE</div>
                <div className='text-xl font-bold opacity-90'>del día de hoy</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Estado del día */}
        <div className='bg-gray-950/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-blue-500/10 p-6 border border-gray-800'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-bold text-white flex items-center space-x-2'>
              <span>📊</span>
              <span>Estado de Hoy</span>
            </h3>
          </div>

          {/* Alerta de sin registrar */}
          <div className='bg-linear-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-xl p-5 text-center backdrop-blur-sm'>
            <div className='flex items-center justify-center space-x-3 mb-2'>
              <span className='text-3xl'>⚠️</span>
              <span className='text-xl font-bold text-blue-400'>Sin Registrar</span>
            </div>
            <p className='text-sm text-blue-200/80'>Aún no se ha hecho el corte del día</p>
          </div>
        </div>

        {/* Último corte registrado */}
        <div className='bg-gray-950/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 border border-gray-800'>
          <h3 className='text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4'>Último Corte Registrado</h3>

          <div className='flex items-center justify-between p-5 bg-linear-to-br from-gray-900 to-black rounded-xl border border-gray-800'>
            <div className='space-y-1'>
              <div className='flex items-center space-x-2'>
                <span className='text-2xl'>📅</span>
                <span className='text-lg font-bold text-white'>Ayer, 6 Diciembre</span>
              </div>
              <div className='flex items-center space-x-4 text-sm text-gray-400 ml-9'>
                <span className='flex items-center space-x-1'>
                  <span className='font-semibold'>💰</span>
                  <span>$3,450</span>
                </span>
                <span className='text-gray-600'>•</span>
                <span className='flex items-center space-x-1'>
                  <span className='font-semibold'>🕒</span>
                  <span>8:45 PM</span>
                </span>
              </div>
            </div>

            {/* Badge de estado */}
            <div className='shrink-0'>
              <div className='px-5 py-2.5 bg-linear-to-r from-cyan-500 to-teal-500 text-black font-bold rounded-xl shadow-lg shadow-cyan-500/50 flex items-center space-x-2'>
                <span className='text-xl'>✅</span>
                <span>Cuadró</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer discreto */}
        <div className='text-center pt-8'>
          <p className='text-xs text-gray-600'>Sistema v1.0 • Diciembre 2024</p>
        </div>
      </div>
    </div>
  );
}
