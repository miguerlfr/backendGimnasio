import { Router } from "express";
import httpSedes from "../controllers/sedes.js";
import { check } from "express-validator";
import helpersSedes from '../helpers/sedes.js';
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get("/",
  [
    validarCampos,
    validarJWT
  ],
  httpSedes.getSedes
);

router.get("/activos",
  [
    validarCampos,
    validarJWT
  ],
  httpSedes.getSedesActivos
);

router.get("/inactivos",
  [
    validarCampos,
    validarJWT
  ],
  httpSedes.getSedesInactivos
);

router.get("/:id",
  [
    check("id", "Se necesita un mongoId válido").isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpSedes.getSedesID
);

router.post("/",
  [
    check("nombre", "El nombre es requerido").notEmpty(),
    check("codigo", "El código es requerido").notEmpty(),
    check('codigo').custom(helpersSedes.postCodigo).optional(),
    check("telefono", "El teléfono debe ser un número de teléfono móvil válido").optional().isMobilePhone("any", { strictMode: false }),
    check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }),
    validarCampos,
    validarJWT
  ],
  httpSedes.postSedes
);

router.put("/:id",
  [
    check("id", "Se necesita un ID válido").isMongoId(),
    check('id').custom(async (idSede, { req }) => {
      // Pasa el id y los datos del body a la función putId
      await helpersSedes.putId(idSede, req.body);
    }).optional(),
    check('codigo').optional().trim().custom((codigo, { req }) => helpersSedes.putCodigo(codigo, req.params.id)),
    check("telefono", "El teléfono debe ser un número de teléfono móvil válido").optional().isMobilePhone("any", { strictMode: false }),
    check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }),
    validarCampos,
    validarJWT
  ],
  httpSedes.putSedes
);

router.put("/activar/:id",
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpSedes.putSedesActivar
);

router.put("/inactivar/:id",
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpSedes.putSedesInactivar
);

export default router;