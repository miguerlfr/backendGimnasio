import mongoose from "mongoose";

const pagoSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: true,
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plane",
        required: true,
    },
    fecha: { type: Date, required: true },
    valor: { type: Number, required: true },
    estado: { type: Number, default: 1 }
});

export default mongoose.model("Pago", pagoSchema);

// Se necesitan crear Clientes y Planes primero

// {
//     "cliente": "66562188c739fc8e56e9a8ae",
//     "plan": "Plan básico",
//     "fecha": "2024-01-01T00:00:00.000Z",
//     "valor": 100000
// }

// {
//     "cliente": "66562193c739fc8e56e9a8b1",
//     "plan": "Plan medio",
//     "fecha": "2024-01-02T00:00:00.000Z",
//     "valor": 250000
// }

// {
//     "cliente": "6656219cc739fc8e56e9a8b4",
//     "plan": "Plan avanzado",
//     "fecha": "2024-01-03T00:00:00.000Z",
//     "valor": 1200000
// }