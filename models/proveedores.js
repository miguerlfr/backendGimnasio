import mongoose from "mongoose";

const proveedorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    telefono: { type: Number, required: true },
    productos: { type: String },
    notas: { type: String, required: true },
    estado: { type: Number, default: 1 }
}, {
    timestamps: true
});

export default mongoose.model("Proveedore", proveedorSchema);

// [
// {
//     "nombre": "Mike",
//     "telefono": 1234567890,
//     "productos": [""],
//     "notas": "Amigo de natalia"
// },
// {
//     "nombre": "Lucy",
//     "telefono": 2345678901,
//     "productos": ["", ""],
//     "notas": "cerca de mindy"
// },
// {
//     "nombre": "Jose",
//     "telefono": 3456789012,
//     "productos": [""],
//     "notas": "muy friki"
// },
// {
//     "nombre": "Jhon",
//     "telefono": 4567890123,
//     "productos": ["", ""],
//     "notas": "me cae gordo"
// },
// {
//     "nombre": "Maria",
//     "telefono": 5678901234,
//     "productos": [""],
//     "notas": "La buena pa maria"
// }
// ]