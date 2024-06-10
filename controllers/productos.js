import Producto from '../models/productos.js';

const httpProductos = {
    getProductos: async (req, res) => {
        const productos = await Producto.find();
        res.json({ productos });
    },
    getProductosTotal: async (req, res) => {
        const productosTotal = await Producto.find();
        const total = productosTotal.reduce((acc, item) => {
            return acc + item.valor;
        }, 0);
        res.json({ total: total });
    },
    getProductosID: async (req, res) => {
        const { id } = req.params;
        const productos = await Producto.findById(id);
        res.json({ productos });
    },
    postProductos: async (req, res) => {
        const { codigo, descripcion, valor, cantidad } = req.body;
        const productos = new Producto({
            codigo,
            descripcion,
            valor,
            cantidad,
        });
        await productos.save();
        res.json({ productos });
    },
    putProductos: async (req, res) => {
        const { id } = req.params;
        const { codigo, descripcion, valor, cantidad } = req.body;
      
        try {
          const updateFields = {};
      
          if (codigo !== undefined) updateFields.codigo = codigo;
          if (descripcion !== undefined) updateFields.descripcion = descripcion;
          if (valor !== undefined) updateFields.valor = valor;
          if (cantidad !== undefined) updateFields.cantidad = cantidad;
      
          if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "Ningún campo proporcionado para actualizar." });
          }
      
          const productoActualizado = await Producto.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
          );
      
          if (!productoActualizado) {
            return res.status(404).json({ error: "ID del Producto no encontrado" });
          }
      
          res.json({ productoActualizado });
        } catch (error) {
          res.status(500).json({ error: "Error al actualizar el producto" });
        }
      }      
};

export default httpProductos