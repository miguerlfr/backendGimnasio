import { Router } from 'express';
import httpProveedores from '../controllers/proveedores.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import helpersProveedores from '../helpers/proveedores.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get("/",
    [
      validarCampos,
      validarJWT
    ],
    httpProveedores.getProveedores
    
  );
  
  router.get('/activos',
    [
      validarCampos,
      validarJWT
    ],
    httpProveedores.getProveedoresActivos
  );
  
  router.get('/inactivos',
    [
      validarCampos,
      validarJWT
    ],
    httpProveedores.getProveedoresInactivos
  );
  
  router.get('/:id',
    [
      check('id', 'Se necesita un mongoId válido').isMongoId(),
      validarCampos,
      validarJWT
    ],
    httpProveedores.getProveedoresID
  );

router.post('/',
  [
    check('nombre', 'El nombre es requerido y no puede estar vacío').trim().notEmpty(),
    check("telefono", "El teléfono deben ser solo números y tener mínimo de 10 caracteres").optional().isNumeric().isLength({ min: 10 }),
    check('notas', 'El campo notas es requerido y no puede estar vacío').trim().notEmpty(),
    validarCampos,
    validarJWT
  ],
  httpProveedores.postProveedores
);

router.put('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    check('id').custom(async (idProveedor, { req }) => {
      await helpersProveedores.putId(idProveedor, req.body);
    }).optional(),
    check('nombre', 'El nombre es requerido y no puede estar vacío').trim().notEmpty(),
    check("telefono", "El teléfono deben ser solo números y tener mínimo de 10 caracteres").optional().isNumeric().isLength({ min: 10 }),
    check('notas', 'El campo notas es requerido y no puede estar vacío').trim().notEmpty(),
    validarCampos,
    validarJWT
  ],
  httpProveedores.putProveedores
);

router.put('/activar/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpProveedores.putProveedoresActivar
);

router.put('/inactivar/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpProveedores.putProveedoresInactivar
);

export default router;