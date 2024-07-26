import { Router } from 'express';
import httpClientes from '../controllers/clientes.js';
import { check } from 'express-validator';
import helpersClientes from '../helpers/clientes.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

//   check('page', 'El parámetro "page" debe ser un número entero positivo').optional().isInt({ min: 1 }),
//   check('limit', 'El parámetro "limit" debe ser un número entero positivo').optional().isInt({ min: 1 }),

const router = Router();

router.get("/",
  [
    validarCampos,
    validarJWT
  ],
  httpClientes.getClientes
);

router.get('/activos',
  [
    validarCampos,
    validarJWT
  ],
  httpClientes.getClientesActivos
);

router.get('/inactivos',
  [
    validarCampos,
    validarJWT
  ],
  httpClientes.getClientesInactivos
);

router.get('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpClientes.getClientesID
);

router.get('/seguimiento/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpClientes.getClientesSeguimiento
);

router.get('/plan/:plan',
  [
    check('plan').custom(helpersClientes.getPlan),
    validarCampos,
    validarJWT
  ],
  httpClientes.getClientesPlan
);

router.get('/cumpleanos/:fecha',
  [
    check('fecha', 'La fecha debe ser una fecha válida').isISO8601().toDate(),
    check('fecha').custom(helpersClientes.getFechaCumpleaños),
    validarCampos,
    validarJWT
  ],
  httpClientes.getClientesCumpleaños
);

router.get('/ingresaron/:fecha',
  [
    check('fecha', 'La fecha debe ser una fecha válida').isISO8601().toDate(),
    check('fecha').custom(helpersClientes.getClientesIngresaron),
    validarCampos,
    validarJWT
  ],
  httpClientes.getClientesIngresaron
);

router.post('/',
  [
    check('nombre', 'El nombre es requerido y no puede estar vacío').trim().notEmpty(),
    check('fechaIngreso', 'La fecha de ingreso debe estar en formato ISO8601').optional().toDate(), //Fechas no necesitan trim
    check('documento').custom(helpersClientes.postDocumento).optional(),
    check('fechaNacimiento', 'La fecha de Nacimiento debe estar en formato ISO8601').optional().toDate(),
    check("telefono", "El teléfono debe ser un número de teléfono móvil válido").optional().isNumeric(),
    check('observaciones', 'Las observaciones no pueden estar vacío').optional().trim(),
    check('objetivo', 'El objetivo es requerido y no puede estar vacío').trim().notEmpty(),
    check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }),
    check('plan', 'El plan es requerido y no puede estar vacío').trim().notEmpty(),
    check('fechaVencimiento', 'La fecha de Vencimiento debe estar en formato ISO8601').optional().toDate(),
    check('seguimiento.*.fecha', 'La fecha del Seguimiento debe estar en formato ISO8601').optional().toDate(),
    check('seguimiento').optional().isArray().withMessage('Seguimiento debe ser un array'),
    check('seguimiento.*.peso').optional().isNumeric().withMessage('El campo peso debe ser un número válido'),
    check('seguimiento.*.brazo').optional().isNumeric().withMessage('El campo brazo debe ser un número válido'),
    check('seguimiento.*.pierna').optional().isNumeric().withMessage('El campo pierna debe ser un número válido'),
    check('seguimiento.*.cintura').optional().isNumeric().withMessage('El campo cintura debe ser un número válido'),
    check('seguimiento.*.estatura').optional().isNumeric().withMessage('El campo estatura (metros) debe ser un número válido'),
    validarCampos,
    validarJWT
  ],
  httpClientes.postClientes
);

router.put('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    check('id').custom(async (idCliente, { req }) => {
      await helpersClientes.putId(idCliente, req.body);
    }),
    check('nombre', 'El nombre no pueden estar vacío').optional().trim(),
    check('fechaIngreso', 'La fecha de ingreso debe estar en formato ISO8601').optional().isISO8601().toDate(),
    check('documento').optional().trim().custom((documento, { req }) => helpersClientes.putDocumento(documento, req.params.id)),
    check('fechaNacimiento', 'La fecha de Nacimiento debe estar en formato ISO8601').optional().isISO8601().toDate(),
    check("telefono", "El teléfono debe ser un número de teléfono móvil válido").optional().isNumeric(),
    check('objetivo', 'El objetivo no pueden estar vacío').optional().trim(),
    check('observaciones', 'Las observaciones no pueden estar vacío').optional().trim(),
    check('plan', 'El plan no pueden estar vacío').optional().trim(),
    check('fechaVencimiento', 'La fecha de Vencimiento debe estar en formato ISO8601').optional().toDate(),
    check('seguimiento.*.fecha', 'La fecha del Seguimiento debe estar en formato ISO8601').optional().isISO8601().toDate(),
    check('seguimiento').optional().isArray().withMessage('Seguimiento debe ser un array'),
    check('seguimiento.*.peso').optional().isNumeric().withMessage('El campo peso debe ser un número válido'),
    check('seguimiento.*.brazo').optional().isNumeric().withMessage('El campo brazo debe ser un número válido'),
    check('seguimiento.*.pierna').optional().isNumeric().withMessage('El campo pierna debe ser un número válido'),
    check('seguimiento.*.cintura').optional().isNumeric().withMessage('El campo cintura debe ser un número válido'),
    check('seguimiento.*.estatura').optional().isNumeric().withMessage('El campo estatura (metros) debe ser un número válido'),
    validarCampos,
    validarJWT
  ],
  httpClientes.putClientes
);

router.put('/activar/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpClientes.putClientesActivar
);

router.put('/inactivar/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    validarJWT
  ],
  httpClientes.putClientesInactivar
);

export default router;