import Producto from '../models/productos.js';
import Venta from '../models/ventas.js';

const helpersVentas = {
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
    const nuevaCantidad = producto.cantidad - cantidadNumero;
    if (nuevaCantidad < 0) {
      throw new Error("La cantidad de producto(s) no existe");
    }

    // Actualizar la cantidad del producto
    await Producto.updateOne({ _id: producto._id }, { cantidad: nuevaCantidad });
    return { message: "Cantidad actualizada correctamente", nuevaCantidad };
  },
  putId: async (idVenta, datosActualizados) => {
    // Buscar la venta por ID
    const ventaActual = await Venta.findById(idVenta);
    if (!ventaActual) {
      throw new Error("Venta no encontrada");
    }

    // Imprimir datos actuales y actualizados para depuración
    // console.log("Venta Actual:", ventaActual);
    // console.log("Datos Actualizados:", datosActualizados);

    // Comparar los datos actuales con los datos actualizados
    const datosIguales = Object.keys(datosActualizados).every(key => {
      let valorActual = ventaActual[key];
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
  actualizarVenta: async (idVenta, datosVenta) => {
    try {
      // Paso 1: Obtener la venta anterior
      const ventaAnterior = await Venta.findById(idVenta);
      if (!ventaAnterior) {
        throw new Error(`La venta con id ${idVenta} no existe`);
      }

      const { codigoProducto, cantidad } = datosVenta;

      // Paso 2: Obtener el producto nuevo y el producto anterior
      const productoNuevo = await Producto.findById(codigoProducto);
      if (!productoNuevo) {
        throw new Error(`El producto con código ${codigoProducto} no existe`);
      }

      const productoAnterior = await Producto.findById(ventaAnterior.codigoProducto);
      if (!productoAnterior) {
        throw new Error(`El producto con código ${ventaAnterior.codigoProducto} no existe`);
      }

      // Paso 3: Ajustar el stock del producto anterior
      // Si el producto ha cambiado, reponemos el stock del producto anterior
      if (productoAnterior._id.toString() !== productoNuevo._id.toString()) {
        productoAnterior.cantidad += ventaAnterior.cantidad;
        await productoAnterior.save();

        // Reducimos el stock del producto nuevo
        productoNuevo.cantidad -= cantidad;
        if (productoNuevo.cantidad < 0) {
          throw new Error('No hay suficiente stock del producto');
        }
        await productoNuevo.save();
      } else {
        // Si el producto no ha cambiado, ajustamos el stock basado en la nueva cantidad
        const diferenciaCantidad = ventaAnterior.cantidad - cantidad;
        productoAnterior.cantidad += diferenciaCantidad;
        if (productoAnterior.cantidad < 0) {
          throw new Error('No hay suficiente stock del producto');
        }
        await productoAnterior.save();
      }

      // Paso 5: Actualizar la venta
      ventaAnterior.cantidad = cantidad;
      ventaAnterior.codigoProducto = codigoProducto; // Actualizar el producto si ha cambiado
      await ventaAnterior.save();

    } catch (error) {
      console.error("Error en actualizarVenta:", error);
      throw new Error(`Error al actualizar la venta: ${error.message}`);
    }
  }
};

export default helpersVentas;

// validateUndoVenta: async (idVenta) => {
//     const venta = await Venta.findById(idVenta);
//     if (!venta) {
//         throw new Error("La venta no existe");
//     }

//     const producto = await Producto.findById(venta.codigoProducto);
//     if (!producto) {
//         throw new Error("El producto relacionado con la venta no existe");
//     }

//     const nuevaCantidad = producto.cantidad + venta.cantidad;
//     await Producto.updateOne({ _id: producto._id }, { cantidad: nuevaCantidad });

//     return { message: "Venta deshecha y cantidad actualizada correctamente", nuevaCantidad };
// },

// import Producto from '../models/productos.js';

// const helpersVentas = {
//     postPutCodigoPto: async (codigoProducto, valorUnitario, cantidad) => {
//         // Buscar si existe el producto con el código especificado
//         const existe = await Producto.findOne({ _id: codigoProducto });
//         if (!existe) {
//             throw new Error("El código del producto no existe");
//         } else {

//             // Verificar si el valor unitario del producto es correcto
//             const validarValor = await Producto.findOne({ _id: existe._id, valor: valorUnitario });
//             if (!validarValor) {
//                 throw new Error("El valor unitario del producto es incorrecto");
//             } else {

//                 // Restar la cantidad del producto
//                 const nuevaCantidad = existe.cantidad - cantidad;
//                 if (nuevaCantidad < 0) {
//                     throw new Error("La cantidad en stock es insuficiente");
//                 }

//                 // Actualizar la cantidad del producto en la base de datos
//                 await Producto.updateOne({ _id: existe._id }, { cantidad: nuevaCantidad });
//                 return { message: "Cantidad actualizada correctamente", nuevaCantidad };
//             }
//         }
//     }
// };

// export default helpersVentas;