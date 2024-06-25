import Ingreso from '../models/ingresos.js';

const httpIngresos = {
    getIngresos: async (req, res) => {
        try {
            const ingresos = await Ingreso.find().populate('sede', 'nombre').populate('cliente', 'nombre'); 
            res.json({ ingresos });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los ingresos" });
        }
    },
    getIngresosID: async (req, res) => {
        try {
            const { id } = req.params;
            const ingreso = await Ingreso.findById(id).populate('sede', 'nombre').populate('cliente', 'nombre');
            if (!ingreso) {
                return res.status(404).json({ error: "Ingreso no encontrado" });
            }
            res.json({ ingreso });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el ingreso" });
        }
    },
    postIngresos: async (req, res) => {
        try {
            const { fecha, sede, cliente } = req.body;

            // Si cliente no es una matriz, envolverlo en una matriz
            const clientes = Array.isArray(cliente) ? cliente : [cliente];

            // Parsear la fecha
            const fechaParsed = new Date(fecha);

            // Guardar múltiples ingresos para el mismo cliente
            const ingresos = await Promise.all(clientes.map(async (clienteId) => {
                const ingreso = new Ingreso({
                    fecha: fechaParsed,
                    sede,
                    cliente: clienteId
                });
                await ingreso.save();
                return ingreso;
            }));

            // Enviar respuesta con los ingresos creados
            res.json({ ingresos });
        } catch (error) {
            // Manejar errores
            res.status(500).json({ error: `Error al crear los ingresos: ${error.message}` });
        }
    },

    putIngresos: async (req, res) => {
        try {
            const { id } = req.params;
            const { fecha, sede, cliente } = req.body;

            const ingresoActualizado = await Ingreso.findByIdAndUpdate(
                id,
                { fecha, sede, cliente },
                { new: true }
            );

            if (!ingresoActualizado) {
                return res.status(404).json({ error: "ID del Ingreso no encontrado" });
            }

            res.json({ ingreso: ingresoActualizado });
        } catch (error) {
            res.status(500).json({ error: "Ningún campo proporcionado para actualizar" });
        }
    }
};

export default httpIngresos;
