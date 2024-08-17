import { Router } from 'express';
import httpVentas from '../controllers/ventas.js';
import { check } from 'express-validator';
import helpersVentas from '../helpers/ventas.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get('/',
  [
    validarCampos,
    validarJWT
  ],
  httpVentas.getVentas
);

router.get('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpVentas.getVentasID
);

router.get('/fechas/:fechaInicio/:fechaFin',
  [
    check('fechaInicio', 'La fecha de inicio es requerida.').notEmpty(),
    check('fechaInicio', 'La fecha de inicio debe ser una fecha válida.').toDate(),
    check('fechaFin', 'La fecha de fin es requerida.').notEmpty(),
    check('fechaFin', 'La fecha de fin debe ser una fecha válida.').toDate(),
    validarCampos,
    validarJWT
  ], httpVentas.getVentasFechas
);

router.post('/',
  [
    check('codigoProducto', 'El Producto es requerido').notEmpty(),
    check('codigoProducto').custom(async (codigoProducto, { req }) => {
      await helpersVentas.postCodigoPto(codigoProducto, req.body.valorUnitario, req.body.cantidad);
    }),
    check('cantidad', 'La cantidad es requerida y debe ser numérico').notEmpty().isNumeric(),
    validarCampos,
    validarJWT
  ],
  httpVentas.postVentas
);

router.put('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    check('id').custom(async (idVenta, { req }) => {
      await helpersVentas.putId(idVenta, req.body);
    }),
    check('id').custom(async (idVenta, { req }) => {
      await helpersVentas.actualizarVenta(idVenta, req.body);
    }),
    check('cantidad', 'La cantidad debe ser numérico').optional().isNumeric(),
    validarCampos,
    validarJWT
  ],
  httpVentas.putVentas
);

export default router;