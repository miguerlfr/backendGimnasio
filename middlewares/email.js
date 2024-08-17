import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const enviarEmailRecuperacion = async (email, token) => {
	const transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: "luismiguelvargasjaimes@gmail.com",
			pass: process.env.FROM_EMAIL,
		},
	});

	const emailRecuperacion = {
		from: "luismiguelvargasjaimes@gmail.com",
		to: email,
		subject: "Recuperación de contraseña",
		text: `Utiliza el siguiente enlace para restablecer tu contraseña: \nhttps://frontend-gimnasio.vercel.app/#/restablecer-contrasena?tokenP=${token}`,
	};

	try {
		await transporter.sendMail(emailRecuperacion);
		console.log("Correo de recuperación enviado exitosamente");
	} catch (error) {
		console.error("Error al enviar el correo de recuperación:", error);
		throw new Error('Error al enviar el correo de recuperación: ' + error.message);
	}
	
};

export const PlanClientePorTerminar = async (email, nombre, fechaVencimiento) => {
	const transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: "luismiguelvargasjaimes@gmail.com",
			pass: process.env.FROM_EMAIL,
		},
	});

	const emailCliente = {
		from: "luismiguelvargasjaimes@gmail.com",
		to: email,
		subject: "Tu plan está por vencer",
		text: `Hola ${nombre}, tu plan está por vencer el el ${(() => {
			fechaVencimiento.setDate(fechaVencimiento.getDate() + 1);
			return fechaVencimiento.toLocaleDateString('es-ES');
		})()}. ¡No olvides renovarlo para seguir con nosotros!`,
	};	
	
	try {
		await transporter.sendMail(emailCliente);
		console.log(`Correo enviado a: ${email}`);
	} catch (error) {
		console.error(`Error al enviar notificación de vencimiento de plan a ${email}:`, error);
		throw error;
	}
};

export const PlanClienteTerminado = async (email, nombre, fechaVencimiento) => {
	const transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: "luismiguelvargasjaimes@gmail.com",
			pass: process.env.FROM_EMAIL,
		},
	});

	const emailCliente = {
		from: "luismiguelvargasjaimes@gmail.com",
		to: email,
		subject: "Tu plan venció",
		text: `Hola ${nombre}, tu plan ha vencido hoy, el ${(() => {
			fechaVencimiento.setDate(fechaVencimiento.getDate() + 1);
			return fechaVencimiento.toLocaleDateString('es-ES');
		})()}. ¡No olvides renovarlo para seguir con nosotros!`,
	};	
	
	try {
		await transporter.sendMail(emailCliente);
		console.log(`Correo enviado a: ${email}`);
	} catch (error) {
        console.error(`Error al enviar notificaciones de vencimiento de plan a ${email}:`, error);
		throw error;
	}
};
