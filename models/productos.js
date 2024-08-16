import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    codigo: { type: String, required: true },
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proveedore",
        required: true,
    },
    descripcion: { type: String },
    valor: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    estado: { type: Number, default: 1 }
});

export default mongoose.model("Producto", productoSchema);

//   {
//       "codigo": "PROD1",
//       "descripcion": "Reloj de pulsera",
//       "valor": 10000,
//       "cantidad": 20
//   }
//   {
//       "codigo": "PROD2",
//       "descripcion": "Camiseta de algodón",
//       "valor": 20000,
//       "cantidad": 40
//   }
//   {
//       "codigo": "PROD3",
//       "descripcion": "Pantalones vaqueros",
//       "valor": 30000,
//       "cantidad": 60
//   }
//   {
//       "codigo": "PROD4",
//       "descripcion": "Zapatillas deportivas",
//       "valor": 40000,
//       "cantidad": 80
//   }
//   {
//       "codigo": "PROD5",
//       "descripcion": "Mochila escolar",
//       "valor": 50000,
//       "cantidad": 100
//   }