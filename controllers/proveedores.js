import Proveedore from "../models/proveedores.js";

const httpProveedores = {
	getProveedores: async (req, res) => {
		try {
			const proveedores = await Proveedore.find()
			res.status(200).json(proveedores);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
	getProveedoresActivos: async (req, res) => {
		const proveedores = await Proveedore.find({ estado: 1 })
		res.json(proveedores);
	},
	getProveedoresInactivos: async (req, res) => {
		const proveedores = await Proveedore.find({ estado: 0 })
		res.json(proveedores);
	},
	getProveedoresID: async (req, res) => {
		try {
			const proveedor = await Proveedore.findById(req.params.id)
			if (!proveedor) return res.status(404).json({ message: "Proveedor no encontrado" });
			res.status(200).json(proveedor);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
	postProveedores: async (req, res) => {
		const proveedor = new Proveedore(req.body);
		try {
			const newProveedor = await proveedor.save();
			res.status(201).json(newProveedor);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	},
	putProveedores: async (req, res) => {
		try {
			const updatedProveedor = await Proveedore.findByIdAndUpdate(req.params.id, req.body, { new: true });
			if (!updatedProveedor) return res.status(404).json({ message: "Proveedor no encontrado" });
			res.status(200).json(updatedProveedor);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	},
    putProveedoresActivar: async (req, res) => {
		const { id } = req.params;
		const proveedores = await Proveedore.findByIdAndUpdate(id, { estado: 1 }, { new: true });
		res.json({ proveedores });
	},
	putProveedoresInactivar: async (req, res) => {
		const { id } = req.params;
		const proveedores = await Proveedore.findByIdAndUpdate(id, { estado: 0 }, { new: true });
		res.json({ proveedores });
	},
};

export default httpProveedores;