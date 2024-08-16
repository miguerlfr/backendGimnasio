import express from 'express';
import dbConexion from './database/conexionMongoose.js';
import dotenv from 'dotenv';
import cors from 'cors';

// Importar cron jobs y envío de correos electrónicos
import { cronJob, cronJobRecordatorio } from './middlewares/jobs.js'; // Asegúrate de que la ruta sea correcta

dotenv.config();

import clientes from './routes/clientes.js';
import compras from './routes/compras.js';
import ingresos from './routes/ingresos.js';
import mantenimientos from './routes/mantenimientos.js';
import maquinas from './routes/maquinas.js';
import pagos from './routes/pagos.js';
import planes from './routes/planes.js';
import productos from './routes/productos.js';
import proveedores from './routes/proveedores.js';
import sedes from './routes/sedes.js';
import usuarios from './routes/usuarios.js';
import ventas from './routes/ventas.js';

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.use('/api/clientes', clientes);
app.use('/api/compras', compras);
app.use('/api/ingresos', ingresos);
app.use('/api/mantenimientos', mantenimientos);
app.use('/api/maquinas', maquinas);
app.use('/api/pagos', pagos);
app.use('/api/planes', planes);
app.use('/api/productos', productos);
app.use('/api/proveedores', proveedores);
app.use('/api/sedes', sedes);
app.use('/api/usuarios', usuarios);
app.use('/api/ventas', ventas);

app.listen(process.env.PORT, async () => {
    await dbConexion();
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);

    // Iniciar los cron jobs
    cronJob.start();
    cronJobRecordatorio.start();
});
// ahora, necesitoque aca, import Plane from "../models/planes.js";
// import Pago from "../models/pagos.js";
// import Cliente from "../models/clientes.js";

// const helpersPagos = {
//     postPutId: async (cliente) => {
//         const existe = await Cliente.findById(cliente);
        
//         if (!existe) {
//             throw new Error("El cliente no existe");
//         }
//     },
//     postPutPlan: async (plan) => {
// 		const existe = await Plane.findOne({ plan });
// 		if (existe.length === 0) throw new Error("Plan no existe.");
//     },
//     putId: async (idPago, datosActualizados) => {
//         // Buscar la pago por ID
//         const pagoActual = await Pago.findById(idPago);
//         if (!pagoActual) {
//             throw new Error("Pago no encontrada");
//         }

//         // Imprimir datos actuales y actualizados para depuración
//         // console.log("pago Actual:", pagoActual);
//         // console.log("Datos Actualizados:", datosActualizados);

//         // Comparar los datos actuales con los datos actualizados
//         const datosIguales = Object.keys(datosActualizados).every(key => {
//             let valorActual = pagoActual[key];
//             let valorActualizado = datosActualizados[key];

//             // Manejar el caso específico de la fecha
//             if (key === 'fecha' && valorActual instanceof Date) {
//                 valorActual = valorActual.toISOString().split('T')[0]; // Eliminar la parte "T00:00:00.000Z"
//             }
//             if (key === 'fecha' && typeof valorActualizado === 'string') {
//                 valorActualizado = valorActualizado.split('T')[0]; // Eliminar la parte "T00:00:00.000Z"
//             }

//             // Convertir valores a cadena para comparación
//             const valorActualStr = (valorActual || '').toString();
//             const valorActualizadoStr = (valorActualizado || '').toString();

//             return valorActualStr === valorActualizadoStr;
//         });

//         // Imprimir resultado de la comparación
//         // console.log("Datos Iguales:", datosIguales);

//         if (datosIguales) {
//             throw new Error("Ningún cambio proporcionado para editar.");
//         }
//     }
// }

// export default helpersPagos; necesito que me crres otro helper que se llame postPlan, y quiero que digamos tengo un cliente con un plan de 1 mes osea 30 dias y el plan del cliente se le acaba y el cliente por no pagar pasa a inactivo, pero lo que yo quiero que tu hagas aca es que si el cliente paga ese mes, ya el cliente no deberia niguna plta y despues quiero que si el cliente pago para estar otro mes a la fechaVencimiento del cliente se le sumen los dias del plan y que si acaso el cliente estaba inactivo me active el estado del cliente