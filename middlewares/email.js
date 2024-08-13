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
		text: `Utiliza el siguiente enlace para restablecer tu contraseña: \nhttp://localhost:5173/#/restablecer-contrasena?tokenP=${token}`,
	};

	try {
		await transporter.sendMail(emailRecuperacion);
		console.log("Correo de recuperación enviado exitosamente");
	} catch (error) {
		console.error("Error al enviar el correo de recuperación:", error);
		throw error;
	}
};
