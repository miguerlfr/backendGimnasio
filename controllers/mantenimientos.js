import Mantenimiento from "../models/mantenimientos.js";

const httpMantenimientos = {
    getMantenimientos: async (req, res) => {
        const mantenimientos = await Mantenimiento.find();
        res.json({ mantenimientos });
    },
    getMantenimientosFechas: async (req, res) => {
        try {
            const { fechaInicio, fechaFin } = req.params;

            // Convertir las fechas a objetos Date
            const fechaInicioObj = new Date(fechaInicio);
            const fechaFinObj = new Date(fechaFin);

            // Obtener los mantenimientos dentro del rango de fechas
            const mantenimientos = await Mantenimiento.find({
                fecha: { $gte: fechaInicioObj, $lte: fechaFinObj },
            });

            // Enviar la respuesta con los mantenimientos encontrados
            res.json({ mantenimientos });
        } catch (error) {
            // Enviar un mensaje de error si ocurre algún problema
            res
                .status(500)
                .json({ error: "Error al obtener los mantenimientos por fechas" });
        }
    },
    getMantenimientosID: async (req, res) => {
        const { id } = req.params;
        const mantenimiento = await Mantenimiento.findById(id);
        res.json({ mantenimiento });
    },
    postMantenimientos: async (req, res) => {
        try {
            const { idMaquina, fecha, descripcion, responsable, precio, estado } =
                req.body;
            const mantenimiento = new Mantenimiento({
                idMaquina,
                fecha,
                descripcion,
                responsable,
                precio,
                estado,
            });
            await mantenimiento.save();
            res.json({ mantenimiento });
        } catch (error) {
            res
                .status(500)
                .json({ error: `Error al crear los mantenimientos: ${error}` });
        }
    },
    putMantenimientos: async (req, res) => {
        try {
            const { idMaquina, fecha, descripcion, responsable, precio } =
                req.body;
            const { id } = req.params;
            if (!id) {
                return res
                    .status(400)
                    .json({ error: "ID del Mantenimiento no proporcionado" });
            }

            const mantenimientoActualizado = await Mantenimiento.findByIdAndUpdate(
                id,
                { idMaquina, fecha, descripcion, responsable, precio },
                { new: true }
            );

            if (!mantenimientoActualizado) {
                return res
                    .status(404)
                    .json({ error: "ID del Mantenimiento no encontrado" });
            }

            res.json({ mantenimiento: mantenimientoActualizado });
        } catch (error) {
            res
                .status(500)
                .json({
                    error: `Ningún campo proporcionado para actualizar ${error.message}`,
                });
        }
    },
    putMantenimientosActivar: async (req, res) => {
        const { id } = req.params;
        const mantenimientos = await Mantenimiento.findByIdAndUpdate(
            id,
            { estado: 1 },
            { new: true }
        );
        res.json({ mantenimientos });
    },
    putMantenimientosInactivar: async (req, res) => {
        const { id } = req.params;
        const mantenimientos = await Mantenimiento.findByIdAndUpdate(
            id,
            { estado: 0 },
            { new: true }
        );
        res.json({ mantenimientos });
    },
};

export default httpMantenimientos;
