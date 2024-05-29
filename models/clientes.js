import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true }, // preguntar al profe si es o no requerido
    fechaIngreso: { type: Date, default: Date.now },
    documento: { type: Number, unique: true, required: true },
    fechaNacimiento: { type: Date },
    edad: { type: Number },
    direccion: { type: String },
    telefono: { type: Number },
    objetivo: { type: String, required: true },
    observaciones: { type: String },
    estado: { type: Number, default: 1 },
    plan: { type: String, required: true },
    fechaVencimiento: { type: Date, required: true },
    /* foto */
    seguimiento: [
        {
            fecha: { type: Date, default: Date.now },
            peso: { type: Number },
            imc: { type: Number },
            brazo: { type: Number },
            pierna: { type: Number },
            cintura: { type: Number },
            estatura: { type: Number },
        },
    ],
});

export default mongoose.model("Cliente", clienteSchema);

// Prefiero por Postman

// {
//     "nombre": "Laura Martinez",
//     "fechaIngreso": "2024-04-15T00:00:00.000Z",
//     "documento": 321654987,
//     "fechaNacimiento": "1992-03-25T00:00:00.000Z",
//     "edad": 32,
//     "direccion": "Calle 789, Ciudad",
//     "telefono": 3216549870,
//     "objetivo": "Tonificar el cuerpo",
//     "observaciones": "Utilizar mas peso al levantar pierna",
//     "plan": "Plan básico",
//     "fechaVencimiento": "2024-05-15T00:00:00.000Z",
//     "seguimiento": [
//         {
//             "fecha": "2024-05-05T00:00:00.000Z",
//             "peso": 60,
//             "imc": 19,
//             "brazo": 28,
//             "pierna": 53,
//             "cintura": 75,
//             "estatura": 155
//         }
//     ]
// }

// {
//     "nombre": "Ana Garcia",
//     "fechaIngreso": "2024-04-25T00:00:00.000Z",
//     "documento": 456789123,
//     "fechaNacimiento": "1995-10-20T00:00:00.000Z",
//     "edad": 29,
//     "direccion": "Calle Principal, Ciudad",
//     "telefono": 4567891230,
//     "objetivo": "Mejorar resistencia",
//     "observaciones": "Hacer más cardio",
//     "plan": "Plan medio",
//     "fechaVencimiento": "2024-07-25T00:00:00.000Z",
//     "seguimiento": [
//         {
//             "fecha": "2024-05-03T00:00:00.000Z",
//             "peso": 70,
//             "imc": 22,
//             "brazo": 32,
//             "pierna": 57,
//             "cintura": 85,
//             "estatura": 165
//         }
//     ]
// }

// {
//     "nombre": "Pedro Ramirez",
//     "fechaIngreso": "2024-04-20T00:00:00.000Z",
//     "documento": 789123456,
//     "fechaNacimiento": "1980-07-10T00:00:00.000Z",
//     "edad": 44,
//     "direccion": "Avenida 456, Ciudad",
//     "telefono": 7891234560,
//     "objetivo": "Mantener la forma física",
//     "observaciones": "Hacer cardio despues de entrenar",
//     "plan": "Plan avanzado",
//     "fechaVencimiento": "2025-04-20T00:00:00.000Z",
//     "seguimiento": [
//         {
//             "fecha": "2024-05-04T00:00:00.000Z",
//             "peso": 75,
//             "imc": 24,
//             "brazo": 33,
//             "pierna": 58,
//             "cintura": 87,
//             "estatura": 170
//         }
//     ]
// }

// {
//     "nombre": "Maria Lopez",
//     "fechaIngreso": "2024-04-28T00:00:00.000Z",
//     "documento": 987654321,
//     "fechaNacimiento": "1985-05-15T00:00:00.000Z",
//     "edad": 37,
//     "direccion": "Avenida Principal, Ciudad",
//     "telefono": 9876543210,
//     "objetivo": "Ganar masa muscular",
//     "observaciones": "Comer mas grasas",
//     "plan": "Plan avanzado",
//     "fechaVencimiento": "2025-04-28T00:00:00.000Z",
//     "seguimiento": [
//         {
//             "fecha": "2024-05-02T00:00:00.000Z",
//             "peso": 65,
//             "imc": 20,
//             "brazo": 30,
//             "pierna": 55,
//             "cintura": 80,
//             "estatura": 160
//         }
//     ]
// }

// {
//     "nombre": "Juan Fernández",
//     "fechaIngreso": "2024-04-30T00:00:00.000Z",
//     "documento": 123456789,
//     "fechaNacimiento": "1990-01-01T00:00:00.000Z",
//     "edad": 32,
//     "direccion": "Calle 123, Ciudad",
//     "telefono": 1234567890,
//     "objetivo": "Perder peso",
//     "observaciones": "Utilizar menos peso",
//     "plan": "Plan básico",
//     "fechaVencimiento": "2024-05-30T00:00:00.000Z",
//     "seguimiento": [
//         {
//             "fecha": "2024-05-01T00:00:00.000Z",
//             "peso": 80,
//             "imc": 25,
//             "brazo": 35,
//             "pierna": 60,
//             "cintura": 90,
//             "estatura": 175
//         }
//     ]
// }