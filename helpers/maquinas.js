import Sede from '../models/sedes.js';

const helpersMaquinas = {
    postputID: async (sede) => {
        const sedeExistente = await Sede.findOne({ nombre: sede });
        if (!sedeExistente) {
            throw new Error("Sede no existe");
        }
    }
}

export default helpersMaquinas;