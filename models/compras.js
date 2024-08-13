import mongoose from "mongoose";
import Producto from "../models/productos.js";

const compraSchema = new mongoose.Schema({
    codigoProducto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true,
    },
    valorUnitario: { type: Number },
    cantidad: { type: Number, required: true },
    valorTotal: { type: Number }
}, {
    timestamps: true
});

// Middleware para calcular valorTotal antes de guardar
compraSchema.pre('save', async function (next) {
    try {
        // Buscar el producto solo si se ha modificado el código de producto
        if (this.isModified('codigoProducto')) {
            const producto = await Producto.findById(this.codigoProducto);
            if (producto) {
                // Actualizar valorUnitario basado en el producto
                this.valorUnitario = producto.valor;
            } else {
                // Manejar caso en el que el producto no se encuentra
                this.valorUnitario = 0;
            }
        }

        // Calcular valorTotal basado en valorUnitario y cantidad
        this.valorTotal = this.valorUnitario * this.cantidad;

        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model("Compra", compraSchema);

// {
//   "codigoProducto": "PROD1",
//   "cantidad": 2,
// }
// {
//   "codigoProducto": "PROD2",
//   "cantidad": 4,
// }
// {
//   "codigoProducto": "PROD3",
//   "cantidad": 6,
// }
// {
//   "codigoProducto": "PROD4",
//   "cantidad": 8,
// }
// {
//   "codigoProducto": "PROD5",
//   "cantidad": 10,
// }