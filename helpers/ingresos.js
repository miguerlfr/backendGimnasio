import Cliente from "../models/clientes.js";
import Ingreso from "../models/ingresos.js";
import Sede from '../models/sedes.js';

const helpersIngresos = {
    postPutSede: async (sede) => {
        const existe = await Sede.findById(sede);
        
        if (!existe) {
            throw new Error("La sede no existe");
        }
    },
    postPutCliente: async (cliente) => {
        const existe = await Cliente.findById(cliente);
        
        if (!existe) {
            throw new Error("El cliente no existe");
        }
    },
    putId: async (idIngreso, datosActualizados) => {
		// Buscar la ingreso por ID
		const ingresoActual = await Ingreso.findById(idIngreso);
		if (!ingresoActual) {
			throw new Error("Ingreso no encontrada");
		}

		// Imprimir datos actuales y actualizados para depuración
		// console.log("Ingreso Actual:", ingresoActual);
		// console.log("Datos Actualizados:", datosActualizados);

		// Comparar los datos actuales con los datos actualizados
		const datosIguales = Object.keys(datosActualizados).every(key => {
			let valorActual = ingresoActual[key];
			let valorActualizado = datosActualizados[key];

			// Manejar el caso específico de la fecha
			if (key === 'fecha' && valorActual instanceof Date) {
				valorActual = valorActual.toISOString().split('T')[0]; // Eliminar la parte "T00:00:00.000Z"
			}

			if (key === 'fecha' && typeof valorActualizado === 'string') {
				valorActualizado = valorActualizado.split('T')[0]; // Eliminar la parte "T00:00:00.000Z"
			}

			// Convertir valores a cadena para comparación
			const valorActualStr = (valorActual || '').toString();
			const valorActualizadoStr = (valorActualizado || '').toString();

			return valorActualStr === valorActualizadoStr;
		});

		// Imprimir resultado de la comparación
		// console.log("Datos Iguales:", datosIguales);

		if (datosIguales) {
			throw new Error("Ningún cambio proporcionado para editar.");
		}
	}
    // postSedeCliente: async (sede, cliente) => {

    //     // Verificar si ya existe un ingreso registrado para el cliente en la sede
    //     const sedeExistente = await Sede.findOne({ nombre: sede });
    //     const ingresoExistente = await Ingreso.findOne({ sede, cliente });

    //     if (!sedeExistente) {
    //         throw new Error("Sede no existe");
    //     }
    //     // else if (ingresoExistente) {
    //     //     // Comparar los IDs de cliente y sede
    //     //     if (ingresoExistente.cliente.toString() === cliente && ingresoExistente.sede.toString() === sede) {
    //     //         throw new Error( `El ingreso del cliente en la ${sede} ya fue registrado`);
    //     //     }
    //     // }
    // } 
};

export default helpersIngresos;