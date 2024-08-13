import Compra from "../models/compras.js";

const httpCompras = {
	getCompras: async (req, res) => {
		try {
			const compras = await Compra.find().populate("codigoProducto", "descripcion");
			res.status(200).json(compras);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
	getComprasID: async (req, res) => {
		try {
			const compra = await Compra.findById(req.params.id).populate("codigoProducto", "descripcion");
			if (!compra) return res.status(404).json({ message: "Compra no encontrada" });
			res.status(200).json(compra);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
	getComprasFechas: async (req, res) => {
        try {
            const { fechaInicio, fechaFin } = req.params;
            const fechaInicioObj = new Date(fechaInicio);
            const fechaFinObj = new Date(fechaFin);
            const compras = await Venta.find({
                fecha: { $gte: fechaInicioObj, $lte: fechaFinObj },
            }).populate("codigoProducto", "descripcion");
            res.json({ compras });
			console.log(compras);
        } catch (error) {
			console.log(error);
            res.status(500).json({ error: `Error al listar compras por fechas: ${error.message}` });
        }
    },
	postCompras: async (req, res) => {
		const compra = new Compra(req.body);
		try {
			const newCompra = await compra.save();
			res.status(201).json(newCompra);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	},
	putCompras: async (req, res) => {
		try {
			const updatedCompra = await Compra.findByIdAndUpdate(req.params.id, req.body, { new: true });
			if (!updatedCompra) return res.status(404).json({ message: "Compra no encontrada" });
			res.status(200).json(updatedCompra);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	}
};

export default httpCompras;
