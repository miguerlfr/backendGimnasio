import Proveedore from "../models/proveedores.js";

const helpersProveedores = {
	putId: async (idProveedor, datosActualizados) => {
		// Buscar el proveedor por ID
		const proveedorActual = await Proveedore.findById(idProveedor);
		if (!proveedorActual) {
			throw new Error("Proveedor no encontrado");
		}

		// Imprimir datos actuales y actualizados para depuración
		// console.log("Proveedor Actual:", proveedorActual);
		// console.log("Datos Actualizados:", datosActualizados);

		// Comparar los datos actuales con los datos actualizados
		const datosIguales = Object.keys(datosActualizados).every(key => {
			const valorActual = proveedorActual[key];
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

export default helpersProveedores;