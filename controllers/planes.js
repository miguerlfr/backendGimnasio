import Plane from "../models/planes.js";

const httpPlanes = {
	getPlanes: async (req, res) => {
		const planes = await Plane.find();
		res.json({ planes });
	},
	getPlanesActivos: async (req, res) => {
		const planes = await Plane.find({ estado: 1 });
		res.json({ planes });
	},
	getPlanesInactivos: async (req, res) => {
		const planes = await Plane.find({ estado: 0 });
		res.json({ planes });
	},
	getPlanesID: async (req, res) => {
		const { id } = req.params;
		const planes = await Plane.findById(id);
		res.json({ planes });
	},
	postPlanes: async (req, res) => {
		try {
			const { codigo, descripcion, valor, dias, estado } = req.body;

			// Crear el objeto Plane con los valores limpiados
			const planes = new Plane({
				codigo,
				descripcion,
				valor: valor.replace(/[^0-9]/g, ''),
				dias: dias.replace(/[^0-9]/g, ''),
				estado
			});
	
			// Guardar el nuevo plan en la base de datos
			await planes.save();
	
			// Enviar respuesta con el plan creado
			res.json({ planes });
	
		} catch (error) {
			// Manejar errores
			console.log("error:", error);
			res.status(400).json({ error: `No se pudo crear el plan ${error.message}` });
		}
	},	
	putPlanes: async (req, res) => {
		try {
			const { id } = req.params;
			const { codigo, descripcion, valor, dias } = req.body;
	
			// Limpiar valor y días
			const valorLimpio = valor ? valor.toString().replace(/[^0-9]/g, '') : '';
			const diasLimpios = dias ? dias.toString().replace(/[^0-9]/g, '') : '';
	
			// Crear objeto de actualización solo con los campos proporcionados y limpiados
			const updateFields = {};
	
			if (codigo) updateFields.codigo = codigo;
			if (descripcion) updateFields.descripcion = descripcion;
			if (valor) updateFields.valor = valorLimpio;
			if (dias) updateFields.dias = diasLimpios;
	
			const updatedPlan = await Plane.findByIdAndUpdate(id, updateFields, { new: true });
	
			if (!updatedPlan) {
				return res.status(404).json({ error: "ID del Plan no encontrado" });
			}
	
			res.json({ plan: updatedPlan });
	
		} catch (error) {
			console.log("error:", error);
			res.status(400).json({ error: `No se pudo editar el plan ${error.message}` });
		}
	},		
	putPlanesActivar: async (req, res) => {
		const { id } = req.params;
		const planes = await Plane.findByIdAndUpdate(id, { estado: 1 }, { new: true });
		res.json({ planes });
	},
	putPlanesInactivar: async (req, res) => {
		const { id } = req.params;
		const planes = await Plane.findByIdAndUpdate(id, { estado: 0 }, { new: true });
		res.json({ planes });
	},
};

export default httpPlanes;
