import mongoose from "mongoose";

const dbConexion = async () => {
    try {
        await mongoose.connect(process.env.CNX_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Conexion bd establecida");
    } catch (error) {
        console.log("Error al conectar la base de datos:", error);
    }
}

export default dbConexion;
