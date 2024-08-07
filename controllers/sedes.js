import Sede from "../models/sedes.js";

const httpSedes = {
	getSedes: async (req, res) => {
		const sedes = await Sede.find();
		res.json({ sedes });
	},
	getSedesActivos: async (req, res) => {
		const sedes = await Sede.find({ estado: 1 });
		res.json({ sedes });
	},
	getSedesInactivos: async (req, res) => {
		const sedes = await Sede.find({ estado: 0 });
		res.json({ sedes });
	},
	getSedesID: async (req, res) => {
		const { id } = req.params;
		const sedes = await Sede.findById(id);
		res.json({ sedes });
	},
	postSedes: async (req, res) => {
		try {
			const { nombre, direccion, codigo, horario, ciudad, telefono, estado } = req.body;
			const sede = new Sede({
				nombre,
				direccion,
				codigo,
				horario,
				ciudad,
				telefono,
				estado,
			});
			await sede.save();
			res.json({ sede });
		} catch (error) {
			// Manejar errores
			console.log("error:", error);
			res.status(400).json({ error: `No se pudo crear la sede ${error.message}` });
		}
	},
	putSedes: async (req, res) => {
		try {
			const { id } = req.params;
			const { nombre, direccion, codigo, horario, ciudad, telefono } = req.body;

			const updateData = {};

			if (nombre !== undefined) updateData.nombre = nombre;
			if (direccion !== undefined) updateData.direccion = direccion;
			if (codigo !== undefined) updateData.codigo = codigo;
			if (horario !== undefined) updateData.horario = horario;
			if (ciudad !== undefined) updateData.ciudad = ciudad;
			if (telefono !== undefined) updateData.telefono = telefono;

			if (Object.keys(updateData).length === 0) {
				return res.status(400).json({ error: "Ningún campo proporcionado para actualizar." });
			}

			const sedeActualizada = await Sede.findByIdAndUpdate(id, updateData, { new: true });
			res.json({ sede: sedeActualizada });
		} catch (error) {
			// Manejar errores
			console.log("error:", error);
			res.status(400).json({ error: `No se pudo editar la sede ${error.message}` });
		}
	},
	putSedesActivar: async (req, res) => {
		const { id } = req.params;
		const sede = await Sede.findByIdAndUpdate(id, { estado: 1 }, { new: true });
		res.json({ sede });
	},
	putSedesInactivar: async (req, res) => {
		const { id } = req.params;
		const sede = await Sede.findByIdAndUpdate(id, { estado: 0 }, { new: true });
		res.json({ sede });
	},
};

export default httpSedes;
