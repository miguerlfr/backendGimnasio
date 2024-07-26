import Sede from '../models/sedes.js';
import Usuario from '../models/usuarios.js';

const helpersUsuarios = {
	postEmail: async (email) => {
		const existe = await Usuario.findOne({ email });
		if (!email) {
			throw new Error("El email es requerido");
		} else if (existe) {
			throw new Error(`El email ${email} ya está en la base de datos, digitar un email diferente por favor`);
		}
	},
	postputSede: async (sede) => {
		const sedeExistente = await Sede.findOne({ _id: sede });
		if (!sedeExistente) {
			throw new Error("Sede no existe");
		}
	},
	postputRol: async (rol) => {
		if (typeof rol !== "string") {
			throw new Error("El Rol debe ser tipo texto");
		} else if (rol !== "Instructor" && rol !== "Administrador" && rol !== "Recepcionista") {
			throw new Error("Rol no existe");
		}
	},
	putEmail: async (email, id) => {
		const buscar = await Usuario.findOne({ email, _id: { $ne: id } });
		if (!email) {
			throw new Error("El email es requerido");
		} else if (buscar) {
			throw new Error(`El email ${email} ya está en la base de datos, digitar un email diferente por favor`);
		}
	},
	putId: async (idUsuario, datosActualizados) => {
		// Buscar el usuario por ID
		const usuarioActual = await Usuario.findById(idUsuario);
		if (!usuarioActual) {
			throw new Error("Usuario no encontrado");
		}

		// Imprimir datos actuales y actualizados para depuración
		// console.log("Usuario Actual:", usuarioActual);
		// console.log("Datos Actualizados:", datosActualizados);

		// Comparar los datos actuales con los datos actualizados
		const datosIguales = Object.keys(datosActualizados).every(key => {
			const valorActual = usuarioActual[key];
			const valorActualizado = datosActualizados[key];

			// Comparar valores de manera robusta
			// Convertir valores a cadena para comparación
			const valorActualStr = (valorActual || '').toString().trim();
			const valorActualizadoStr = (valorActualizado || '').toString().trim();

			return valorActualStr === valorActualizadoStr;
		});

		// Imprimir resultado de la comparación
		// console.log("Datos Iguales:", datosIguales);

		if (datosIguales) {
			throw new Error("Ningún cambio proporcionado para editar.");
		}
	}
}

export default helpersUsuarios;