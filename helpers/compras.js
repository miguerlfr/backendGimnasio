import Producto from '../models/productos.js';
import Compra from '../models/compras.js';

const helpersCompras = {
  postCodigoPto: async (codigoProducto, valorUnitario, cantidad) => {
    // Buscar el producto por código
    const producto = await Producto.findOne({ _id: codigoProducto });
    if (!producto) {
      throw new Error("El código del producto no existe");
    }

    // Convertir valorUnitario a número para la comparación
    // const valorUnitarioNumero = parseFloat(valorUnitario);
    // if (producto.valor !== valorUnitarioNumero) {
    //   throw new Error("El valor unitario del producto es incorrecto");
    // }

    // Verificar la cantidad disponible
    const cantidadNumero = parseInt(cantidad, 10);
    const nuevaCantidad = producto.cantidad + cantidadNumero;
    if (nuevaCantidad < 0) {
      throw new Error("La cantidad de producto(s) no existe");
    }

    // Actualizar la cantidad del producto
    await Producto.updateOne({ _id: producto._id }, { cantidad: nuevaCantidad });
    return { message: "Cantidad actualizada correctamente", nuevaCantidad };
  },
  putId: async (idCompra, datosActualizados) => {
    // Buscar la compra por ID
    const compraActual = await Compra.findById(idCompra);
    if (!compraActual) {
      throw new Error("Compra no encontrada");
    }

    // Imprimir datos actuales y actualizados para depuración
    // console.log("Compra Actual:", compraActual);
    // console.log("Datos Actualizados:", datosActualizados);

    // Comparar los datos actuales con los datos actualizados
    const datosIguales = Object.keys(datosActualizados).every(key => {
      let valorActual = compraActual[key];
      let valorActualizado = datosActualizados[key];

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
  // putCodigoPto: async (codigoProducto, datosProducto) => {
  //     const existe = await Producto.findOne({ _id: codigoProducto });
  //     if (!existe) {
  //       throw new Error(`El producto con código ${codigoProducto} no existe`);
  //     }
  //   },
  actualizarCompra: async (idCompra, datosCompra) => {
    try {
      // Paso 1: Obtener la compra anterior
      const compraAnterior = await Compra.findById(idCompra);
      if (!compraAnterior) {
        throw new Error(`La compra con id ${idCompra} no existe`);
      }

      const { codigoProducto, cantidad } = datosCompra;

      // Paso 2: Obtener el producto nuevo y el producto anterior
      const productoNuevo = await Producto.findById(codigoProducto);
      if (!productoNuevo) {
        throw new Error(`El producto con código ${codigoProducto} no existe`);
      }

      const productoAnterior = await Producto.findById(compraAnterior.codigoProducto);
      if (!productoAnterior) {
        throw new Error(`El producto con código ${compraAnterior.codigoProducto} no existe`);
      }

      // Paso 3: Ajustar el stock del producto anterior
      if (productoAnterior._id.toString() !== productoNuevo._id.toString()) {
        // Restar la cantidad de la compra anterior del producto anterior
        productoAnterior.cantidad -= compraAnterior.cantidad;
        await productoAnterior.save();

        // Sumar la cantidad al producto nuevo
        productoNuevo.cantidad += cantidad;
        await productoNuevo.save();
      } else {
        // Si el producto no ha cambiado, ajustamos el stock basado en la nueva cantidad
        const diferenciaCantidad = cantidad - compraAnterior.cantidad; // Cambio en cantidad
        productoAnterior.cantidad += diferenciaCantidad; // Sumar la diferencia
        await productoAnterior.save();
      }

      // Paso 5: Actualizar la compra
      compraAnterior.cantidad = cantidad;
      compraAnterior.codigoProducto = codigoProducto; // Actualizar el producto si ha cambiado
      await compraAnterior.save();

    } catch (error) {
      console.error("Error en actualizarCompra:", error);
      throw new Error(`Error al actualizar la compra: ${error.message}`);
    }
  }
};

export default helpersCompras;