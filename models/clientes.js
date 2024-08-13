import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    fechaIngreso: { type: Date, default: Date.now },
    documento: { type: Number, unique: true, required: true },
    fechaNacimiento: { type: Date },
    edad: { type: Number },
    direccion: { type: String },
    email: { type: String },
    objetivo: { type: String, required: true },
    observaciones: { type: String },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plane",
        required: true,
    },
    fechaVencimiento: { type: Date },
    seguimiento: [
        {
            fecha: { type: Date, default: Date.now },
            peso: { type: Number },
            imc: { type: Number },
            estadoIMC: { type: String },
            brazo: { type: Number },
            pierna: { type: Number },
            cintura: { type: Number },
            estatura: { type: Number },
        }
    ],
    estado: { type: Number }
});

// Middleware para calcular la edad y fecha de vencimiento antes de guardar
// Middleware para calcular la edad y fecha de vencimiento antes de guardar
clienteSchema.pre('save', async function (next) {
    try {
        // Calcular la edad si fechaNacimiento está disponible
        if (this.fechaNacimiento) {
            const hoy = new Date();
            const nacimiento = new Date(this.fechaNacimiento);
            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const mes = hoy.getMonth() - nacimiento.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }
            this.edad = edad;
        }

        // Calcular fecha de vencimiento solo si plan y fechaIngreso están disponibles
        if (this.fechaIngreso && this.plan) {
            // Buscar el plan en la base de datos
            const Plan = mongoose.model('Plane'); // Asume que el modelo del plan se llama 'Plane'
            const plan = await Plan.findById(this.plan).exec();

            if (plan && plan.dias) {
                // Calcular fecha de vencimiento
                this.fechaVencimiento = new Date(this.fechaIngreso);
                this.fechaVencimiento.setDate(this.fechaVencimiento.getDate() + plan.dias);
            }
        }

        next();
    } catch (error) {
        next(error); // Pasa el error al middleware de manejo de errores
    }
});

// Método para calcular el IMC y estadoIMC
clienteSchema.methods.calcularIMC = function () {
    if (this.seguimiento && this.seguimiento.length > 0) {
        this.seguimiento.forEach((seg) => {
            const peso = parseFloat(seg.peso);
            const estatura = parseFloat(seg.estatura) / 100; // Convertir estatura a metros
            if (!isNaN(peso) && estatura > 0) {
                seg.imc = peso / estatura ** 2;
                if (seg.imc < 18.5) {
                    seg.estadoIMC = "Bajo peso";
                } else if (seg.imc >= 18.5 && seg.imc < 24.9) {
                    seg.estadoIMC = "Normal";
                } else if (seg.imc >= 25 && seg.imc < 29.9) {
                    seg.estadoIMC = "Sobrepeso";
                } else if (seg.imc >= 30 && seg.imc < 34.9) {
                    seg.estadoIMC = "Obesidad 1";
                } else if (seg.imc >= 35 && seg.imc < 39.9) {
                    seg.estadoIMC = "Obesidad 2";
                } else if (seg.imc >= 40) {
                    seg.estadoIMC = "Obesidad 3";
                }
            }
        });
    }
};

export default mongoose.model("Cliente", clienteSchema);

// Prefiero por Postman

// {
//     "nombre": "Laura Martinez",
//     "fechaIngreso": "2024-04-15T00:00:00.000Z",
//     "documento": 321654987,
//     "fechaNacimiento": "1992-03-25T00:00:00.000Z",
//     "direccion": "Calle 789, Ciudad",
//     "email": laura@gmail.com,
//     "objetivo": "Tonificar el cuerpo",
//     "observaciones": "Utilizar mas peso al levantar pierna",
//     "estado": 1,
//     "seguimiento": [
//         {
//             "fecha": "2024-05-05T00:00:00.000Z",
//             "peso": 60,
//             "brazo": 28,
//             "pierna": 53,
//             "cintura": 75,
//             "estatura": 1.50,
//         }
//     ]
// }

// {
//     "nombre": "Ana Garcia",
//     "fechaIngreso": "2024-04-25T00:00:00.000Z",
//     "documento": 456789123,
//     "fechaNacimiento": "1995-10-20T00:00:00.000Z",
//     "direccion": "Calle Principal, Ciudad",
//     "email": ana@gmail.com,
//     "objetivo": "Mejorar resistencia",
//     "observaciones": "Hacer más cardio",
//     "estado": 1,
//     "seguimiento": [
//         {
//             "fecha": "2024-05-03T00:00:00.000Z",
//             "peso": 70,
//             "brazo": 32,
//             "pierna": 57,
//             "cintura": 85,
//             "estatura": 1.50,
//         }
//     ]
// }

// {
//     "nombre": "Pedro Ramirez",
//     "fechaIngreso": "2024-04-20T00:00:00.000Z",
//     "documento": 789123456,
//     "fechaNacimiento": "1980-07-10T00:00:00.000Z",
//     "direccion": "Avenida 456, Ciudad",
//     "email": pedro@gmail.com,
//     "objetivo": "Mantener la forma física",
//     "observaciones": "Hacer cardio despues de entrenar",
//     "estado": 1,
//     "seguimiento": [
//         {
//             "fecha": "2024-05-04T00:00:00.000Z",
//             "peso": 75,
//             "brazo": 33,
//             "pierna": 58,
//             "cintura": 87,
//             "estatura": 1.50,
//         }
//     ]
// }

// {
//     "nombre": "Maria Lopez",
//     "fechaIngreso": "2024-04-28T00:00:00.000Z",
//     "documento": 987654321,
//     "fechaNacimiento": "1985-05-15T00:00:00.000Z",
//     "direccion": "Avenida Principal, Ciudad",
//     "email": maria@gmail.com,
//     "objetivo": "Ganar masa muscular",
//     "observaciones": "Comer mas grasas",
//     "estado": 1,
//     "seguimiento": [
//         {
//             "fecha": "2024-05-02T00:00:00.000Z",
//             "peso": 65,
//             "brazo": 30,
//             "pierna": 55,
//             "cintura": 80,
//             "estatura": 1.50,
//         }
//     ]
// }

// {
//     "nombre": "Juan Fernández",
//     "fechaIngreso": "2024-04-30T00:00:00.000Z",
//     "documento": 123456789,
//     "fechaNacimiento": "1990-01-01T00:00:00.000Z",
//     "direccion": "Calle 123, Ciudad",
//     "email": juan@gmail.com,
//     "objetivo": "Perder peso",
//     "observaciones": "Utilizar menos peso",
//     "estado": 1,
//     "seguimiento": [
//         {
//             "fecha": "2024-05-01T00:00:00.000Z",
//             "peso": 80,
//             "brazo": 35,
//             "pierna": 60,
//             "cintura": 90,
//             "estatura": 1.50,
//         }
//     ]
// }