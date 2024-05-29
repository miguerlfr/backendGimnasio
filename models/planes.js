import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    codigo: { type: String },
    descripcion: { type: String },
    valor: { type: Number },
    dias: { type: Number },
    estado: { type: Number, default: 1 }
});

export default mongoose.model("Plane", planSchema);

// {
//     "codigo": "Plan normal",
//     "descripcion": "Plan normal de un 1 día",
//     "valor": 5000,
//     "dias": 1
// }

// {
//     "codigo": "Plan básico",
//     "descripcion": "Plan básico de un 1 mes",
//     "valor": 100000,
//     "dias": 30
// }

// {
//     "codigo": "Plan medio",
//     "descripcion": "Plan medio de un 3 mes",
//     "valor": 250000,
//     "dias": 90
// }

// {
//     "codigo": "Plan avanzado",
//     "descripcion": "Plan avanzado de un 12 mes",
//     "valor": 1200000,
//     "dias": 365
// }