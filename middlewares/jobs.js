// import cron from 'node-cron';
// import mongoose from 'mongoose';
// import Cliente from "../models/clientes.js";
// import { enviarEmailRecuperacion } from "../middlewares/email.js";

// // Definición del cron job
// const cronJob = cron.schedule('0 * * * *', async () => {
//   const now = new Date();
//   const startOfHour = new Date(now.setMinutes(0, 0, 0));
//   const endOfHour = new Date(now.setMinutes(59, 59, 999));

//   try {
//     const clientes = await Cliente.find({
//       fechaVencimiento: {
//         $gte: startOfHour,
//         $lte: endOfHour
//       }
//     });

//     clientes.forEach(cliente => {
//         enviarEmailRecuperacion(cliente.email, 'Fin de tu plan', `Hola ${cliente.nombre}, tu plan ha expirado.`);
//     });

//     console.log('Correo(s) enviados a clientes cuyo plan ha expirado.');
//   } catch (error) {
//     console.error('Error al buscar clientes o enviar correos:', error);
//   }
// });

// // Exportación del cron job
// export default cronJob;

import cron from 'node-cron';
import Cliente from "../models/clientes.js";
import { PlanClienteTerminado } from "../middlewares/email.js";

// Definición del cron job para que se ejecute todos los días a las 9:00 PM
const cronJob = cron.schedule('36 21 * * *', async () => {
  const now = new Date();
  const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDay = new Date(localDate.getTime());
  const endOfDay = new Date(localDate.getTime() + 24 * 60 * 60 * 1000 - 1); // Fin del día local
  
  // Convertir a UTC para la comparación con la base de datos
  const startOfDayUTC = new Date(Date.UTC(startOfDay.getFullYear(), startOfDay.getMonth(), startOfDay.getDate()));
  const endOfDayUTC = new Date(Date.UTC(endOfDay.getFullYear(), endOfDay.getMonth(), endOfDay.getDate(), 23, 59, 59, 999));

  console.log(`Fecha actual (local): ${now.toISOString()}`);
  console.log(`Buscando clientes con fechaVencimiento entre ${startOfDayUTC.toISOString()} y ${endOfDayUTC.toISOString()}`);

  try {
    // Buscar clientes cuya fecha de vencimiento esté dentro del rango de hoy
    const clientes = await Cliente.find({
      fechaVencimiento: {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC
      }
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

// Exportación del cron job
export default cronJob;
