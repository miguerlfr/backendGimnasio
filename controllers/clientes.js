import Cliente from "../models/clientes.js";
import Plane from "../models/planes.js";

const httpClientes = {
	getClientes: async (req, res) => {
		const clientes = await Cliente.find().populate("plan", "descripcion");
		res.json({ clientes });
	},
	getClientesActivos: async (req, res) => {
		const clientes = await Cliente.find({ estado: 1 }).populate("plan", "descripcion");
		res.json({ clientes });
	},
	getClientesInactivos: async (req, res) => {
		const clientes = await Cliente.find({ estado: 0 }).populate("plan", "descripcion");
		res.json({ clientes });
	},
	getClientesID: async (req, res) => {
		const { id } = req.params;
		const clientes = await Cliente.findById(id).populate("plan", "descripcion");
		res.json({ clientes });
	},
	getClientesSeguimiento: async (req, res) => {
		const { id } = req.params;
		const clientesS = await Cliente.findById(id).select("seguimiento").populate("plan", "descripcion");
		res.json({ clientesS });
	},
	getClientesPlan: async (req, res) => {
		try {
			const { plan } = req.params;
			const clientesC = await Cliente.countDocuments({ plan });
			const clientesP = await Cliente.find({ plan }).populate("plan", "descripcion");
			res.json({ clientesC, clientesP });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Error al obtener los clientes por plan" });
		}
	},
	getClientesCumpleaños: async (req, res) => {
		const { fecha } = req.params;
		const clientesC = await Cliente.filter({ fechaNacimiento: new Date(fecha) }).populate("plan", "descripcion");
		res.json({ clientesC });
	},
	getClientesIngresaron: async (req, res) => {
		const { fecha } = req.params;
		const clientesIngresaron = await Cliente.find({ fechaIngreso: new Date(fecha) }).populate("plan", "descripcion");
		const clientesCantidad = await Cliente.countDocuments({
			fechaIngreso: new Date(fecha),
		});
		res.json({ clientesCantidad, clientesIngresaron });
	},
	// getClientesIngresaron: async (req, res) => {
	//     const { fecha } = req.params;
	//     try {
	//       const clientesIngresaron = await Cliente.find({ fechaIngreso: new Date(fecha) });
	//       const clientesCantidad = await Cliente.countDocuments({
	//         fechaIngreso: new Date(fecha),
	//       });
	//       // Agrega los resultados a un objeto para enviar en la respuesta
	//       const clientes = {
	//         clientesCantidad: clientesCantidad,
	//         clientesIngresaron: clientesIngresaron
	//       };
	//       res.json({ clientes });
	//     } catch (error) {
	//       // Maneja cualquier error
	//       console.error("Error al obtener clientes que ingresaron:", error);
	//       res.status(500).json({ error: "Error al obtener clientes que ingresaron" });
	//     }
	//   },
	postClientes: async (req, res) => {
		try {
			console.log("req.body:", req.body);
			let { nombre, fechaIngreso, documento, fechaNacimiento, direccion, email, objetivo, observaciones, estado, plan, seguimiento } = req.body;
	
			// Crear un nuevo cliente con los datos recibidos
			const cliente = new Cliente({
				nombre,
				fechaIngreso: new Date(fechaIngreso),
				documento,
				fechaNacimiento: new Date(fechaNacimiento),
				direccion,
				email,
				objetivo,
				observaciones,
				estado,
				plan,
				seguimiento,
			});
	
			// Calcular el IMC y su clasificación
			cliente.calcularIMC();
	
			// Guardar el cliente en la base de datos
			await cliente.save();
	
			console.log("cliente", cliente);
			// Enviar respuesta con el cliente creado
			res.json({ cliente });
		} catch (error) {
			// Manejar errores
			console.log("error:", error);
			res.status(400).json({ error: `No se pudo crear el cliente ${error.message}` });
		}
	},
	putClientes: async (req, res) => {
		try {
			const { id } = req.params;
	
			// Verifica si el id está presente
			if (!id) {
				return res.status(400).json({ error: "ID del cliente es requerido" });
			}
	
			let { nombre, fechaIngreso, documento, fechaNacimiento, direccion, email, objetivo, observaciones, plan, seguimiento } = req.body;
	
			// Verificar si el plan se proporcionó y si existe
			if (plan) {
				const planData = await Plane.findById(plan);
				if (!planData) {
					throw new Error("Plan no encontrado");
				}
			}
	
			// Campos actualizables del cliente
			const camposActualizables = {
				nombre,
				fechaIngreso: fechaIngreso ? new Date(fechaIngreso) : undefined,
				documento,
				fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
				direccion,
				email,
				objetivo,
				observaciones,
				plan,
				seguimiento,
			};
	
			// Filtrar campos indefinidos
			Object.keys(camposActualizables).forEach(key => {
				if (camposActualizables[key] === undefined) {
					delete camposActualizables[key];
				}
			});
	
			if (Object.keys(camposActualizables).length === 0) {
				return res.status(400).json({ error: "Ningún campo proporcionado para actualizar." });
			}
	
			// Actualizar el cliente
			const clienteActualizado = await Cliente.findById(id);
	
			if (!clienteActualizado) {
				return res.status(404).json({ error: "ID del Cliente no encontrado" });
			}
	
			// Actualizar los campos del cliente
			Object.assign(clienteActualizado, camposActualizables);
	
			// Calcular la fecha de vencimiento solo si no hay pagos registrados
			const Pago = mongoose.model('Pago'); // Asume que el modelo de pago se llama 'Pago'
			const pagosCliente = await Pago.find({ cliente: id }).exec();
	
			if (pagosCliente.length === 0 && clienteActualizado.fechaIngreso && clienteActualizado.plan) {
				// Buscar el plan en la base de datos
				const Plan = mongoose.model('Plane'); // Asume que el modelo del plan se llama 'Plane'
				const plan = await Plan.findById(clienteActualizado.plan).exec();
	
				if (plan && plan.dias) {
					// Calcular fecha de vencimiento
					clienteActualizado.fechaVencimiento = new Date(clienteActualizado.fechaIngreso);
					clienteActualizado.fechaVencimiento.setDate(clienteActualizado.fechaVencimiento.getDate() + plan.dias);
				}
			}
	
			// Calcular IMC después de la actualización
			clienteActualizado.calcularIMC();
			await clienteActualizado.save();
	
			res.json(clienteActualizado);
		} catch (error) {
			// Manejar errores
			console.log("error:", error);
			res.status(400).json({ error: `No se pudo editar el cliente: ${error.message}` });
		}
	},		
	putClientesActivar: async (req, res) => {
		const { id } = req.params;
		const clientes = await Cliente.findByIdAndUpdate(id, { estado: 1 }, { new: true });
		res.json({ clientes });
	},
	putClientesInactivar: async (req, res) => {
		const { id } = req.params;
		const clientes = await Cliente.findByIdAndUpdate(id, { estado: 0 }, { new: true });
		res.json({ clientes });
	},
};

export default httpClientes;
