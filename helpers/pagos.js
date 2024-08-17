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
		const datosIguales = Object.keys(datosActualizados).every((key) => {
			let valorActual = pagoActual[key];
			let valorActualizado = datosActualizados[key];

			// Manejar el caso específico de la fecha
			if (key === "fecha" && valorActual instanceof Date) {
				valorActual = valorActual.toISOString().split("T")[0]; // Eliminar la parte "T00:00:00.000Z"
			}
			if (key === "fecha" && typeof valorActualizado === "string") {
				valorActualizado = valorActualizado.split("T")[0]; // Eliminar la parte "T00:00:00.000Z"
			}

			// Convertir valores a cadena para comparación
			const valorActualStr = (valorActual || "").toString();
			const valorActualizadoStr = (valorActualizado || "").toString();

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
	putPlan: async (pagoId, nuevoClienteId, nuevoPlanId) => {
		try {
			const pago = await Pago.findById(pagoId).populate('cliente').exec();
			if (!pago) throw new Error('El pago no existe');

			const clienteAnteriorId = pago.cliente._id;
			const planAnteriorId = pago.cliente.plan;
			const planAnterior = await Plane.findById(planAnteriorId).exec();
			const nuevoPlan = await Plane.findById(nuevoPlanId).exec();

			if (!nuevoPlan) throw new Error('El nuevo plan no existe');

			// Si el cliente cambia, actualiza el plan y la fecha de vencimiento
			if (String(clienteAnteriorId) !== String(nuevoClienteId)) {
				const clienteAnterior = await Cliente.findById(clienteAnteriorId).exec();
				const nuevoCliente = await Cliente.findById(nuevoClienteId).exec();

				if (clienteAnterior) {
					// Restar los días del plan anterior de la fecha de vencimiento
					clienteAnterior.fechaVencimiento.setDate(clienteAnterior.fechaVencimiento.getDate() - planAnterior.dias);
					await clienteAnterior.save();
				}

				// Asignar el nuevo plan y sumar los días del nuevo plan a la fecha de vencimiento
				nuevoCliente.plan = nuevoPlanId;
				nuevoCliente.fechaVencimiento.setDate(nuevoCliente.fechaVencimiento.getDate() + nuevoPlan.dias);
				await nuevoCliente.save();

				// Actualizar el cliente en el pago
				pago.cliente = nuevoClienteId;
				await pago.save();
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
};

export default helpersPagos;
