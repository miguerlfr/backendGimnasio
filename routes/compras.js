import { Router } from 'express';
import httpCompras from '../controllers/compras.js';
import { check } from 'express-validator';
import helpersCompras from '../helpers/compras.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get('/',
  [
    validarCampos,
    validarJWT
  ],
  httpCompras.getCompras
);

router.get('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpCompras.getComprasID
);

router.get('/fechas/:fechaInicio/:fechaFin',
  [
    check('fechaInicio', 'La fecha de inicio es requerida.').notEmpty(),
    check('fechaInicio', 'La fecha de inicio debe ser una fecha válida.').toDate(),
    check('fechaFin', 'La fecha de fin es requerida.').notEmpty(),
    check('fechaFin', 'La fecha de fin debe ser una fecha válida.').toDate(),
    validarCampos,
    validarJWT
  ], httpCompras.getComprasFechas
);

router.post('/',
  [
    check('codigoProducto', 'El Producto es requerido').notEmpty(),
    check('codigoProducto').custom(async (codigoProducto, { req }) => {
      await helpersCompras.postCodigoPto(codigoProducto, req.body.valorUnitario, req.body.cantidad);
    }),
    check('cantidad', 'La cantidad es requerida y debe ser numérico').notEmpty().isNumeric(),
    validarCampos,
    validarJWT
  ],
  httpCompras.postCompras
);

router.put('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    check('id').custom(async (idCompra, { req }) => {
      await helpersCompras.putId(idCompra, req.body);
    }),
    check('id').custom(async (idCompra, { req }) => {
      await helpersCompras.actualizarCompra(idCompra, req.body);
    }),
    check('cantidad', 'La cantidad debe ser numérico').optional().isNumeric(),
    validarCampos,
    validarJWT
  ],
  httpCompras.putCompras
);

export default router;