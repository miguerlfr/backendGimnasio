import Producto from '../models/productos.js';

const helpersVentas = {
    postPutCodigoPto: async (codigoProducto, valorUnitario, cantidad) => {
        // Buscar si existe el producto con el código especificado
        const existe = await Producto.findOne({ codigo: codigoProducto });
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
    }
};

export default helpersVentas;