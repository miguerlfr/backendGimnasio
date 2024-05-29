import Cliente from "../models/clientes.js";

const httpClientes = {
    getClientes: async (req, res) => {
        const clientes = await Cliente.find();
        res.json({ clientes });
    },
    getClientesActivos: async (req, res) => {
        const clientesAc = await Cliente.find({ estado: 1 });
        res.json({ clientesAc });
    },
    getClientesInactivos: async (req, res) => {
        const clientesIn = await Cliente.find({ estado: 0 });
        res.json({ clientesIn });
    },
    getClientesID: async (req, res) => {
        const { id } = req.params;
        const clientes = await Cliente.findById(id);
        res.json({ clientes });
    },
    getClientesSeguimiento: async (req, res) => {
        const { id } = req.params;
        const clientesS = await Cliente.findById(id).select("seguimiento");
        res.json({ clientesS });
    },
    getClientesPlan: async (req, res) => {
        try {
            const { plan } = req.params;
            const clientesC = await Cliente.countDocuments({ plan });
            const clientesP = await Cliente.find({ plan }); // Fetch clients matching the plan
            res.json({ clientesC, clientesP });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    getClientesCumpleaños: async (req, res) => {
        const { fecha } = req.params;
        const clientesC = await Cliente.filter({ fechaNacimiento: new Date(fecha) });
        res.json({ clientesC });
    },
    getClientesIngresaron: async (req, res) => {
        const { fecha } = req.params;
        const clientesIngresaron = await Cliente.find({ fechaIngreso: new Date(fecha) });
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
            const {
                nombre,
                fechaIngreso,
                documento,
                fechaNacimiento,
                edad,
                direccion,
                telefono,
                objetivo,
                observaciones,
                estado,
                plan,
                fechaVencimiento,
                seguimiento
            } = req.body;

            // Parsear las fechas
            const fechaIngresoParsed = new Date(fechaIngreso);
            const fechaNacimientoParsed = new Date(fechaNacimiento);
            const fechaVencimientoParsed = new Date(fechaVencimiento);

            // Crear un nuevo cliente con las fechas parseadas
            const cliente = new Cliente({
                nombre,
                fechaIngreso: fechaIngresoParsed,
                documento,
                fechaNacimiento: fechaNacimientoParsed,
                edad,
                direccion,
                telefono,
                objetivo,
                observaciones,
                estado,
                plan,
                fechaVencimiento: fechaVencimientoParsed,
                seguimiento
            });

            // Guardar el cliente en la base de datos
            await cliente.save();

            // Enviar respuesta con el cliente creado
            res.json({ cliente });
        } catch (error) {
            // Manejar errores
            res.status(400).json({ error: `No se pudo crear el cliente ${error.message}` });
        }
    },
    putClientes: async (req, res) => {
        const { id } = req.params;
        const {
            nombre,
            fechaIngreso,
            documento,
            fechaNacimiento,
            edad,
            direccion,
            telefono,
            objetivo,
            observaciones,
            plan,
            fechaVencimiento,
            seguimiento
        } = req.body;

        const camposActualizables = {
            ...(nombre !== undefined && { nombre }),
            ...(fechaIngreso !== undefined && { fechaIngreso }),
            ...(documento !== undefined && { documento }),
            ...(fechaNacimiento !== undefined && { fechaNacimiento }),
            ...(edad !== undefined && { edad }),
            ...(direccion !== undefined && { direccion }),
            ...(telefono !== undefined && { telefono }),
            ...(objetivo !== undefined && { objetivo }),
            ...(observaciones !== undefined && { observaciones }),
            ...(plan !== undefined && { plan }),
            ...(fechaVencimiento !== undefined && { fechaVencimiento }),
            ...(seguimiento !== undefined && { seguimiento })
        };

        if (Object.keys(camposActualizables).length === 0) {
            return res.status(400).json({ error: "Ningún campo proporcionado para actualizar." });
        }

        const clienteActualizado = await Cliente.findByIdAndUpdate(id, camposActualizables, { new: true });
        if (!clienteActualizado) {
            return res.status(404).json({ error: "ID del Cliente no encontrado" });
        }
        res.json(clienteActualizado);
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