import Maquina from '../models/maquinas.js';

const httpMaquinas = {
    getMaquinas: async (req, res) => {
        const maquinas = await Maquina.find();
        res.json({ maquinas });
    },
    getMaquinasActivos: async (req, res) => {
        const maquinasAc = await Maquina.find({ estado: 1 });
        res.json({ maquinasAc });
    },
    getMaquinasInactivos: async (req, res) => {
        const maquinasIn = await Maquina.find({ estado: 0 });
        res.json({ maquinasIn });
    },
    getMaquinasID: async (req, res) => {
        const { id } = req.params;
        const maquina = await Maquina.findById(id);
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
            if (codigo != undefined) {
                const maquinaC = await Maquina.findByIdAndUpdate(
                    id,
                    { codigo },
                    { new: true }
                );
                res.json({ maquinaC });
            } else if (sede != undefined) {
                const maquinaS = await Maquina.findByIdAndUpdate(
                    id,
                    { sede },
                    { new: true }
                );
                res.json({ maquinaS });
            } else if (descripcion != undefined) {
                const maquinaD = await Maquina.findByIdAndUpdate(
                    id,
                    { descripcion },
                    { new: true }
                );
                res.json({ maquinaD });
            } else if (fechaIngreso != undefined) {
                const maquinaFI = await Maquina.findByIdAndUpdate(
                    id,
                    { fechaIngreso },
                    { new: true }
                );
                res.json({ maquinaFI });
            } else if (fechaUltMan != undefined) {
                const maquinaFUM = await Maquina.findByIdAndUpdate(
                    id,
                    { fechaUltMan },
                    { new: true }
                );
                res.json({ maquinaFUM });
            } else {
                res
                    .status(200)
                    .json({ error: "Ningún campo proporcionado para actualizar." });
            }
        } catch (error) {
            res.status(500).json({ error: "ID de la Máquina no encontrado" });
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
