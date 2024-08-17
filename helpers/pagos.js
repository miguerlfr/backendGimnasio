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
		try {
			const cliente = await Cliente.findById(clienteId);
			if (!cliente) {
				throw new Error("El cliente no existe");
			}
	
			const plan = await Plane.findById(planId);
			if (!plan) {
				throw new Error("El plan no existe");
			}
	
			const diasPlan = plan.dias || 30; // Duración del plan en días (por defecto 30 días)
			const pagosCliente = await Pago.find({ cliente: clienteId });
	
			if (pagosCliente.length === 0) {
				// Primer pago
				if (cliente.plan.toString() !== planId) {
					cliente.plan = planId;
	
					if (cliente.fechaIngreso) {
						cliente.fechaVencimiento = new Date(cliente.fechaIngreso);
						if (plan.dias >= 365) {
							// Si el plan es de un año o más, establecer la fecha de vencimiento al final del año
							cliente.fechaVencimiento = new Date(cliente.fechaIngreso);
							cliente.fechaVencimiento.setFullYear(cliente.fechaIngreso.getFullYear() + 1);
							cliente.fechaVencimiento.setDate(cliente.fechaVencimiento.getDate() - 1); // El último día del año
						} else {
							// Para otros planes, añade los días
							cliente.fechaVencimiento.setDate(cliente.fechaVencimiento.getDate() + diasPlan - 1);
						}
					}
				}
			} else {
				// Pagos posteriores
				if (cliente.plan.toString() !== planId) {
					cliente.plan = planId;
				}
	
				// Si el estado del cliente es 0, cambiarlo a 1
				if (cliente.estado === 0) {
					cliente.estado = 1;
				}
	
				// Sumar los días del plan a la fecha de vencimiento del cliente
				if (cliente.fechaVencimiento) {
					const nuevaFechaVencimiento = new Date(cliente.fechaVencimiento);
					nuevaFechaVencimiento.setDate(nuevaFechaVencimiento.getDate() + diasPlan);
					cliente.fechaVencimiento = nuevaFechaVencimiento;
				} else if (cliente.fechaIngreso) {
					cliente.fechaVencimiento = new Date(cliente.fechaIngreso);
					if (plan.dias >= 365) {
						// Si el plan es de un año o más, establecer la fecha de vencimiento al final del año
						cliente.fechaVencimiento.setFullYear(cliente.fechaIngreso.getFullYear() + 1);
						cliente.fechaVencimiento.setDate(cliente.fechaVencimiento.getDate() - 1); // El último día del año
					} else {
						// Para otros planes, añade los días
						cliente.fechaVencimiento.setDate(cliente.fechaVencimiento.getDate() + diasPlan - 1);
					}
				}
			}
	
			// Guardar los cambios en el cliente
			await cliente.save();
	
			return cliente; // Devuelve el cliente actualizado si es necesario
		} catch (error) {
			console.error("Error en postPlanQ:", error);
			throw new Error(`No se pudo procesar el plan: ${error.message}`);
		}
	},	
	putPlan: async (pagoId, nuevoClienteId, nuevoPlanId) => {
		try {
		  const pago = await Pago.findById(pagoId).populate('cliente').exec();
		  if (!pago) throw new Error('El pago no existe');
	  
		  const cliente = await Cliente.findById(nuevoClienteId).exec();
		  const nuevoPlan = await Plane.findById(nuevoPlanId).exec();
	  
		  if (!cliente) throw new Error('El cliente no existe');
		  if (!nuevoPlan) throw new Error('El nuevo plan no existe');
	  
		  // Si el cliente tiene una fecha de vencimiento actual, sumamos los días del nuevo plan
		  if (cliente.fechaVencimiento) {
			const fechaVencimientoActual = new Date(cliente.fechaVencimiento);
			fechaVencimientoActual.setDate(fechaVencimientoActual.getDate() + (nuevoPlan.dias || 30));
			cliente.fechaVencimiento = fechaVencimientoActual;
		  } else {
			// Si es el primer pago del clinte, y se esta modificando, calcularla basada en la fecha de ingreso
			const fechaIngreso = new Date(cliente.fechaIngreso);
			fechaIngreso.setDate(fechaIngreso.getDate() + (nuevoPlan.dias || 30) - 1);
			cliente.fechaVencimiento = fechaIngreso;
		  }
	  
		  // Actualizar el plan del cliente al nuevo plan
		  cliente.plan = nuevoPlanId;
	  
		  // Guardar los cambios en el cliente
		  await cliente.save();
	  
		  // Actualizar el cliente en el pago
		  pago.cliente = nuevoClienteId;
		  await pago.save();
		} catch (error) {
		  throw new Error(error.message);
		}
	  }	  
};

export default helpersPagos;
