import Producto from '../models/productos.js';
import Venta from '../models/ventas.js'; // Assuming you have a sales model

const helpersVentas = {
    postPutCodigoPto: async (codigoProducto, valorUnitario, cantidad) => {
        // Buscar si existe el producto con el código especificado
        const existe = await Producto.findOne({ _id: codigoProducto });
        if (!existe) {
            throw new Error("El código del producto no existe");
        } else {
            // Verificar si el valor unitario del producto es correcto
            const validarValor = await Producto.findOne({ _id: existe._id, valor: valorUnitario });
            if (!validarValor) {
                throw new Error("El valor unitario del producto es incorrecto");
            } else {
                // Restar la cantidad del producto
                const nuevaCantidad = existe.cantidad - cantidad;
                if (nuevaCantidad < 0) {
                    throw new Error("La cantidad en stock es insuficiente");
                }

                // Actualizar la cantidad del producto en la base de datos
                await Producto.updateOne({ _id: existe._id }, { cantidad: nuevaCantidad });
                return { message: "Cantidad actualizada correctamente", nuevaCantidad };
            }
        }
    },
    validateUndoVenta: async (idVenta) => {
        const venta = await Venta.findById(idVenta);
        if (!venta) {
            throw new Error("La venta no existe");
        }
        
        const producto = await Producto.findById(venta.codigoProducto);
        if (!producto) {
            throw new Error("El producto relacionado con la venta no existe");
        }
        
        const nuevaCantidad = producto.cantidad + venta.cantidad;
        await Producto.updateOne({ _id: producto._id }, { cantidad: nuevaCantidad });

        return { message: "Venta deshecha y cantidad actualizada correctamente", nuevaCantidad };
    }
};

export default helpersVentas;



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