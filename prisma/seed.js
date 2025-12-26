const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Crear inventario inicial
  const productos = [
    { producto: 'frijoles', cantidad: 20, precio: 20 },
    { producto: 'arroz', cantidad: 15, precio: 18 },
    { producto: 'totopos', cantidad: 30, precio: 12 },
    { producto: 'salsas', cantidad: 25, precio: 25 },
    { producto: 'jarochas', cantidad: 18, precio: 22 },
    { producto: 'molcajete', cantidad: 12, precio: 30 },
    { producto: 'guacamoles', cantidad: 10, precio: 35 },
    { producto: 'sopes', cantidad: 22, precio: 15 },
  ];

  for (const prod of productos) {
    await prisma.inventario.upsert({
      where: { producto: prod.producto },
      update: {},
      create: prod,
    });
  }

  console.log('✅ Inventario inicial creado');

  // Crear algunos cortes de ejemplo
  const hoy = new Date();

  for (let i = 1; i <= 5; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - i);

    await prisma.corte.create({
      data: {
        fecha: fecha,
        inventarioFinal: {
          frijoles: 10 + i,
          arroz: 8 + i,
          totopos: 15 + i,
          salsas: 12 + i,
          jarochas: 10 + i,
          molcajete: 8 + i,
          guacamoles: 6 + i,
          sopes: 14 + i,
        },
        proveedores: {
          salsas: { paso: true, dejo: 15, cobro: 375 },
          jarochas: { paso: false, dejo: 0, cobro: 0 },
          arroces: { paso: true, dejo: 10, cobro: 180 },
          guacamoles: { paso: false, dejo: 0, cobro: 0 },
        },
        tandas: [
          { harina: 0.5, masa: 1 },
          { harina: 0.5, masa: 0.75 },
          { harina: 0.25, masa: 1 },
        ],
        totalBultos: 4,
        ventaTortilla: 3520,
        ventaProductos: 1200 + i * 100,
        gastosExtras: [
          { concepto: 'Luz', monto: 150 },
          { concepto: 'Gas', monto: 200 },
        ],
        totalGastos: 905,
        totalVentas: 4720 + i * 100,
        deberiaHaber: 3815 + i * 100,
        dineroEnCaja: i === 3 ? 3765 : 3815 + i * 100,
        diferencia: i === 3 ? -50 : 0,
        estado: i === 3 ? 'falto' : 'cuadro',
      },
    });
  }

  console.log('✅ Cortes de ejemplo creados');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
