import Sede from '../models/sedes.js';

const helpersUsuarios = {
    postputID: async (sede) => {
        const sedeExistente = await Sede.findOne({ nombre: sede });
        if (!sedeExistente) {
            throw new Error("Sede no existe");
        }
    },
    postputRol: async (rol) => {
        if (typeof rol !== "string"){
            throw new Error("El Rol debe ser tipo texto");
        } else if (rol !== "Instructor" && rol !== "Administrador" && rol !== "Recepcionista") {
            throw new Error("Rol no existe");
        }
    },
}

export default helpersUsuarios;