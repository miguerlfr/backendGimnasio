import Mantenimiento from "../models/mantenimientos.js";

const httpMantenimientos = {
	getMantenimientos: async (req, res) => {
		try {
			const mantenimientos = await Mantenimiento.find().populate("idMaquina", "descripcion");
			res.json({ mantenimientos });
		} catch (error) {
			res.status(500).json(`Error al listar mantenimientos: ${error.message}`);
		}
	},
	getMantenimientosActivos: async (req, res) => {
		try {
			const mantenimientos = await Mantenimiento.find({ estado: 1 }).populate("idMaquina", "descripcion");
			res.json({ mantenimientos });
		} catch (error) {
			res.status(500).json(`Error al listar mantenimientos activos: ${error.message}`);
		}
	},
	getMantenimientosInactivos: async (req, res) => {
		try {
			const mantenimientos = await Mantenimiento.find({ estado: 0 }).populate("idMaquina", "descripcion");
			res.json({ mantenimientos });
		} catch (error) {
			res.status(500).json(`Error al listar mantenimientos: ${error.message}`);
		}
	},
	getMantenimientosFechas: async (req, res) => {
		try {
			const { fechaInicio, fechaFin } = req.params;
			const fechaInicioObj = new Date(fechaInicio);
			const fechaFinObj = new Date(fechaFin);

			// Obtener los mantenimientos dentro del rango de fechas
			const mantenimientos = await Mantenimiento.find({
				fecha: { $gte: fechaInicioObj, $lte: fechaFinObj },
			}).populate("idMaquina", "descripcion");

			res.json({ mantenimientos });
		} catch (error) {
			res.status(500).json({ error: "Error al obtener mantenimientos por fechas" });
		}
	},
	getMantenimientosID: async (req, res) => {
		const { id } = req.params;
		const mantenimiento = await Mantenimiento.findById(id).populate("idMaquina", "descripcion");
		res.json({ mantenimiento });
	},
	postMantenimientos: async (req, res) => {
		try {
			const { idMaquina, fecha, descripcion, responsable, precio, estado } = req.body;
			const mantenimiento = new Mantenimiento({
				idMaquina,
				fecha,
				descripcion,
				responsable,
				precio: precio.replace(/[^0-9]/g, ''),
				estado,
			});
			await mantenimiento.save();
			res.json({ mantenimiento });
		} catch (error) {
			res.status(500).json({ error: `Error al crear los mantenimientos: ${error.message}` });
		}
	},
	putMantenimientos: async (req, res) => {
		try {
			const { idMaquina, fecha, descripcion, responsable, precio } = req.body;
			const { id } = req.params;

			if (!id) {
				return res.status(400).json({ error: "ID del Mantenimiento no proporcionado" });
			}

			// Limpiar el precio
			const precioLimpio = precio.toString().replace(/[^0-9]/g, '');

			const mantenimientoActualizado = await Mantenimiento.findByIdAndUpdate(id, { idMaquina, fecha, descripcion, responsable, precio: precioLimpio }, { new: true });
			if (!mantenimientoActualizado) {
				return res.status(404).json({ error: "ID del Mantenimiento no encontrado" });
			}

			res.json({ mantenimiento: mantenimientoActualizado });
		} catch (error) {
			// Manejar errores
			console.log("error:", error);
			res.status(400).json({ error: `No se pudo editar el mantenimiento ${error.message}` });
		}
	},
	putMantenimientosActivar: async (req, res) => {
		const { id } = req.params;
		const mantenimientos = await Mantenimiento.findByIdAndUpdate(id, { estado: 1 }, { new: true });
		res.json({ mantenimientos });
	},
	putMantenimientosInactivar: async (req, res) => {
		const { id } = req.params;
		const mantenimientos = await Mantenimiento.findByIdAndUpdate(id, { estado: 0 }, { new: true });
		res.json({ mantenimientos });
	},
};

export default httpMantenimientos;
