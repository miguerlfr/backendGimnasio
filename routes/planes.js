import { Router } from 'express';
import httpPlanes from '../controllers/planes.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get('/',
  [
    validarCampos,
    validarJWT
  ],
  httpPlanes.getPlanes
);

router.get('/activos',
  [
    validarCampos,
    validarJWT
  ],
  httpPlanes.getPlanesActivos
);

router.get('/inactivos',
  [
    validarCampos,
    validarJWT
  ],
  httpPlanes.getPlanesInactivos
);

router.get('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpPlanes.getPlanesID
);

router.post('/',
  [
    // check('codigo', 'El código es requerido y debe ser tipo texto').optional().isString(),
    // check('descripcion', 'La descripción debe ser tipo texto').optional().isString(),
    // check('valor', 'El valor debe ser numérico').optional().isNumeric(),
    // check('dias', 'Los días deben ser numéricos').optional().isNumeric(),
    // check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }), validarCampos,
    validarCampos,
    validarJWT
  ],
  httpPlanes.postPlanes
);

router.put('/:id',
  [
    // check('id', 'Se necesita un mongoId válido').isMongoId(),
    // check('codigo', 'El código es requerido y debe ser tipo texto').optional().isString(),
    // check('descripcion', 'La descripción debe ser tipo texto').optional().isString(),
    // check('valor', 'El valor debe ser numérico').optional().isNumeric(),
    // check('dias', 'Los días deben ser numéricos').optional().isNumeric(),
    // check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }),
    validarCampos,
    validarJWT
  ],
  httpPlanes.putPlanes
);

router.put('/activar/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpPlanes.putPlanesActivar
);

router.put('/inactivar/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpPlanes.putPlanesInactivar
);

export default router;