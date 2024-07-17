import { Router } from 'express';
import httpVentas from '../controllers/ventas.js';
import { check } from 'express-validator';
import helpersVentas from '../helpers/ventas.js';
import { validarCampos } from '../middlewares/validar-campos.js';
// import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get('/',
  [
    validarCampos,
    // validarJWT
  ],
  httpVentas.getVentas
);

router.get('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    // validarJWT
  ],
  httpVentas.getVentasID
);

router.post('/',
  [
    check('fecha', 'La fecha debe estar en formato válido').optional().toDate(),
    check('codigoProducto', 'El código del producto es requerido').notEmpty(),
    check('codigoProducto').custom(async (codigoProducto, { req }) => {
      await helpersVentas.postPutCodigoPto(codigoProducto, req.body.valorUnitario, req.body.cantidad);
    }),
    check('valorUnitario', 'El valor unitario es requerido y debe ser numérico').notEmpty().isNumeric(),
    check('cantidad', 'La cantidad es requerida y debe ser numérico').notEmpty().isNumeric(),
    check('valorTotal', 'El valor total es requerido y debe ser numérico').notEmpty().isNumeric(),
    validarCampos,
    // validarJWT
  ],
  httpVentas.postVentas
);

router.put('/:id',
  [
    check('id').custom(async (idVenta) => {
      await helpersVentas.validateUndoVenta(idVenta);
    }),
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    check('fecha', 'La fecha debe estar en formato válido').optional().isISO8601().toDate(),
    check('codigoProducto').custom(async (codigoProducto, { req }) => {
      await helpersVentas.postPutCodigoPto(codigoProducto, req.body.valorUnitario, req.body.cantidad);
    }),
    check('valorUnitario', 'El valor unitario debe ser numérico').optional().isNumeric(),
    check('cantidad', 'La cantidad debe ser numérico').optional().isNumeric(),
    check('valorTotal', 'El valor total debe ser numérico').optional().isNumeric(),
    validarCampos,
    // validarJWT
  ],
  httpVentas.putVentas
);

export default router;