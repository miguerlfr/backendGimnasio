import Maquina from '../models/maquinas.js';

const helpersMantenimientos = {
    postPutMaquina: async (idMaquina) => {
        const maquina = await Maquina.findById(idMaquina)
        if (!maquina) {
            throw new Error("El id de la máquina no se encuentra");
        }
    }
}

export default helpersMantenimientos;