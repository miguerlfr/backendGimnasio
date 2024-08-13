import mongoose from "mongoose";

const ingresoSchema = new mongoose.Schema({
    fecha: { type: Date, required: true },
    sede: { type: mongoose.Schema.Types.ObjectId, ref: "Sede", required: true },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: true,
    },
});

export default mongoose.model("Ingreso", ingresoSchema);

// Se necesitan crear Clientes y Sedes primero

// {
//     "fecha": "2024-05-05T00:00:00.000Z",
//     "sede": "id   ",
//     "cliente": "66562188c739fc8e56e9a8ae"
// }
// {
//     "fecha": "2024-05-04T00:00:00.000Z",
//     "sede": "id   ",
//     "cliente": "66562193c739fc8e56e9a8b1"
// }
// {
//     "fecha": "2024-05-03T00:00:00.000Z",
//     "sede": "id   ",
//     "cliente": "6656219cc739fc8e56e9a8b4"
// }
// {
//     "fecha": "2024-05-02T00:00:00.000Z",
//     "sede": "id   ",
//     "cliente": "665621a9c739fc8e56e9a8b7"
// }
// {
//     "fecha": "2024-05-01T00:00:00.000Z",
//     "sede": "id   ",
//     "cliente": "6656386907a520d3afd29b0e"
// }