import Usuario from '../models/usuarios.js';
import bcryptjs from 'bcryptjs';
import { generarJWT } from '../middlewares/validar-jwt.js'

const httpUsuarios = {
	getUsuarios: async (req, res) => {
		const usuarios = await Usuario.find();
		res.json({ usuarios });
	},
	getUsuariosActivos: async (req, res) => {
		const usuariosAc = await Usuario.find({ estado: 1 });
		res.json({ usuariosAc });
	},
	getUsuariosInactivos: async (req, res) => {
		const usuariosIn = await Usuario.find({ estado: 0 });
		res.json({ usuariosIn });
	},
	getUsuariosID: async (req, res) => {
		const { id } = req.params;
		const usuario = await Usuario.findById(id);
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
	},
	putUsuarios: async (req, res) => {
		const { id } = req.params;
		const { sede, nombre, email, telefono, password, rol } = req.body;
		try {

			if (sede != undefined) {
				const usuarioS = await Usuario.findByIdAndUpdate(
					id,
					{ sede },
					{ new: true }
				);
				res.json({ usuarioS })
			} else if (nombre != undefined) {
				const usuarioN = await Usuario.findByIdAndUpdate(
					id,
					{ nombre },
					{ new: true }
				);
				res.json({ usuarioN });
			} else if (email != undefined) {
				const usuarioE = await Usuario.findByIdAndUpdate(
					id,
					{ email },
					{ new: true }
				);
				res.json({ usuarioE });
			} else if (telefono != undefined) {
				const usuarioT = await Usuario.findByIdAndUpdate(
					id,
					{ telefono },
					{ new: true }
				);
				res.json({ usuarioT });
			} else if (password != undefined) {
				const usuarioP = await Usuario.findByIdAndUpdate(
					id,
					{ password },
					{ new: true }
				);
				res.json({ usuarioP });
			} else if (rol != undefined) {
				const usuarioR = await Usuario.findByIdAndUpdate(
					id,
					{ rol },
					{ new: true }
				);
				res.json({ usuarioR });
			} else {
				res
					.status(200)
					.json({ error: "Ningún campo proporcionado para actualizar." });
			}

		} catch (error) {
			return res.status(404).json({ error: "ID del usuario no encontrado" });
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
