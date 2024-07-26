import { Router } from 'express';
import httpIngresos from '../controllers/ingresos.js';
import { check } from 'express-validator';
import helpersIngresos from '../helpers/ingresos.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get('/',
  [
    validarCampos,
    validarJWT
  ],
  httpIngresos.getIngresos
);

router.get('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpIngresos.getIngresosID
);

router.get('/fechas/:fechaInicio/:fechaFin',
  [
    check('fechaInicio', 'La fecha de inicio es requerida.').notEmpty(),
    check('fechaInicio', 'La fecha de inicio debe ser una fecha válida.').isISO8601().toDate(),
    check('fechaFin', 'La fecha de fin es requerida.').notEmpty(),
    check('fechaFin', 'La fecha de fin debe ser una fecha válida.').isISO8601().toDate(),
    validarCampos,
    validarJWT
  ],
  httpIngresos.getIngresosFechas
);

router.post('/',
  [
    check('fecha', 'La fecha es requerida y debe estar en formato ISO8601').toDate(),
    check('sede', 'La sede es requerida').notEmpty(),
    check('sede').custom(helpersIngresos.postPutSede).optional(),
    check('cliente', 'El ID del cliente es requerido').notEmpty(),
    check('cliente', 'Se necesita que el ID del cliente sea un mongoId válido').isMongoId(),
    check('cliente').custom(helpersIngresos.postPutCliente).optional(),
    // check('sede').custom((sede, { req }) => helpersIngresos.postSedeCliente(sede, req.body.cliente)).optional(),
    validarCampos,
    validarJWT
  ],
  httpIngresos.postIngresos
);

router.put('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    check('id').custom(async (idIngreso, { req }) => {
      await helpersIngresos.putId(idIngreso, req.body);
    }),
    check('fecha', 'La fecha debe estar en formato ISO8601').optional().isISO8601().toDate(),
    check('sede').custom(helpersIngresos.postPutSede).optional(),
    // check('sede', 'Se necesita que en el campo de sede haya un mongoId válido').isMongoId().optional(),
    // check('sede').custom((sede, { req }) => helpersIngresos.postSedeCliente(sede, req.body.cliente)).optional(),
    // check('cliente', 'Se necesita un cliente con el mongoId válido').isMongoId().optional(),
    check('cliente').custom(helpersIngresos.postPutCliente).optional(),
    validarCampos,
    validarJWT
  ],
  httpIngresos.putIngresos
);

export default router;