import Maquina from "../models/maquinas.js";
import Sede from '../models/sedes.js';

const helpersMaquinas = {
	postCodigo: async (codigo) => {
		const existe = await Maquina.findOne({ codigo });
		if (!codigo) {
			throw new Error("El código es requerido");
		} else if (existe) {
			throw new Error(`El código ${codigo} ya está en la base de datos, digitar un código diferente por favor`);
		}
	},
	postputID: async (sede) => {
		const sedeExistente = await Sede.findOne({ _id: sede });
		if (!sedeExistente) {
			throw new Error("Sede no existe");
		}
	},
	putCodigo: async (codigo, id) => {
		const codigoUnico = await Maquina.findOne({ codigo, _id: { $ne: id } });
		if (!codigo) {
			throw new Error("El código es requerido");
		} else if (codigoUnico) {
			throw new Error(`El código ${codigo} ya está en la base de datos, digitar un código diferente por favor`);
		}
	},
	putId: async (idMaquina, datosActualizados) => {
        // Buscar la maquina por ID
        const maquinaActual = await Maquina.findById(idMaquina);
        if (!maquinaActual) {
            throw new Error("Maquina no encontrada");
        }

        // Imprimir datos actuales y actualizados para depuración
        // console.log("Maquina Actual:", maquinaActual);
        // console.log("Datos Actualizados:", datosActualizados);

        // Comparar los datos actuales con los datos actualizados
        const datosIguales = Object.keys(datosActualizados).every(key => {
            let valorActual = maquinaActual[key];
            let valorActualizado = datosActualizados[key];

            // Manejar el caso específico de la fechaIngreso
            if (key === 'fechaIngreso' && valorActual instanceof Date) {
                valorActual = valorActual.toISOString().split('T')[0]; // Eliminar la parte "T00:00:00.000Z"
            }

            if (key === 'fechaIngreso' && typeof valorActualizado === 'string') {
                valorActualizado = valorActualizado.split('T')[0]; // Eliminar la parte "T00:00:00.000Z"
            }

			if (key === 'fechaUltMan' && valorActual instanceof Date) {
                valorActual = valorActual.toISOString().split('T')[0]; // Eliminar la parte "T00:00:00.000Z"
            }

            if (key === 'fechaUltMan' && typeof valorActualizado === 'string') {
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

export default helpersMaquinas;