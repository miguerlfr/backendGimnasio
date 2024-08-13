import Producto from "../models/productos.js";
import Venta from "../models/ventas.js";

const httpVentas = {
	getVentas: async (req, res) => {
		const ventas = await Venta.find().populate("codigoProducto", "descripcion");
		res.json({ ventas });
	},
	getVentasID: async (req, res) => {
		const { id } = req.params;
		const venta = await Venta.findById(id).populate("codigoProducto", "descripcion");
		res.json({ venta });
	},
	getVentasFechas: async (req, res) => {
        try {
            const { fechaInicio, fechaFin } = req.params;
            const fechaInicioObj = new Date(fechaInicio);
            const fechaFinObj = new Date(fechaFin);
            const ventas = await Venta.find({
                fecha: { $gte: fechaInicioObj, $lte: fechaFinObj },
            }).populate("codigoProducto", "descripcion");
            res.json({ ventas });
			console.log(ventas);
        } catch (error) {
			console.log(error);
            res.status(500).json({ error: `Error al listar ventas por fechas: ${error.message}` });
        }
    },
	postVentas: async (req, res) => {
		try {
			const { codigoProducto, valorUnitario, cantidad, valorTotal } = req.body;
			
			const venta = new Venta({
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
		try {
			const { id } = req.params;
			const { codigoProducto, valorUnitario, cantidad, valorTotal } = req.body;
			try {
				const updateFields = {
					...(codigoProducto && { codigoProducto }),
					...(valorUnitario && { valorUnitario }),
					...(cantidad && { cantidad }),
					...(valorTotal && { valorTotal }),
				};

				if (Object.keys(updateFields).length === 0) {
					return res.status(400).json({ error: "Ningún campo proporcionado para actualizar." });
				}
				const ventaActualizada = await Venta.findByIdAndUpdate(id, updateFields, { new: true });
				if (!ventaActualizada) {
					return res.status(404).json({ error: "ID del Venta no encontrado" });
				}
				res.json({ venta: ventaActualizada });

			} catch (error) {
				res.status(500).json({ error: `Ningún campo proporcionado para actualizar, ${error.message}` });
			}

		} catch (error) {
			console.log("error:", error);
			res.status(400).json({ error: `No se pudo editar la venta ${error.message}` });
		}
	},
};

export default httpVentas;