import Cliente from "../models/clientes.js";
import Ingreso from "../models/ingresos.js";
import Sede from '../models/sedes.js';

const helpersIngresos = {
    postPutId: async (cliente) => {
        const existe = await Cliente.findById(cliente);
        
        if (!existe) {
            throw new Error("El cliente no existe");
        }
    },
    postSedeCliente: async (sede, cliente) => {

        // Verificar si ya existe un ingreso registrado para el cliente en la sede
        const sedeExistente = await Sede.findOne({ nombre: sede });
        const ingresoExistente = await Ingreso.findOne({ sede, cliente });

        if (!sedeExistente) {
            throw new Error("Sede no existe");
        }
        // else if (ingresoExistente) {
        //     // Comparar los IDs de cliente y sede
        //     if (ingresoExistente.cliente.toString() === cliente && ingresoExistente.sede.toString() === sede) {
        //         throw new Error( `El ingreso del cliente en la ${sede} ya fue registrado`);
        //     }
        // }
    } 
};

export default helpersIngresos;