import Plane from "../models/planes.js"

const httpPlanes = {
    getPlanes: async (req, res) => {
        const planes = await Plane.find();
        res.json({ planes });
    },
    getPlanesActivos: async (req, res) => {
        const planesAc = await Plane.find({ estado: 1 });
        res.json({ planesAc });
    },
    getPlanesInactivos: async (req, res) => {
        const planesIn = await Plane.find({ estado: 0 });
        res.json({ planesIn });
    },
    getPlanesID: async (req, res) => {
        const { id } = req.params;
        const planes = await Plane.findById(id);
        res.json({ planes });
    },
    postPlanes: async (req, res) => {
        const { codigo, descripcion, valor, dias, estado } = req.body;
        // Convertir la cadena de texto a un número
        const valorNumerico = parseFloat(valor);
        // Formatear el número con puntos como separadores de miles
        const valorFormateado = valorNumerico.toLocaleString('es-ES');
        // Crear el objeto Plane con el valor formateado
        const planes = new Plane({ codigo, descripcion, valor: valorNumerico, dias, estado });
        await planes.save();
        // Modificar el objeto planes antes de enviar la respuesta
        planes.valor = valorFormateado;
        res.json({ planes });
    },
    putPlanes: async (req, res) => {
        const { id } = req.params;
        const { codigo, descripcion, valor, dias } = req.body;
        try {
            if (codigo != undefined) {
                const planesC = await Plane.findByIdAndUpdate(
                    id,
                    { codigo },
                    { new: true }
                );
                res.json({ planesC });
            } else if (descripcion != undefined) {
                const planesD = await Plane.findByIdAndUpdate(
                    id,
                    { descripcion },
                    { new: true }
                );
                res.json({ planesD });
            } else if (valor != undefined) {
                const planesV = await Plane.findByIdAndUpdate(
                    id,
                    { valor },
                    { new: true }
                );
                res.json({ planesV });
            } else if (dias != undefined) {
                const planesD = await Plane.findByIdAndUpdate(
                    id,
                    { dias },
                    { new: true }
                );
                res.json({ planesD });
            } else {
                res
                    .status(200)
                    .json({ error: "Ningún campo proporcionado para actualizar." });
            }
        } catch (error) {
            return res.status(404).json({ error: "ID de Plan no encontrado" });
        }
    },
    putPlanesActivar: async (req, res) => {
        const { id } = req.params;
        const planes = await Plane.findByIdAndUpdate(
            id,
            { estado: 1 },
            { new: true }
        );
        res.json({ planes });
    },
    putPlanesInactivar: async (req, res) => {
        const { id } = req.params;
        const planes = await Plane.findByIdAndUpdate(
            id,
            { estado: 0 },
            { new: true }
        );
        res.json({ planes });
    },
};

export default httpPlanes;
