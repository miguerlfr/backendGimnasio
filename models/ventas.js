import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema({
    fecha: { type: Date },
    codigoProducto: { type: String, required: true },
    valorUnitario: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    valorTotal: { type: Number, required: true },
});

export default mongoose.model("Venta", ventaSchema);

// import mongoose from "mongoose"
// const compraSchema = new mongoose.Schema({
//     nombre: { type: String, required: true }
// })


// Se necesitan crear Productos primero

// {
//   "fecha": "2024-05-01T00:00:00.000Z",
//   "codigoProducto": "PROD1",
//   "valorUnitario": 10000,
//   "cantidad": 2,
//   "valorTotal": 20000
// }

// {
//   "fecha": "2024-05-02T00:00:00.000Z",
//   "codigoProducto": "PROD2",
//   "valorUnitario": 20000,
//   "cantidad": 4,
//   "valorTotal": 80000
// }

// {
//   "fecha": "2024-05-03T00:00:00.000Z",
//   "codigoProducto": "PROD3",
//   "valorUnitario": 30000,
//   "cantidad": 6,
//   "valorTotal": 180000
// }

// {
//   "fecha": "2024-05-04T00:00:00.000Z",
//   "codigoProducto": "PROD4",
//   "valorUnitario": 40000,
//   "cantidad": 8,
//   "valorTotal": 320000
// }

// {
//   "fecha": "2024-05-05T00:00:00.000Z",
//   "codigoProducto": "PROD5",
//   "valorUnitario": 50000,
//   "cantidad": 10,
//   "valorTotal": 500000
// }