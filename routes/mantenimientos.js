import { Router } from 'express';
import httpMantenimientos from '../controllers/mantenimientos.js';
import { check } from 'express-validator';
import helpersMantenimientos from '../helpers/mantenimientos.js';
import { validarCampos } from '../middlewares/validar-campos.js';
// import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get('/',
  [
    validarCampos,
    // validarJWT
  ],
  httpMantenimientos.getMantenimientos
);

router.get('/activos',
  [
    validarCampos,
    // validarJWT
  ],
  httpMantenimientos.getMantenimientosActivos
);

router.get('/inactivos',
  [
    validarCampos,
    // validarJWT
  ],
  httpMantenimientos.getMantenimientosInactivos
);

router.get('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    // validarJWT
  ],
  httpMantenimientos.getMantenimientosID
);

router.get('/fechas/:fechaInicio/:fechaFin',
  [
    validarCampos,
    // validarJWT
  ],
  httpMantenimientos.getMantenimientosFechas
);

router.post('/',
  [
    check('idMaquina', 'El idMaquina es requerido').notEmpty(),
    check('idMaquina', 'Se necesita que el idMaquina sea un mongoId válido').optional().isMongoId(),
    check('idMaquina').custom(helpersMantenimientos.postPutMaquina).optional(),
    check('fecha', 'La fecha debe estar en formato ISO8601').optional().toDate(),
    check('descripcion', 'La descripción debe ser tipo texto').optional().isString(),
    check('responsable', 'El responsable es requerido').notEmpty(),
    check('precio', 'El precio debe ser numérico y no puede estar vacío').optional().isNumeric(),
    check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }),
    validarCampos,
    // validarJWT
  ],
  httpMantenimientos.postMantenimientos
);

router.put('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    check('id').custom(async (idMantenimiento, { req }) => {
      await helpersMantenimientos.putId(idMantenimiento, req.body);
    }),
    check('idMaquina', 'El ID de la máquina debe ser un ID de MongoID válido').optional().isMongoId(),
    check('idMaquina').custom(helpersMantenimientos.postPutMaquina).optional(),
    check('fecha', 'La fecha debe estar en formato ISO8601').optional().toDate(),
    check('descripcion', 'La descripción debe ser tipo texto').optional().isString(),
    check('precio', 'El precio debe ser numérico y no puede estar vacío').optional().isNumeric(),
    check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }),
    validarCampos,
    // validarJWT
  ],
  httpMantenimientos.putMantenimientos
);

router.put('/activar/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    // validarJWT
  ],
  httpMantenimientos.putMantenimientosActivar
);

router.put('/inactivar/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    // validarJWT
  ],
  httpMantenimientos.putMantenimientosInactivar
);

export default router;