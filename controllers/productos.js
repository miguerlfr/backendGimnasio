import Producto from "../models/productos.js";

const httpProductos = {
	getProductos: async (req, res) => {
		const productos = await Producto.find().populate("proveedor", "nombre");
		res.json({ productos });
	},
	getProductosActivos: async (req, res) => {
		const productos = await Producto.find({ estado: 1 }).populate("proveedor", "nombre");
		res.json({ productos });
	},
	getProductosInactivos: async (req, res) => {
		const productos = await Producto.find({ estado: 0 }).populate("proveedor", "nombre");
		res.json({ productos });
	},
	getProductosTotal: async (req, res) => {
		const productosTotal = await Producto.find().populate("proveedor", "nombre");
		const total = productosTotal.reduce((acc, item) => {
			return acc + item.valor;
		}, 0);
		res.json({ total: total });
	},
	getProductosID: async (req, res) => {
		const { id } = req.params;
		const productos = await Producto.findById(id).populate("proveedor", "nombre");
		res.json({ productos });
	},
	postProductos: async (req, res) => {
		try {
			const { codigo, proveedor, descripcion, valor, cantidad, estado } = req.body;
			const productos = new Producto({
				codigo,
				proveedor,
				descripcion,
				valor: valor.replace(/[^0-9]/g, ''),
				cantidad: cantidad.replace(/[^0-9]/g, ''),
				estado
			});
			await productos.save();
			res.json({ productos });
		} catch (error) {
			// Manejar errores
			console.log("error:", error);
			res.status(400).json({ error: `No se pudo crear el cliente ${error.message}` });
		}
	},
	putProductos: async (req, res) => {
		const { id } = req.params;
		const { codigo, descripcion, valor, cantidad } = req.body;
	
		try {
			// Crear objeto de actualización solo con los campos proporcionados y limpiados
			const updateFields = {};
	
			if (codigo) updateFields.codigo = codigo;
			if (proveedor) updateFields.proveedor = proveedor;
			if (descripcion) updateFields.descripcion = descripcion;
			if (valor) updateFields.valor = valor.toString().replace(/[^0-9]/g, '');
			if (cantidad) updateFields.cantidad = cantidad.toString().replace(/[^0-9]/g, '');
	
			if (Object.keys(updateFields).length === 0) {
				return res.status(400).json({ error: "Ningún campo proporcionado para actualizar." });
			}
	
			const productoActualizado = await Producto.findByIdAndUpdate(id, updateFields, { new: true });
	
			if (!productoActualizado) {
				return res.status(404).json({ error: "ID del Producto no encontrado" });
			}
	
			res.json({ productoActualizado });
		} catch (error) {
			res.status(500).json({ error: `Error al editar el producto ${error.message}` });
		}
	},	
	putProductosActivar: async (req, res) => {
		const { id } = req.params;
		const productos = await Producto.findByIdAndUpdate(id, { estado: 1 }, { new: true });
		res.json({ productos });
	},
	putProductosInactivar: async (req, res) => {
		const { id } = req.params;
		const productos = await Producto.findByIdAndUpdate(id, { estado: 0 }, { new: true });
		res.json({ productos });
	},
};

export default httpProductos;
