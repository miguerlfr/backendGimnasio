import express from 'express';
import dbConexion from './database/conexionMongoose.js';
import dotenv from 'dotenv';
import cors from 'cors'

// Importar cron job y envío de correos electrónicos
import cronJob from './middlewares/jobs.js'; // Asegúrate de que la ruta sea correcta

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
app.use(express.static('public'))
app.use(cors())

app.use('/api/clientes', clientes);
app.use('/api/compras', compras);
app.use('/api/ingresos', ingresos);
app.use('/api/mantenimientos', mantenimientos);
app.use('/api/maquinas', maquinas);
app.use('/api/pagos', pagos);
app.use('/api/planes', planes);
app.use('/api/productos', productos)
app.use('/api/proveedores', proveedores)
app.use('/api/sedes', sedes);
app.use('/api/usuarios', usuarios);
app.use('/api/ventas', ventas);

app.listen(process.env.PORT, async () => {
    await dbConexion();
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);

    // Iniciar el cron job
    cronJob.start();
});