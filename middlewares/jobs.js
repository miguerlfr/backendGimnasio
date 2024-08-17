import cron from 'node-cron';
import Cliente from "../models/clientes.js";
import { PlanClientePorTerminar, PlanClienteTerminado } from "../middlewares/email.js";
import moment from 'moment-timezone';

// Definición del cron job para que se ejecute todos los días a las 5:30 AM
const cronJobRecordatorio = cron.schedule('20 18 * * *', async () => {
  const now = moment().tz('America/Bogota');  // Configura la zona horaria
  const fechaComparacion = now.clone().add(6, 'days'); // Sumar 7 días a la fecha actual

  // Establecer el inicio y el fin del día de comparación en la zona horaria local
  const startOfDay = fechaComparacion.clone().startOf('day').toDate();
  const endOfDay = fechaComparacion.clone().endOf('day').toDate();

  console.log(`Buscando clientes con fechaVencimiento el dia ${endOfDay.toISOString()}`);

  try {
    // Buscar clientes cuya fecha de vencimiento sea exactamente dentro de 7 días
    const clientes = await Cliente.find({
      fechaVencimiento: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    console.log(`Clientes encontrados: ${clientes.length}`);
    clientes.forEach(cliente => {
      console.log(`Cliente encontrado: ${cliente.nombre}, Fecha de vencimiento: ${cliente.fechaVencimiento}`);
    });

    if (clientes.length === 0) {
      console.log('No hay clientes con plan por vencer en 7 días.');
    } else {
      for (const cliente of clientes) {
        try {
          // Enviar el email de aviso
          await PlanClientePorTerminar(cliente.email, cliente.nombre, cliente.fechaVencimiento);

          // Log para verificar a qué cliente se le envió el email
          console.log(`Correo enviado a: ${cliente.nombre} (${cliente.email}) informando que su plan vence el ${cliente.fechaVencimiento.toLocaleDateString('es-ES')}.`);
        } catch (error) {
          console.error(`Error al procesar el cliente ${cliente._id}:`, error);
        }
      }
    }

    console.log('Proceso completado: Correos de aviso enviados.');
  } catch (error) {
    console.error('Error al buscar clientes o enviar correos de aviso:', error);
  }
});


// Definición del cron job para que se ejecute todos los días a las 9:00 PM
const cronJob = cron.schedule('10 18 * * *', async () => {
  const now = new Date();
  const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDay = new Date(localDate.getTime());
  const endOfDay = new Date(localDate.getTime() + 24 * 60 * 60 * 1000 - 1); // Fin del día local

  // Convertir a UTC para la comparación con la base de datos
  const startOfDayUTC = new Date(Date.UTC(startOfDay.getFullYear(), startOfDay.getMonth(), startOfDay.getDate()));
  const endOfDayUTC = new Date(Date.UTC(endOfDay.getFullYear(), endOfDay.getMonth(), endOfDay.getDate(), 23, 59, 59, 999));

  console.log(`Fecha actual (local): ${now.toISOString()}`);
  console.log(`Buscando clientes con fechaVencimiento entre ${startOfDayUTC.toISOString()} y ${endOfDayUTC.toISOString()} que estén activos.`);

  try {
    // Buscar clientes cuya fecha de vencimiento esté dentro del rango de hoy y cuyo estado sea activo (1)
    const clientes = await Cliente.find({
      fechaVencimiento: {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC
      },
      estado: 1 // Solo considerar clientes que estén activos
    });

    console.log(`Clientes encontrados: ${clientes.length}`);
    clientes.forEach(cliente => {
      console.log(`Cliente encontrado: ${cliente.nombre}, Fecha de vencimiento: ${cliente.fechaVencimiento}`);
    });

    if (clientes.length === 0) {
      console.log('No hay clientes con plan expirado hoy.');
    } else {
      for (const cliente of clientes) {
        try {
          // Enviar el email
          await PlanClienteTerminado(cliente.email, cliente.nombre, cliente.fechaVencimiento);
          
          // Actualizar el estado del cliente a inactivo usando su _id
          cliente.estado = 0;
          await cliente.save();

          // Log para verificar a qué cliente se le envió el email
          console.log(`Correo enviado a: ${cliente.nombre} (${cliente.email}). Cliente inactivado.`);
        } catch (error) {
          console.error(`Error al procesar el cliente ${cliente._id}:`, error);
        }
      }
    }

    console.log('Proceso completado: Correos enviados y clientes inactivados.');
  } catch (error) {
    console.error('Error al buscar clientes o enviar correos:', error);
  }
});

// Exportación de los cron jobs
export { cronJob, cronJobRecordatorio };