import Usuario from '../models/usuarios.js';
import bcryptjs from 'bcryptjs';
import { generarJWT } from '../middlewares/validar-jwt.js'

const httpUsuarios = {
	getUsuarios: async (req, res) => {
		const usuarios = await Usuario.find().populate('sede', 'nombre');
		res.json({ usuarios });
	},
	getUsuariosActivos: async (req, res) => {
		const usuariosAc = await Usuario.find({ estado: 1 }).populate('sede', 'nombre');
		res.json({ usuariosAc });
	},
	getUsuariosInactivos: async (req, res) => {
		const usuariosIn = await Usuario.find({ estado: 0 }).populate('sede', 'nombre');
		res.json({ usuariosIn });
	},
	getUsuariosID: async (req, res) => {
		const { id } = req.params;
		const usuario = await Usuario.findById(id).populate('sede', 'nombre');
		res.json({ usuario })
	},
	postUsuariosLogin: async (req, res) => {
		const { email, password } = req.body;
		// console.log(email, password);
		try {
			const user = await Usuario.findOne({ email });
			// console.log(user);
			if (!user) {
				return res.status(401).json({
					msg: 'Usuario / Password no son correctos.',
				});
			}

			if (user.estado === 0) {
				return res.status(401).json({
					msg: 'Usuario desactivado.',
				});
			}

			// // Verificación del rol del usuario
			// if (user.rol !== 'Admin' || user.rol !== 'Recepcionista' || user.rol !== 'User') {
			// 	return res.status(401).json({
			// 		msg: 'No tienes permisos para iniciar sesión.',
			// 	});
			// }

			// password: contraseña digitada en el login  
			// user.password: contraseña del usuario de la BaseDatos
			const validPassword = bcryptjs.compareSync(password, user.password);
			if (!validPassword) {
				return res.status(401).json({
					msg: 'Usuario / Password no son correctos.',
				});
			}

			const token = await generarJWT(user._id);
			res.json({
				usuario: user,
				token,
			});

		} catch (error) {
			console.log(error);
			return res.status(500).json({
				msg: 'Hable con su WebMaster.',
			});
		}
	},
	postUsuarios: async (req, res) => {
		try {
					const { sede, nombre, email, telefono, password, rol, estado } =
			req.body;
		const usuario = new Usuario({
			sede,
			nombre,
			email,
			telefono,
			password,
			rol,
			estado
		});
		const salt = bcryptjs.genSaltSync();
		usuario.password = bcryptjs.hashSync(password, salt);
		await usuario.save();
		res.json({
			usuario
		});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				msg: 'Error.', error
			});
		}
	},
	putUsuarios: async (req, res) => {
		const { id } = req.params;
		const { sede, nombre, email, telefono, password, rol } = req.body;

		try {
			const updateFields = {};

			if (sede !== undefined) updateFields.sede = sede;
			if (nombre !== undefined) updateFields.nombre = nombre;
			if (email !== undefined) updateFields.email = email;
			if (telefono !== undefined) updateFields.telefono = telefono;
			if (rol !== undefined) updateFields.rol = rol;

			if (password !== undefined) {
				const salt = bcryptjs.genSaltSync();
				updateFields.password = bcryptjs.hashSync(password, salt);
			}

			const usuario = await Usuario.findByIdAndUpdate(id, updateFields, { new: true });

			if (!usuario) {
				return res.status(404).json({ error: "ID del usuario no encontrado" });
			}

			return res.json({ usuario });

		} catch (error) {
			return res.status(500).json({ error: "Error al actualizar el usuario" });
		}
	},
	putUsuariosActivar: async (req, res) => {
		const { id } = req.params;
		const usuario = await Usuario.findByIdAndUpdate(
			id,
			{ estado: 1 },
			{ new: true }
		);
		res.json({ usuario });
	},
	putUsuariosInactivar: async (req, res) => {
		const { id } = req.params;
		const usuario = await Usuario.findByIdAndUpdate(
			id,
			{ estado: 0 },
			{ new: true }
		);
		res.json({ usuario });
	},
};

export default httpUsuarios;
