import Ingreso from "../models/ingresos.js";

const httpIngresos = {
	getIngresos: async (req, res) => {
		try {
			const ingresos = await Ingreso.find().populate("sede", "nombre").populate("cliente", "nombre");
			res.json({ ingresos });
		} catch (error) {
			res.status(500).json({ error: "Error al obtener los ingresos" });
		}
	},
	getIngresosID: async (req, res) => {
		try {
			const { id } = req.params;
			const ingreso = await Ingreso.findById(id).populate("sede", "nombre").populate("cliente", "nombre");
			if (!ingreso) {
				return res.status(404).json({ error: "Ingreso no encontrado" });
			}
			res.json({ ingreso });
		} catch (error) {
			res.status(500).json({ error: "Error al obtener el ingreso" });
		}
	},
	getIngresosFechas: async (req, res) => {
		try {
			const { fechaInicio, fechaFin } = req.params;
			const fechaInicioObj = new Date(fechaInicio);
			const fechaFinObj = new Date(fechaFin);
			const ingresos = await Ingreso.find({
				fecha: { $gte: fechaInicioObj, $lte: fechaFinObj },
			}).populate("codigoProducto", "descripcion");
			res.json({ ingresos });
			console.log(ingresos);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: `Error al listar ingresos por fechas: ${error.message}` });
		}
	},
	postIngresos: async (req, res) => {
		try {
			const { fecha, sede, cliente } = req.body;
			const ingreso = new Ingreso({
				fecha: new Date(fecha),
				sede,
				cliente: cliente,
			});

			await ingreso.save()
			res.json({ ingreso });

		} catch (error) {
			res.status(500).json({ error: `Error al crear los ingresos: ${error.message}` });
		}
	},
	putIngresos: async (req, res) => {
		try {
			const { id } = req.params;
			const { fecha, sede, cliente } = req.body
			const ingresoActualizado = await Ingreso.findByIdAndUpdate(id, { fecha, sede, cliente }, { new: true });

			if (!ingresoActualizado) {
				return res.status(404).json({ error: "ID del Ingreso no encontrado" });
			}
			res.json({ ingreso: ingresoActualizado });
		} catch (error) {
			// Manejar errores
			console.log("error:", error);
			res.status(400).json({ error: `No se pudo editar el ingreso ${error.message}` });
		}
	},
};

export default httpIngresos;
