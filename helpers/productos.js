import Producto from "../models/productos.js";

const helpersProductos = {
	postCodigo: async (codigo) => {
		const existe = await Producto.findOne({ codigo });
		if (!codigo) {
			throw new Error("El código es requerido");
		} else if (existe) {
			throw new Error(`El código ${codigo} ya está en la base de datos, digitar un código diferente por favor`);
		}
	},
	putCodigo: async (codigo, id) => {
		const codigoUnico = await Producto.findOne({ codigo, _id: { $ne: id } });
		if (!codigo) {
			throw new Error("El código es requerido");
		} else if (codigoUnico) {
			throw new Error(`El código ${codigo} ya está en la base de datos, digitar un código diferente por favor`);
		}
	},
	putId: async (idProducto, datosActualizados) => {
		// Buscar el producto por ID
		const productoActual = await Producto.findById(idProducto);
		if (!productoActual) {
			throw new Error("Producto no encontrado");
		}

		// Imprimir datos actuales y actualizados para depuración
		// console.log("Producto Actual:", productoActual);
		// console.log("Datos Actualizados:", datosActualizados);

		// Comparar los datos actuales con los datos actualizados
		const datosIguales = Object.keys(datosActualizados).every(key => {
			const valorActual = productoActual[key];
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

export default helpersProductos;