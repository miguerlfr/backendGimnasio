import { Router } from 'express';
import httpProductos from '../controllers/productos.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
// import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get('/',
  [
    validarCampos,
    // validarJWT
  ],
  httpProductos.getProductos
);

router.get('/activos',
  [
    validarCampos,
    // validarJWT
  ],
  httpProductos.getProductosActivos
);

router.get('/inactivos',
  [
    validarCampos,
    // validarJWT
  ],
  httpProductos.getProductosInactivos
);

router.get('/total',
  [
    validarCampos,
    // validarJWT
  ],
  httpProductos.getProductosTotal
);

router.get('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    // validarJWT
  ],
  httpProductos.getProductosID
);

router.post('/',
  [
    // check('codigo', 'El código es requerido y debe ser tipo texto').notEmpty().isString(),
    // check('descripcion', 'La descripción debe ser tipo texto').optional().isString(),
    // check('valor', 'El valor es requerido y debe ser numérico').notEmpty().isNumeric(),
    // check('cantidad', 'La cantidad es requerido y debe ser numérica').notEmpty().isNumeric(),
    validarCampos,
    // validarJWT
  ],
  httpProductos.postProductos
);

router.put('/:id',
  [
    // check('id', 'Se necesita un mongoId válido').isMongoId(),
    // check('codigo', 'El código es requerido y debe ser tipo texto').optional().isString(),
    // check('descripcion', 'La descripción debe ser tipo texto').optional().isString(),
    // check('valor', 'El valor debe ser numérico').optional().isNumeric(),
    // check('cantidad', 'La cantidad debe ser numérica').optional().isNumeric(),
    validarCampos,
    // validarJWT
  ],
  httpProductos.putProductos
);

router.put('/activar/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    // validarJWT
  ],
  httpProductos.putProductosActivar
);

router.put('/inactivar/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    // validarJWT
  ],
  httpProductos.putProductosInactivar
);

export default router;