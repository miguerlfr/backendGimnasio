import { Router } from "express";
import httpPagos from "../controllers/pagos.js";
import { check } from "express-validator";
// import helpersPagos from '../helpers/pagos.js';
import { validarCampos } from "../middlewares/validar-campos.js";
// import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/",
  [
    validarCampos,
    // validarJWT
  ],
  httpPagos.getPagos
);

router.get("/activos",
  [
    validarCampos,
    // validarJWT
  ],
  httpPagos.getPagosActivos
);

router.get("/inactivos",
  [
    validarCampos,
    // validarJWT
  ],
  httpPagos.getPagosInactivos
);

router.get("/:id",
  [
    check("id", "Se necesita un mongoId válido").isMongoId(),
    validarCampos,
    // validarJWT
  ],
  httpPagos.getPagosID
);

router.get("/fecha/:fecha",
  [
    validarCampos,
    // validarJWT
  ],
  httpPagos.getPagosFecha
);

router.get("/pago/:plan",
  [
    // validarCampos,
    // validarJWT
  ],
  httpPagos.getPagosPlan
);

router.get("/pagoo/:cliente",
  [
    check('cliente', 'Se necesita un mongoId válido en el campo del cliente').isMongoId(),
    validarCampos,
    // validarJWT
  ],
  httpPagos.getPagosCliente
);

router.post("/",
  [
    // check("cliente", "El cliente es requerido").notEmpty(),
    // check('cliente', 'El cliente debe ser un ID de MongoID válido').optional().isMongoId(),
    // check('cliente').custom(helpersPagos.postPutId).optional(),
    // check("plan", "El plan es requerido").notEmpty(),
    // check("plan").optional(helpersPagos.postPutPlan).optional(),
    // check("fecha", "La fecha es requerida y debe estar en formato ISO8601").notEmpty().isISO8601().toDate(),
    // check("valor", "El valor debe ser numérico").notEmpty().isNumeric(),
    // check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }),    
    validarCampos,
    // validarJWT
  ],
  httpPagos.postPagos
);

router.put("/:id",
  [
    // check("id", "Se necesita un mongoId válido").isMongoId(),
    // check('cliente', 'El cliente debe ser un ID de MongoID válido').optional().isMongoId(),
    // check('cliente').custom(helpersPagos.postPutId).optional(),
    // check("plan").optional(helpersPagos.postPutPlan).optional(),
    // check("fecha", "La fecha es requerida y debe estar en formato ISO8601").optional().isISO8601().toDate(),
    // check("valor", "El valor debe ser numérico").optional().isNumeric(),
    // check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }),
    validarCampos,
    // validarJWT
  ],
  httpPagos.putPagos
);

router.put("/activar/:id",
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    // validarJWT
  ],
  httpPagos.putPagosActivar
);

router.put("/inactivar/:id",
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    // validarJWT
  ],
  httpPagos.putPagosInactivar
);

export default router;