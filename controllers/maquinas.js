import Maquina from "../models/maquinas.js";

const httpMaquinas = {
	getMaquinas: async (req, res) => {
		const maquinas = await Maquina.find().populate("sede", "nombre");
		res.json({ maquinas });
	},
	getMaquinasActivos: async (req, res) => {
		const maquinas = await Maquina.find({ estado: 1 }).populate("sede", "nombre");
		res.json({ maquinas });
	},
	getMaquinasInactivos: async (req, res) => {
		const maquinas = await Maquina.find({ estado: 0 }).populate("sede", "nombre");
		res.json({ maquinas });
	},
	getMaquinasID: async (req, res) => {
		const { id } = req.params;
		const maquinas = await Maquina.findById(id).populate("sede", "nombre");
		res.json({ maquinas });
	},
	postMaquinas: async (req, res) => {
		try {
			const { codigo, sede, descripcion, fechaIngreso, estado } = req.body;
			const maquinas = new Maquina({
				codigo,
				sede,
				descripcion,
				fechaIngreso,
				estado,
			});
			await maquinas.save();
			res.json({ maquinas });
		} catch (error) {
			res.status(400).json({ error: `No se pudo crear la maquina ${error.message}` });
			console.log("error:", error);
		}
	},
	putMaquinas: async (req, res) => {
		try {
			const { id } = req.params;
			const { codigo, sede, descripcion, fechaIngreso } = req.body;
			try {
				const updateFields = {};

				if (codigo !== undefined) updateFields.codigo = codigo;
				if (sede !== undefined) updateFields.sede = sede;
				if (descripcion !== undefined) updateFields.descripcion = descripcion;
				if (fechaIngreso !== undefined) updateFields.fechaIngreso = fechaIngreso;

				if (Object.keys(updateFields).length === 0) {
					return res.status(400).json({ error: "Ningún campo proporcionado para actualizar." });
				}
				const maquinaActualizada = await Maquina.findByIdAndUpdate(id, updateFields, { new: true });

				if (!maquinaActualizada) {
					return res.status(404).json({ error: "ID de la Máquina no encontrado" });
				}

				res.json({ maquinaActualizada });
			} catch (error) {
				res.status(500).json({ error: "Error al actualizar la máquina" });
			}
		} catch (error) {
			// Manejar errores
			console.log("error:", error);
			res.status(400).json({ error: `No se pudo editar la maquina ${error.message}` });
		}
	},
	putMaquinasActivar: async (req, res) => {
		const { id } = req.params;
		const maquinas = await Maquina.findByIdAndUpdate(id, { estado: 1 }, { new: true });
		res.json({ maquinas });
	},
	putMaquinasInactivar: async (req, res) => {
		const { id } = req.params;
		const maquinas = await Maquina.findByIdAndUpdate(id, { estado: 0 }, { new: true });
		res.json({ maquinas });
	},
};

export default httpMaquinas;
