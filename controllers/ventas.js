import Venta from '../models/ventas.js';

const httpVentas = {
    getVentas: async (req, res) => {
        const ventas = await Venta.find();
        res.json({ ventas });
    },
    getVentasID: async (req, res) => {
        const { id } = req.params;
        const venta = await Venta.findById(id);
        res.json({ venta });
    },
    postVentas: async (req, res) => {
        try {
            const { fecha, codigoProducto, valorUnitario, cantidad, valorTotal } = req.body;
            const venta = new Venta({
                fecha,
                codigoProducto,
                valorUnitario,
                cantidad,
                valorTotal,
            });
            await venta.save();
            res.json({ venta });
        } catch (error) {
            console.log(error.message);
            res.status(400).json({ error: `No se pudo crear la venta ${error.message}` });
        }
    },
    putVentas: async (req, res) => {
        const { id } = req.params;
        const { fecha, codigoProducto, valorUnitario, cantidad, valorTotal } = req.body;
        try {
            const updateData = {};

            if (fecha !== undefined) updateData.fecha = fecha;
            if (codigoProducto !== undefined) updateData.codigoProducto = codigoProducto;
            if (valorUnitario !== undefined) updateData.valorUnitario = valorUnitario;
            if (cantidad !== undefined) updateData.cantidad = cantidad;
            if (valorTotal !== undefined) updateData.valorTotal = valorTotal;

            const ventaActualizada = await Venta.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );

            if (!ventaActualizada) {
                return res.status(404).json({ error: "ID de la Venta no encontrado" });
            }

            res.json({ venta: ventaActualizada });
        } catch (error) {
            res.status(500).json({ error: "Ningún campo proporcionado para actualizar" });
        }
    },
};

export default httpVentas;