import Sede from "../models/sedes.js";

const helpersSedes = {
	postCodigo: async (codigo) => {
		const existe = await Sede.findOne({ codigo });
		if (!codigo) {
			throw new Error("El código es requerido");
		} else if (existe) {
			throw new Error(`El código ${codigo} ya está en la base de datos, digitar un código diferente por favor`);
		}
	},
	putCodigo: async (codigo, id) => {
		const codigoUnico = await Sede.findOne({ codigo, _id: { $ne: id } });
		if (!codigo) {
			throw new Error("El código es requerido");
		} else if (codigoUnico) {
			throw new Error(`El código ${codigo} ya está en la base de datos, digitar un código diferente por favor`);
		}
	},	
	putId: async (idSede, datosActualizados) => {
	  
		// Buscar la sede por ID
		const sedeActual = await Sede.findById(idSede);
		if (!sedeActual) {
		  throw new Error("Sede no encontrada");
		}
	  
		// Imprimir datos actuales y actualizados para depuración
		// console.log("Sede Actual:", sedeActual);
		// console.log("Datos Actualizados:", datosActualizados);
	  
		// Comparar los datos actuales con los datos actualizados
		const datosIguales = Object.keys(datosActualizados).every(key => {
		  const valorActual = sedeActual[key];
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
};

export default helpersSedes;