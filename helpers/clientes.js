import Cliente from "../models/clientes.js";
import mongoose from "mongoose";
let ObjectId = mongoose.Types.ObjectId

let helpersClientes = {
	getFechaCumpleaños: async (fecha) => {
		let existe = await Cliente.findOne({ fecha });
		if (existe.length === 0) throw new Error("Fecha de cumpleaños no existe.");
	},
	getClientesIngresaron: async (fecha) => {
		let clientesCantidad = await Cliente.countDocuments({
			fechaIngreso: new Date(fecha),
		});
		if (clientesCantidad === 0) throw new Error(`No hay clientes que ingresaron en esa fecha`);
	},
	postDocumento: async (documento) => {
		let existe = await Cliente.findOne({ documento });
		if (!documento) {
			throw new Error("El documento es requerido");
		} else if (existe) {
			throw new Error(`El documento ${documento} ya está en la base de datos, digitar un documento diferente por favor`);
		}
	},
	putDocumento: async (documento, id) => {
		let documentoUnico = await Cliente.findOne({ documento, _id: { $ne: id } });
		if (!documento) {
			throw new Error("El documento es requerido");
		} else if (documentoUnico) {
			throw new Error(`El documento ${documento} ya está en la base de datos, digitar un documento diferente por favor`);
		}
	},
	putId: async (idCliente, datosActualizados) => {
		const clienteActual = await Cliente.findById(idCliente);
		if (!clienteActual) {
			throw new Error("Cliente no encontrado");
		}

		console.log("Cliente Actual Completo:", JSON.stringify(clienteActual, null, 2));
		console.log("Datos Actualizados:", JSON.stringify(datosActualizados, null, 2));

		const normalizarFecha = (fecha) => {
			if (!fecha) return null;

			let date;
			if (typeof fecha === 'string') {
				date = new Date(fecha);
			} else if (fecha instanceof Date) {
				date = fecha;
			} else {
				date = new Date(fecha);
			}

			if (isNaN(date.getTime())) {
				console.error(`Fecha no válida: ${fecha}`);
				return null;
			}

			// Obtener año, mes y día en formato YYYY-MM-DD
			const año = date.getUTCFullYear().toString().padStart(4, '0'); // Año con 4 dígitos
			const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
			const día = date.getUTCDate().toString().padStart(2, '0');

			return `${año}-${mes}-${día}`;
		};

		const simplificarSeguimiento = (seguimiento) => seguimiento.map(item => ({
			fecha: normalizarFecha(item.fecha),
			peso: item.peso !== undefined ? item.peso.toString() : '',
			imc: item.imc !== undefined ? item.imc.toString() : '',
			estadoIMC: item.estadoIMC,
			brazo: item.brazo !== undefined ? item.brazo.toString() : '',
			pierna: item.pierna !== undefined ? item.pierna.toString() : '',
			cintura: item.cintura !== undefined ? item.cintura.toString() : '',
			estatura: item.estatura !== undefined ? item.estatura.toString() : ''
		}));

		const seguimientoActual = simplificarSeguimiento(clienteActual.seguimiento);
		const seguimientoActualizado = datosActualizados.seguimiento ? simplificarSeguimiento(datosActualizados.seguimiento) : [];

		console.log("Seguimiento Actual Simplificado:", seguimientoActual);
		console.log("Nuevo Seguimiento Simplificado:", seguimientoActualizado);

		const normalizarFechasEnObjeto = (obj) => {
			Object.keys(obj).forEach(key => {
				if (key.includes('fecha')) {
					obj[key] = normalizarFecha(obj[key]);
				}
				if (Array.isArray(obj[key])) {
					obj[key] = obj[key].map(item => {
						if (item.fecha) {
							item.fecha = normalizarFecha(item.fecha);
						}
						return item;
					});
				}
			});
		};

		// Normalizar fechas en ambos objetos
		normalizarFechasEnObjeto(clienteActual._doc);
		normalizarFechasEnObjeto(datosActualizados);

		const encontrarDiferencias = (obj1, obj2) => {
			const diferencias = {};
			Object.keys(obj1).forEach(key => {
				if (['_id', 'estado', '__v'].includes(key)) {
					return;
				}
				if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
					const diffs = encontrarDiferencias(obj1[key][0], obj2[key][0]);
					if (Object.keys(diffs).length > 0) {
						diferencias[key] = diffs;
					}
				} else {
					const valorActual = obj1[key];
					const valorActualizado = obj2[key];
					const valorActualNormalizado = key.includes('fecha') ? normalizarFecha(valorActual) : valorActual;
					const valorActualizadoNormalizado = key.includes('fecha') ? normalizarFecha(valorActualizado) : valorActualizado;

					if (valorActualNormalizado !== valorActualizadoNormalizado) {
						if (obj1[key] instanceof ObjectId && obj2[key] === obj1[key].toString()) {
							return;
						}
						diferencias[key] = { valorActual: valorActualNormalizado, valorActualizado: valorActualizadoNormalizado };
					}
				}
			});
			return diferencias;
		};

		const diferencias = encontrarDiferencias(clienteActual.toObject(), datosActualizados);
		console.log('Diferencias encontradas:', diferencias);

		const cambiosEnCamposClaveSeguimiento = Object.values(diferencias).some(dif => {
			if (typeof dif === 'object' && dif !== null) {
				const hayCambio = ['peso', 'cintura', 'brazo', 'pierna', 'fecha', 'estatura'].some(campo =>
					dif[campo] && dif[campo].valorActual !== dif[campo].valorActualizado
				);
				return hayCambio;
			}
			return false;
		});

		console.log('cambiosEnCamposClaveSeguimiento:', cambiosEnCamposClaveSeguimiento);

		const hayDiferenciasAdicionales = Object.keys(datosActualizados).some(key => {
			if (key === 'seguimiento') return false;
			const valorActual = clienteActual[key] ? clienteActual[key].toString() : '';
			const valorActualizado = datosActualizados[key] ? datosActualizados[key].toString() : '';
			const esDiferente = valorActual !== valorActualizado;
			console.log(`Revisando campo: ${key}, valor actual: ${valorActual}, valor actualizado: ${valorActualizado}, es diferente: ${esDiferente}`);
			return esDiferente;
		});

		console.log('hayDiferenciasAdicionales:', hayDiferenciasAdicionales);

		const datosIguales = Object.keys(diferencias).length === 0 && !hayDiferenciasAdicionales;
		console.log('Datos Iguales:', datosIguales);

		if (datosIguales) {
			console.log("Ningún cambio proporcionado para editar.");
			throw new Error("Ningún cambio proporcionado para editar.");
		} else {
			console.log("Cliente actualizado exitosamente");
			await Cliente.findByIdAndUpdate(idCliente, datosActualizados, { new: true });
		}
	}
}

export default helpersClientes;