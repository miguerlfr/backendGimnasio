import mongoose from "mongoose";

const mantenimientoSchema = new mongoose.Schema({
    idMaquina: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Maquina",
        required: true,
    },
    fecha: { type: Date, default: Date.now() },
    descripcion: { type: String },
    responsable: { type: String, required: true },
    precio: { type: Number },
    estado: { type: Number, default: 1 }
});

export default mongoose.model("Mantenimiento", mantenimientoSchema);

// Se necesitan crear Maquinas primero

// {
//     "idMaquina": "66515776cfdf1d85c2badde2",
//     "fecha": "2000-05-25T00:00:00.000Z",
//     "descripcion": "Revisión general de la máquina y sustitución de piezas desgastadas.",
//     "responsable": "Jose",
//     "precio": 10000
// }
// {
//     "idMaquina": "66515781cfdf1d85c2badde5",
    // "fecha": "2000-05-26T00:00:00.000Z",
//     "descripcion": "Revisión general de la máquina y sustitución de piezas desgastadas.",
//     "responsable": "Victor",
//     "precio": 20000
// }
// {
//     "idMaquina": "6651578bcfdf1d85c2badde9",
//     "fecha": "2000-05-27T00:00:00.000Z",
//     "descripcion": "Revisión general de la máquina y sustitución de piezas desgastadas.",
//     "responsable": "Miguel",
//     "precio": 3000
// }