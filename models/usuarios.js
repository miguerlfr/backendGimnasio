import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    sede: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sede",
        required: true,
    },
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: Number },
    password: { type: String, required: true },
    rol: { type: String, default: "User" },
    estado: { type: Number },
});

export default mongoose.model("Usuario", usuarioSchema);

// Se necesitan crear Sedes primero

// {
//     "sede": "Sede A",
//     "nombre": "Juan López",
//     "email": "juan.lopez@example.com",
//     "telefono": 5559876543,
//     "password": "juan12345",
//     "rol": "Administrador"
// }
// {
//     "sede": "Sede B",
//     "nombre": "María Rodríguez",
//     "email": "maria.rodriguez@example.com",
//     "telefono": 5552345678,
//     "password": "maria12345",
//     "rol": "Recepcionista"
// }
// {
//     "sede": "Sede C",
//     "nombre": "David Martínez",
//     "email": "david.martinez@example.com",
//     "telefono": 5558765432,
//     "password": "david12345",
//     "rol": "Instructor"
// }
// {
//     "sede": "Sede A",
//     "nombre": "Ana García",
//     "email": "ana.garcia@example.com",
//     "telefono": 5551234567,
//     "password": "ana12345",
//     "rol": "Administrador"
// }
// {
//     "sede": "Sede B",
//     "nombre": "Laura Pérez",
//     "email": "laura.perez@example.com",
//     "telefono": 5553456789,
//     "password": "laura12345",
//     "rol": "Recepcionista"
// }