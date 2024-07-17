import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    fechaIngreso: { type: Date, default: Date.now },
    documento: { type: Number, unique: true, required: true },
    fechaNacimiento: { type: Date },
    edad: { type: Number },
    direccion: { type: String },
    telefono: { type: Number },
    objetivo: { type: String, required: true },
    observaciones: { type: String },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plane",
        required: true,
    },
    fechaVencimiento: { type: Date, required: true },
    /* foto */
    seguimiento: [
        {
            fecha: { type: Date, default: Date.now },
            peso: { type: Number },
            imc: { type: Number },
            estadoIMC: { type: String },
            brazo: { type: Number },
            pierna: { type: Number },
            cintura: { type: Number },
            estaturaMetros: { type: Number },
            estaturaCentimetros: { type: Number }
        }
    ],
    estado: { type: Number, default: 1 }
});

export default mongoose.model("Cliente", clienteSchema);

// Prefiero por Postman

// {
//     "nombre": "Laura Martinez",
//     "fechaIngreso": "2024-04-15T00:00:00.000Z",
//     "documento": 321654987,
//     "fechaNacimiento": "1992-03-25T00:00:00.000Z",
//     "direccion": "Calle 789, Ciudad",
//     "telefono": 3216549870,
//     "objetivo": "Tonificar el cuerpo",
//     "observaciones": "Utilizar mas peso al levantar pierna",
//     "estado": 1,
//     "seguimiento": [
//         {
//             "fecha": "2024-05-05T00:00:00.000Z",
//             "peso": 60,
//             "brazo": 28,
//             "pierna": 53,
//             "cintura": 75,
//             "estaturaMetros": 155,
//             "estaturaCentimetros": 50,
//         }
//     ]
// }

// {
//     "nombre": "Ana Garcia",
//     "fechaIngreso": "2024-04-25T00:00:00.000Z",
//     "documento": 456789123,
//     "fechaNacimiento": "1995-10-20T00:00:00.000Z",
//     "direccion": "Calle Principal, Ciudad",
//     "telefono": 4567891230,
//     "objetivo": "Mejorar resistencia",
//     "observaciones": "Hacer más cardio",
//     "estado": 1,
//     "seguimiento": [
//         {
//             "fecha": "2024-05-03T00:00:00.000Z",
//             "peso": 70,
//             "brazo": 32,
//             "pierna": 57,
//             "cintura": 85,
//             "estaturaMetros": 165,
//             "estaturaCentimetros": 50,
//         }
//     ]
// }

// {
//     "nombre": "Pedro Ramirez",
//     "fechaIngreso": "2024-04-20T00:00:00.000Z",
//     "documento": 789123456,
//     "fechaNacimiento": "1980-07-10T00:00:00.000Z",
//     "direccion": "Avenida 456, Ciudad",
//     "telefono": 7891234560,
//     "objetivo": "Mantener la forma física",
//     "observaciones": "Hacer cardio despues de entrenar",
//     "estado": 1,
//     "seguimiento": [
//         {
//             "fecha": "2024-05-04T00:00:00.000Z",
//             "peso": 75,
//             "brazo": 33,
//             "pierna": 58,
//             "cintura": 87,
//             "estaturaMetros": 170,
//             "estaturaCentimetros": 50,
//         }
//     ]
// }

// {
//     "nombre": "Maria Lopez",
//     "fechaIngreso": "2024-04-28T00:00:00.000Z",
//     "documento": 987654321,
//     "fechaNacimiento": "1985-05-15T00:00:00.000Z",
//     "direccion": "Avenida Principal, Ciudad",
//     "telefono": 9876543210,
//     "objetivo": "Ganar masa muscular",
//     "observaciones": "Comer mas grasas",
//     "estado": 1,
//     "seguimiento": [
//         {
//             "fecha": "2024-05-02T00:00:00.000Z",
//             "peso": 65,
//             "brazo": 30,
//             "pierna": 55,
//             "cintura": 80,
//             "estaturaMetros": 160,
//             "estaturaCentimetros": 50,
//         }
//     ]
// }

// {
//     "nombre": "Juan Fernández",
//     "fechaIngreso": "2024-04-30T00:00:00.000Z",
//     "documento": 123456789,
//     "fechaNacimiento": "1990-01-01T00:00:00.000Z",
//     "direccion": "Calle 123, Ciudad",
//     "telefono": 1234567890,
//     "objetivo": "Perder peso",
//     "observaciones": "Utilizar menos peso",
//     "estado": 1,
//     "seguimiento": [
//         {
//             "fecha": "2024-05-01T00:00:00.000Z",
//             "peso": 80,
//             "brazo": 35,
//             "pierna": 60,
//             "cintura": 90,
//             "estaturaMetros": 175,
//             "estaturaCentimetros": 50,
//         }
//     ]
// }