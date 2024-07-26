import Mantenimiento from "../models/mantenimientos.js";
import Maquina from '../models/maquinas.js';

const helpersMantenimientos = {
    postPutMaquina: async (idMaquina) => {
        const maquina = await Maquina.findById(idMaquina)
        if (!maquina) {
            throw new Error("El id de la máquina no se encuentra");
        }
    },
    putId: async (idMantenimiento, datosActualizados) => {
		// Buscar la mantenimiento por ID
		const mantenimientoActual = await Mantenimiento.findById(idMantenimiento);
		if (!mantenimientoActual) {
			throw new Error("Mantenimiento no encontrada");
		}

		// Imprimir datos actuales y actualizados para depuración
		// console.log("Mantenimiento Actual:", mantenimientoActual);
		// console.log("Datos Actualizados:", datosActualizados);

		// Comparar los datos actuales con los datos actualizados
		const datosIguales = Object.keys(datosActualizados).every(key => {
			let valorActual = mantenimientoActual[key];
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
}

export default helpersMantenimientos;