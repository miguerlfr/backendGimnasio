import Maquina from '../models/maquinas.js';

const httpMaquinas = {
    getMaquinas: async (req, res) => {
        const maquinas = await Maquina.find().populate('sede', 'nombre');
        res.json({ maquinas });
    },
    getMaquinasActivos: async (req, res) => {
        const maquinasAc = await Maquina.find({ estado: 1 }).populate('sede', 'nombre');
        res.json({ maquinasAc });
    },
    getMaquinasInactivos: async (req, res) => {
        const maquinasIn = await Maquina.find({ estado: 0 }).populate('sede', 'nombre');
        res.json({ maquinasIn });
    },
    getMaquinasID: async (req, res) => {
        const { id } = req.params;
        const maquina = await Maquina.findById(id).populate('sede', 'nombre');
        res.json({ maquina });
    },
    postMaquinas: async (req, res) => {
        const { codigo, sede, descripcion, fechaIngreso, fechaUltMan, estado } =
            req.body;
        const maquinas = new Maquina({
            codigo,
            sede,
            descripcion,
            fechaIngreso,
            fechaUltMan,
            estado
        });
        await maquinas.save();
        res.json({ maquinas });
    },
    putMaquinas: async (req, res) => {
        const { id } = req.params;
        const { codigo, sede, descripcion, fechaIngreso, fechaUltMan } = req.body;
        try {
            const updateFields = {};
    
            if (codigo !== undefined) updateFields.codigo = codigo;
            if (sede !== undefined) updateFields.sede = sede;
            if (descripcion !== undefined) updateFields.descripcion = descripcion;
            if (fechaIngreso !== undefined) updateFields.fechaIngreso = fechaIngreso;
            if (fechaUltMan !== undefined) updateFields.fechaUltMan = fechaUltMan;
    
            if (Object.keys(updateFields).length === 0) {
                return res.status(400).json({ error: "Ningún campo proporcionado para actualizar." });
            }
    
            const maquinaActualizada = await Maquina.findByIdAndUpdate(
                id,
                updateFields,
                { new: true }
            );
    
            if (!maquinaActualizada) {
                return res.status(404).json({ error: "ID de la Máquina no encontrado" });
            }
    
            res.json({ maquinaActualizada });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar la máquina" });
        }
    },    
    putMaquinasActivar: async (req, res) => {
        const { id } = req.params;
        const maquinas = await Maquina.findByIdAndUpdate(
            id,
            { estado: 1 },
            { new: true }
        );
        res.json({ maquinas });
    },
    putMaquinasInactivar: async (req, res) => {
        const { id } = req.params;
        const maquinas = await Maquina.findByIdAndUpdate(
            id,
            { estado: 0 },
            { new: true }
        );
        res.json({ maquinas });
    },
};

export default httpMaquinas;
