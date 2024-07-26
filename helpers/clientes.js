import Cliente from "../models/clientes.js";

const helpersClientes = {
	getFechaCumpleaños: async (fecha) => {
		const existe = await Cliente.findOne({ fecha });
		if (existe.length === 0) throw new Error("Fecha de cumpleaños no existe.");
	},
	getClientesIngresaron: async (fecha) => {
		const clientesCantidad = await Cliente.countDocuments({
			fechaIngreso: new Date(fecha),
		});
		if (clientesCantidad === 0) throw new Error(`No hay clientes que ingresaron en esa fecha`);
	},
	postDocumento: async (documento) => {
		const existe = await Cliente.findOne({ documento });
		if (!documento) {
			throw new Error("El documento es requerido");
		} else if (existe) {
			throw new Error(`El documento ${documento} ya está en la base de datos, digitar un documento diferente por favor`);
		}
	},
	putDocumento: async (documento, id) => {
		const documentoUnico = await Cliente.findOne({ documento, _id: { $ne: id } });
		if (!documento) {
			throw new Error("El documento es requerido");
		} else if (documentoUnico) {
			throw new Error(`El documento ${documento} ya está en la base de datos, digitar un documento diferente por favor`);
		}
	},
	putId: async (idCliente, datosActualizados) => {
		// Buscar el cliente por ID
		const clienteActual = await Cliente.findById(idCliente);
		if (!clienteActual) {
			throw new Error("Cliente no encontrado");
		}

		// Imprimir datos actuales y actualizados para depuración
		// console.log("Cliente Actual:", clienteActual);
		// console.log("Datos Actualizados:", datosActualizados);

		let datosIguales = true;
		const diferencias = {};

		// Comparar datos actuales con datos actualizados
		for (const key of Object.keys(datosActualizados)) {
			let valorActual = clienteActual[key];
			let valorActualizado = datosActualizados[key];

			// Manejar el caso específico de fechas
			if (['fechaIngreso', 'fechaNacimiento', 'fechaVencimiento', 'seguimiento.fecha'].includes(key)) {
				valorActual = valorActual instanceof Date ? valorActual.toISOString().split('T')[0] : valorActual;
				valorActualizado = typeof valorActualizado === 'string' ? valorActualizado : new Date(valorActualizado).toISOString().split('T')[0];
			}

			// Manejar el caso del arreglo seguimiento
			if (key === 'seguimiento') {
				if (Array.isArray(valorActual) && Array.isArray(valorActualizado)) {
					if (valorActual.length !== valorActualizado.length) {
						datosIguales = false;
						diferencias[key] = { valorActual, valorActualizado };
						continue;
					}

					valorActual.forEach((item, index) => {
						const itemActualizado = valorActualizado[index];
						for (const innerKey of Object.keys(item)) {
							let valorItemActual = item[innerKey];
							let valorItemActualizado = itemActualizado[innerKey];

							if (innerKey === 'fecha') {
								valorItemActual = valorItemActual instanceof Date ? valorItemActual.toISOString().split('T')[0] : valorItemActual;
								valorItemActualizado = typeof valorItemActualizado === 'string' ? valorItemActualizado : new Date(valorItemActualizado).toISOString().split('T')[0];
							}

							const valorItemActualStr = (valorItemActual || '').toString();
							const valorItemActualizadoStr = (valorItemActualizado || '').toString();

							if (valorItemActualStr !== valorItemActualizadoStr) {
								datosIguales = false;
								if (!diferencias[key]) diferencias[key] = [];
								diferencias[key].push({ index, innerKey, valorItemActual, valorItemActualizado });
							}
						}
					});
					continue;
				}

				datosIguales = false;
				diferencias[key] = { valorActual, valorActualizado };
				continue;
			}

			// Comparar valores simples
			const valorActualStr = (valorActual || '').toString();
			const valorActualizadoStr = (valorActualizado || '').toString();

			if (valorActualStr !== valorActualizadoStr) {
				datosIguales = false;
				diferencias[key] = { valorActual, valorActualizado };
			}
		}

		// Diferencias permitidas
		const diferenciasPermitidas = [
			'__parentArray',
			'$__parent',
			'$__',
			'_doc'
		];

		// Verificar si solo hay diferencias permitidas en seguimiento
		const diferenciasPermitidasEncontradas = diferencias.seguimiento?.filter(dif => diferenciasPermitidas.includes(dif.innerKey)) || [];

		// Verificar si todas las diferencias encontradas en seguimiento son permitidas
		const soloDiferenciasPermitidas = diferencias.seguimiento && diferencias.seguimiento.length === diferenciasPermitidasEncontradas.length;

		// Verificar si hay diferencias adicionales en otros campos, como 'nombre'
		const hayDiferenciasAdicionales = Object.keys(diferencias).some(key => key !== 'seguimiento' && Object.keys(diferencias[key]).length > 0);

		// Imprimir resultado de la comparación y diferencias
		// console.log("Datos Iguales:", datosIguales);
		// console.log("Diferencias encontradas:", diferencias);

		if (!datosIguales) {
			// Si hay diferencias adicionales fuera de 'seguimiento', generamos error
			if (!hayDiferenciasAdicionales) {
				console.log("Ningún cambio proporcionado para editar.");
				throw new Error("Ningún cambio proporcionado para editar.");
			} else if (!soloDiferenciasPermitidas) {
				// Si solo hay diferencias en 'seguimiento' que no están permitidas, generamos error
				// console.log("Ningún cambio proporcionado para editar.");
				throw new Error("Ningún cambio proporcionado para editar.");
			}
		} else {
			console.log("Cliente actualizado exitosamente");
			// Actualizar el cliente si los datos son diferentes
			await Cliente.findByIdAndUpdate(idCliente, datosActualizados, { new: true });
		}
	}
};

export default helpersClientes;