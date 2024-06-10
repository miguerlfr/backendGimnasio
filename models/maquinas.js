import mongoose from 'mongoose';

const maquinaSchema = new mongoose.Schema({
    codigo: { type: String, required: true },
    sede: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sede",
        required: true,
    },
    descripcion: { type: String },
    fechaIngreso: { type: Date, required: true },
    fechaUltMan: { type: Date },
    estado: { type: Number, default: 1 }
});

export default mongoose.model('Maquina', maquinaSchema);

// Se necesitan crear Sedes primero

// {
//     "codigo": "MAQ1",
//     "sede": "Sede A",
//     "descripcion": "Máquina de prensa",
//     "fechaIngreso": "2000-01-05T00:00:00.000Z",
//     "fechaUltMan": "2000-05-25T00:00:00.000Z"
// }

// {
//     "codigo": "MAQ2",
//     "sede": "Sede B",
//     "descripcion": "Máquina de banca",
//     "fechaIngreso": "2024-02-10T00:00:00.000Z",
//     "fechaUltMan": "2000-05-25T00:00:00.000Z"
// }

// {
//     "codigo": "MAQ3",
//     "sede": "Sede C",
//     "descripcion": "Máquina de dominadas",
//     "fechaIngreso": "2000-04-20T00:00:00.000Z",
//     "fechaUltMan": "2000-05-25T00:00:00.000Z"
// }