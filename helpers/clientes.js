import Cliente from "../models/clientes.js";
import Plane from "../models/planes.js"

const helpersClientes = {
	getPlan: async (plan) => {
		const existe = await Plane.findOne({ plan });
		if (existe.length === 0) throw new Error("Plan no existe.");
	},
	getFechaCumpleaños: async (fecha) => {
		const existe = await Cliente.findOne({ fecha });
		if (existe.length === 0) throw new Error("Fecha de cumpleaños no existe.");
	},
	getClientesIngresaron: async (fecha) => {
		const clientesCantidad = await Cliente.countDocuments({
			fechaIngreso: new Date(fecha),
		});
		if (clientesCantidad === 0) throw new Error(`No hay clientes que ingresaron en esa fecha`);
	},
	postDocumento: async (documento) => {
		const existe = await Cliente.findOne({ documento });
		if (!documento) {
			throw new Error("El documento es requerido");
		} else if (typeof documento !== "number" || isNaN(documento)) {
			throw new Error("El documento debe ser un número");
		} else if (existe) {
			throw new Error(`El documento ${documento} ya está en la base de datos, digitar un documento diferente por favor`);
		}
	},
	putDocumento: async (documento) => {
		const existe = await Cliente.findOne({ documento });
		if (!documento) {
			throw new Error("El documento es requerido");
		} else if (typeof documento !== "number" || isNaN(documento)) {
			throw new Error("El documento debe ser un número");
		}
	}
};

export default helpersClientes;