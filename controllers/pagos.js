import Pago from "../models/pagos.js";

const httpPagos = {
    getPagos: async (req, res) => {
        const pagos = await Pago.find();
        res.json({ pagos });
    },
    getPagosActivos: async (req, res) => {
        const pagosAc = await Pago.find({ estado: 1 });
        res.json({ pagosAc });
    },
    getPagosInactivos: async (req, res) => {
        const pagosIn = await Pago.find({ estado: 0 });
        res.json({ pagosIn });
    },
    getPagosID: async (req, res) => {
        const { id } = req.params;
        const pagos = await Pago.findById(id);
        res.json({ pagos });
    },
    getPagosFecha: async (req, res) => {
        const { fecha } = req.params;
        const pagosF = await Pago.find({ fecha: fecha });
        res.json({ pagosF });
    },
    getPagosPlan: async (req, res) => {
        const { plan } = req.params;
        const pagosP = await Pago.find({ plan: plan });
        res.json({ pagosP });
    },
    getPagosCliente: async (req, res) => {
        const { cliente } = req.params;
        const clienteN = await Pago.find({ cliente: cliente });
        res.json({ clienteN });
    },
    postPagos: async (req, res) => {
        try {
            const { cliente, plan, fecha, valor, estado } = req.body; //el cliente es el id del cliente
            const pagos = new Pago({ cliente, plan, fecha, valor, estado });
            await pagos.save();
            res.json({ pagos });
        } catch (error) {
            console.error("Error al agregar el pago:", error);
            res.status(500).json({ error: `Error al agregar el pago ${error}` });
        }
    },    
    putPagos: async (req, res) => {
        const { id } = req.params;
        const { cliente, plan, fecha, valor } = req.body;
        try {
            // // Verificar si el pago con el ID proporcionado existe
            // const pagoExistente = await Pago.findById(id);
            // if (!pagoExistente) {
            //     return res.status(404).json({ error: "ID del Pago no encontrado" });
            // }
    
            // Actualizar solo los campos proporcionados
            const updateFields = {};
            if (cliente !== undefined) {
                updateFields.cliente = cliente;
            }
            if (plan !== undefined) {
                updateFields.plan = plan;
            }
            if (fecha !== undefined) {
                updateFields.fecha = fecha;
            }
            if (valor !== undefined) {
                updateFields.valor = valor;
            }
    
            // Realizar la actualización en la base de datos
            const updatedPago = await Pago.findByIdAndUpdate(id, updateFields, { new: true });
    
            // Devolver el pago actualizado como respuesta
            res.json({ pago: updatedPago });
        } catch (error) {
            // Manejar errores de forma adecuada
            console.error(error);
            res.status(500).json({ error: `Error al actualizar el pago ${error.message}` });
        }
    },    
    putPagosActivar: async (req, res) => {
        const { id } = req.params; //el id es del id
        const pagos = await Pago.findByIdAndUpdate(
            id,
            { estado: 1 },
            { new: true }
        );
        res.json({ pagos });
    },
    putPagosInactivar: async (req, res) => {
        const { id } = req.params; //el id es del id
        const pagos = await Pago.findByIdAndUpdate(
            id,
            { estado: 0 },
            { new: true }
        );
        res.json({ pagos });
    },
};

export default httpPagos;
