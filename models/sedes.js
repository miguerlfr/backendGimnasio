import mongoose from "mongoose";

const sedeSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: { type: String },
    codigo: { type: Number, required: true }, // nose si es number realmente
    horario: { type: String },
    ciudad: { type: String },
    telefono: { type: Number },
    estado: { type: Number, default: 1 },
});

export default mongoose.model("Sede", sedeSchema);

//   {
//       "nombre": "Sede A",
//       "direccion": "123 Avenida Principal",
//       "codigo": 1,
//       "horario": "9:00 - 18:00",
//       "ciudad": "San Gil",
//       "telefono": 1234567890,
//       "estado": 1
//   }

//   {
//       "nombre": "Sede B",
//       "direccion": "456 Calle 12",
//       "codigo": 2,
//       "horario": "10:00 - 17:00",
//       "ciudad": "New York",
//       "telefono": 9876543210,
//       "estado": 1
//   }

//   {
//       "nombre": "Sede C",
//       "direccion": "789 Carretera 13",
//       "codigo": 3,
//       "horario": "8:00 - 16:00",
//       "ciudad": "Bucaramanga",
//       "telefono": 5555555555,
//       "estado": 0
//   }