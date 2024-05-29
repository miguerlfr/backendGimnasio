import { Router } from 'express';
import httpMaquinas from '../controllers/maquinas.js';
import { check } from 'express-validator';
import helpersMaquinas from '../helpers/maquinas.js';
import { validarCampos } from '../middlewares/validar-campos.js';
// import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get('/',
    [
        validarCampos,
        // validarJWT
    ],
    httpMaquinas.getMaquinas
);

router.get('/activos',
    [
        validarCampos,
        // validarJWT
    ],
    httpMaquinas.getMaquinasActivos
);

router.get('/inactivos',
    [
        validarCampos,
        // validarJWT
    ],
    httpMaquinas.getMaquinasInactivos
);

router.get('/:id',
    [
        check('id', 'Se necesita un mongoId válido').isMongoId(),
        validarCampos,
        // validarJWT
    ],
    httpMaquinas.getMaquinasID
);

router.post('/',
    [
        // check('codigo', 'El código es requerido').notEmpty(),
        // check('sede', 'La sede es requerida').notEmpty(),
        // check('sede').custom(helpersMaquinas.postputID).optional(),
        // check('fechaIngreso', 'La fecha de ingreso es requerida y debe estar en formato ISO8601').notEmpty().isISO8601().toDate(),
        // check('FechaUltMan', 'La fecha de la última mantención debe estar en formato ISO8601').optional().isISO8601().toDate(),
        check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }),
        validarCampos,
        // validarJWT
    ],
    httpMaquinas.postMaquinas
);

router.put('/:id',
    [
        // check('id', 'El id del mantenimiento es requerido y debe ser un MongoID válido.').isMongoId(),
        // check('sede').custom(helpersMaquinas.postputID).optional(),
        // check('fechaIngreso', 'La fecha de ingreso debe estar en formato ISO8601').optional().isISO8601().toDate(),
        // check('FechaUltMan', 'La fecha de la última mantención debe estar en formato ISO8601').optional().isISO8601().toDate(),
        // check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }),
        validarCampos,
        // validarJWT
    ],
    httpMaquinas.putMaquinas
);

router.put('/activar/:id',
    [
        check('id', 'Se necesita un mongoId válido').isMongoId(),
        validarCampos,
        // validarJWT
    ],
    httpMaquinas.putMaquinasActivar
);

router.put('/inactivar/:id',
    [
        check('id', 'Se necesita un mongoId válido').isMongoId(),
        validarCampos,
        // validarJWT
    ],
    httpMaquinas.putMaquinasInactivar
);

export default router;