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
    },
    postPlanQ: async (clienteId, planId) => {
        const cliente = await Cliente.findById(clienteId);
        if (!cliente) {
            throw new Error("El cliente no existe");
        }

        // Verificar si el cliente ya ha realizado algún pago
        const pagosCliente = await Pago.find({ cliente: clienteId });
        const plan = await Plane.findById(planId);

        if (!plan) {
            throw new Error("El plan no existe");
        }

        const diasPlan = plan.dias || 30; // Duración del plan en días (por defecto 30 días)

        if (pagosCliente.length === 0) {
            // Si es el primer pago, verificar que el plan coincida con el plan actual del cliente
            if (cliente.plan.toString() !== planId) {
                throw new Error("El plan seleccionado no es el plan del cliente actualmente.");
            }
        } else {
            // Si no es el primer pago
            if (cliente.plan.toString() !== planId) {
                // Si el plan del pago a añadir es diferente al plan del cliente
                cliente.plan = planId;
            }

            // Si el estado del cliente es 0, cambiarlo a 1
            if (cliente.estado === 0) {
                cliente.estado = 1;
            }

            // Sumar los días del plan a la fecha de vencimiento del cliente
            const nuevaFechaVencimiento = new Date(cliente.fechaVencimiento);
            nuevaFechaVencimiento.setDate(nuevaFechaVencimiento.getDate() + diasPlan);
            cliente.fechaVencimiento = nuevaFechaVencimiento;

            // Guardar los cambios en el cliente
            await cliente.save();
        }
    },
    // putPlanQ: async (clienteId, planId) => {
    //     try {
    //         // Obtener el cliente
    //         const cliente = await Cliente.findById(clienteId);
    //         if (!cliente) {
    //             throw new Error("Cliente no encontrado.");
    //         }
    
    //         // Verificar si el cliente tiene pagos
    //         const pagos = await Pago.find({ cliente: clienteId }).sort({ fecha: 1 });
    //         // Obtener el plan actual del cliente
    //         const planActual = cliente.plan._id.toString();
    
    //         // Verificar si el cliente tiene más de un pago
    //         if (pagos.length > 1) {
    //             throw new Error("No es posible editar el plan del primer pago del cliente por seguridad de datos.");
    //         }
    
    //         // Si el cliente tiene exactamente un pago
    //         if (pagos.length === 1) {
    //             // Comparar el plan del primer pago con el plan del cliente
    //             const primerPago = pagos[0];
                
    //             if (primerPago.plan._id.toString() !== planActual) {
    //                 throw new Error("El plan seleccionado no es el plan del cliente actualmente.");
    //             }
    //         }
    
    //         // Verificar si el planId proporcionado coincide con el plan del cliente
    //         if (planId.toString() !== planActual) {
    //             throw new Error("El plan seleccionado no coincide con el plan actual del cliente.");
    //         }
    
    //         // Si todo está bien, puedes continuar con la actualización del plan
    //         return true;
    //     } catch (error) {
    //         throw new Error(error.message);
    //     }
    // }    
}

export default helpersPagos;