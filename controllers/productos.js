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

            if (codigo != undefined) {
                const invetariosC = await Producto.findByIdAndUpdate(
                    id,
                    { codigo },
                    { new: true }
                );
                res.json({ invetariosC });
            } else if (descripcion != undefined) {
                const invetariosD = await Producto.findByIdAndUpdate(
                    id,
                    { descripcion },
                    { new: true }
                );
                res.json({ invetariosD });
            } else if (valor != undefined) {
                const invetariosV = await Producto.findByIdAndUpdate(
                    id,
                    { valor },
                    { new: true }
                );
                res.json({ invetariosV });
            } else if (cantidad != undefined) {
                const invetariosCa = await Producto.findByIdAndUpdate(
                    id,
                    { cantidad },
                    { new: true }
                );
                res.json({ invetariosCa });
            } else {
                res
                    .status(200)
                    .json({ error: "Ningún campo proporcionado para actualizar." });
            }

        } catch (error) {
            return res.status(404).json({ error: "ID del Producto no encontrado" });
        }
    },
};

export default httpProductos