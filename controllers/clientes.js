import Cliente from "../models/clientes.js";
import Plane from "../models/planes.js";

const httpClientes = {
	getClientes: async (req, res) => {
		const clientes = await Cliente.find().populate("plan", "descripcion");
		res.json({ clientes });
	},
	getClientesActivos: async (req, res) => {
		const clientesAc = await Cliente.find({ estado: 1 }).populate("plan", "descripcion");
		res.json({ clientesAc });
	},
	getClientesInactivos: async (req, res) => {
		const clientesIn = await Cliente.find({ estado: 0 }).populate("plan", "descripcion");
		res.json({ clientesIn });
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
			let { nombre, fechaIngreso, documento, fechaNacimiento, edad, direccion, telefono, objetivo, observaciones, estado, plan, fechaVencimiento, seguimiento } = req.body;

			console.log("seguimiento:", seguimiento);

			// Calcular el IMC y su clasificación si el peso y la estatura están disponibles
			if (seguimiento && seguimiento.length > 0) {
				seguimiento.forEach((seg) => {
					// Verificar que el peso y las estaturas sean números válidos
					const peso = parseFloat(seg.peso);
					const estaturaMetros = parseFloat(seg.estaturaMetros) || 0; // En metros
					const estaturaCentimetros = parseFloat(seg.estaturaCentimetros) || 0; // En centímetros

					if (!isNaN(peso) && (!isNaN(estaturaMetros) || !isNaN(estaturaCentimetros))) {
						// Convertir la estatura total a metros
						const estaturaTotalMetros = estaturaMetros + estaturaCentimetros / 100;

						if (estaturaTotalMetros > 0) {
							// Calcular el IMC
							seg.imc = peso / estaturaTotalMetros ** 2;

							// Clasificar el IMC
							if (seg.imc < 18.5) {
								seg.estadoIMC = "Bajo peso";
							} else if (seg.imc >= 18.5 && seg.imc < 24.9) {
								seg.estadoIMC = "Normal";
							} else if (seg.imc >= 25 && seg.imc < 29.9) {
								seg.estadoIMC = "Sobrepeso";
							} else if (seg.imc >= 30 && seg.imc < 34.9) {
								seg.estadoIMC = "Obesidad 1";
							} else if (seg.imc >= 35 && seg.imc < 39.9) {
								seg.estadoIMC = "Obesidad 2";
							} else if (seg.imc >= 40) {
								seg.estadoIMC = "Obesidad 3";
							}
						} else {
							console.error(`Estatura inválida para el seguimiento: ${seg.estaturaMetros} metros, ${seg.estaturaCentimetros} centímetros`);
						}
					} else {
						console.error(`Datos inválidos para el seguimiento: Peso - ${seg.peso}, Estatura - ${seg.estaturaMetros} metros, ${seg.estaturaCentimetros} centímetros`);
					}
				});
			}

			// Obtener el plan para calcular la fecha de vencimiento
			const planData = await Plane.findById(plan);
			// console.log("plan", plan);
			if (!planData) {
				throw new Error("Plan no encontrado");
			}

			// Crear un nuevo cliente con las fechas parseadas y los datos recibidos
			const cliente = new Cliente({
				nombre,
				fechaIngreso: new Date(fechaIngreso),
				documento,
				fechaNacimiento: new Date(fechaNacimiento),
				edad: new Date().getFullYear() - new Date(fechaNacimiento).getFullYear(),
				direccion,
				telefono,
				objetivo,
				observaciones,
				estado,
				plan,
				fechaVencimiento: new Date(new Date(fechaIngreso).setDate(new Date(fechaIngreso).getDate() + planData.dias)), // Usar la fecha calculada
				seguimiento
			});

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
		const { id } = req.params;
		let { nombre, fechaIngreso, documento, fechaNacimiento, edad, direccion, telefono, objetivo, observaciones, plan, fechaVencimiento, seguimiento } = req.body;

		// Obtener el plan para calcular la fecha de vencimiento
		const planData = await Plane.findById(plan);
		// console.log("plan", plan);
		if (!planData) {
			throw new Error("Plan no encontrado");
		}

		const camposActualizables = {
			nombre,
			fechaIngreso,
			documento,
			fechaNacimiento,
			edad: new Date().getFullYear() - new Date(fechaNacimiento).getFullYear(),
			direccion,
			telefono,
			objetivo,
			observaciones,
			plan,
			fechaVencimiento: new Date(new Date(fechaIngreso).setDate(new Date(fechaIngreso).getDate() + planData.dias)),
			seguimiento,
		};

		if (Object.keys(camposActualizables).length === 0) {
			return res.status(400).json({ error: "Ningún campo proporcionado para actualizar." });
		}

		// Calcular el IMC y su clasificación si el peso y la estatura están disponibles
		if (seguimiento && seguimiento.length > 0) {
			seguimiento.forEach((seg) => {
				// Verificar que el peso y las estaturas sean números válidos
				const peso = parseFloat(seg.peso);
				const estaturaMetros = parseFloat(seg.estaturaMetros) || 0; // En metros
				const estaturaCentimetros = parseFloat(seg.estaturaCentimetros) || 0; // En centímetros

				if (!isNaN(peso) && (!isNaN(estaturaMetros) || !isNaN(estaturaCentimetros))) {
					// Convertir la estatura total a metros
					const estaturaTotalMetros = estaturaMetros + estaturaCentimetros / 100;

					if (estaturaTotalMetros > 0) {
						// Calcular el IMC
						seg.imc = peso / estaturaTotalMetros ** 2;

						// Clasificar el IMC
						if (seg.imc < 18.5) {
							seg.estadoIMC = "Bajo peso";
						} else if (seg.imc >= 18.5 && seg.imc < 24.9) {
							seg.estadoIMC = "Normal";
						} else if (seg.imc >= 25 && seg.imc < 29.9) {
							seg.estadoIMC = "Sobrepeso";
						} else if (seg.imc >= 30 && seg.imc < 34.9) {
							seg.estadoIMC = "Obesidad 1";
						} else if (seg.imc >= 35 && seg.imc < 39.9) {
							seg.estadoIMC = "Obesidad 2";
						} else if (seg.imc >= 40) {
							seg.estadoIMC = "Obesidad 3";
						}
					} else {
						console.error(`Estatura inválida para el seguimiento: ${seg.estaturaMetros} metros, ${seg.estaturaCentimetros} centímetros`);
					}
				} else {
					console.error(`Datos inválidos para el seguimiento: Peso - ${seg.peso}, Estatura - ${seg.estaturaMetros} metros, ${seg.estaturaCentimetros} centímetros`);
				}
			});
		}

		try {
			const clienteActualizado = await Cliente.findByIdAndUpdate(id, camposActualizables, { new: true });
			if (!clienteActualizado) {
				return res.status(404).json({ error: "ID del Cliente no encontrado" });
			}
			res.json(clienteActualizado);
		} catch (error) {
			// Manejar errores
			console.log("error:", error);
			res.status(400).json({ error: `No se pudo actualizar el cliente ${error.message}` });
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
