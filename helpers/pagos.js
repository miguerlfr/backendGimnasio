import Plane from "../models/planes.js";
import Pago from "../models/pagos.js";
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
    },
    putId: async (idPago, datosActualizados) => {
        // Buscar la pago por ID
        const pagoActual = await Pago.findById(idPago);
        if (!pagoActual) {
            throw new Error("Pago no encontrada");
        }

        // Imprimir datos actuales y actualizados para depuración
        // console.log("pago Actual:", pagoActual);
        // console.log("Datos Actualizados:", datosActualizados);

        // Comparar los datos actuales con los datos actualizados
        const datosIguales = Object.keys(datosActualizados).every(key => {
            let valorActual = pagoActual[key];
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

export default helpersPagos;