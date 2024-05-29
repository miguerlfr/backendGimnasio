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
        const { cliente, plan, fecha, valor, estado } = req.body; //el cliente es el id del cliente
        const pagos = new Pago({ cliente, plan, fecha, valor, estado });
        await pagos.save();
        res.json({ pagos });
    },
    putPagos: async (req, res) => {
        const { id } = req.params;
        const { cliente, plan, fecha, valor } = req.body;
        try {
            let updateField;
            if (cliente !== undefined) {
                updateField = { cliente };
            } else if (plan !== undefined) {
                updateField = { plan };
            } else if (fecha !== undefined) {
                updateField = { fecha };
            } else if (valor !== undefined) {
                updateField = { valor };
            } else {
                return res.status(400).json({ error: "Ningún campo proporcionado para actualizar." });
            }
    
            const updatedPago = await Pago.findByIdAndUpdate(id, updateField, { new: true });
            res.json({ pago: updatedPago });
        } catch (error) {
            res.status(500).json({ error: "ID del Pago no encontrado" });
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
