import Plane from "../models/planes.js";
import Cliente from "../models/clientes.js";

const helpersPagos = {
    postPutId: async (cliente) => {
        const existe = await Cliente.findById(cliente);
        
        if (!existe) {
            throw new Error("El cliente no existe");
        }
    },
    postPutPlan: async (plan) => {
		const existe = await Plane.findOne({ plan });
		if (existe.length === 0) throw new Error("Plan no existe.");
    }
}

export default helpersPagos;