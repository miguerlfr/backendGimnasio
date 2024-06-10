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
//     "codigo": "Plan01",
//     "descripcion": "Plan normal (1 día)",
//     "valor": 5000,
//     "dias": 1
// }

// {
//     "codigo": "Plan02",
//     "descripcion": "Plan básico (1 mes)",
//     "valor": 100000,
//     "dias": 30
// }

// {
//     "codigo": "Plan03",
//     "descripcion": "Plan medio (3 meses)",
//     "valor": 250000,
//     "dias": 90
// }

// {
//     "codigo": "Plan03",
//     "descripcion": "Plan avanzado (12 mes)",
//     "valor": 1200000,
//     "dias": 365
// }