import { Router } from 'express';
import httpMaquinas from '../controllers/maquinas.js';
import { check } from 'express-validator';
import helpersMaquinas from '../helpers/maquinas.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get('/',
    [
        validarCampos,
        validarJWT
    ],
    httpMaquinas.getMaquinas
);

router.get('/activos',
    [
        validarCampos,
        validarJWT
    ],
    httpMaquinas.getMaquinasActivos
);

router.get('/inactivos',
    [
        validarCampos,
        validarJWT
    ],
    httpMaquinas.getMaquinasInactivos
);

router.get('/:id',
    [
        check('id', 'Se necesita un mongoId válido').isMongoId(),
        validarCampos,
        validarJWT
    ],
    httpMaquinas.getMaquinasID
);

router.post('/',
    [
        check('codigo', 'El código es requerido').notEmpty(),
        check('codigo').custom(helpersMaquinas.postCodigo).optional(),
        check('sede', 'La sede es requerida').notEmpty(),
        check('sede').custom(helpersMaquinas.postputID).optional(),
        check('fechaIngreso', 'La fecha de ingreso es requerida y debe estar en formato ISO8601').notEmpty().toDate(),
        check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }),
        validarCampos,
        validarJWT
    ],
    httpMaquinas.postMaquinas
);

router.put('/:id',
    [
        check('id', 'El id del mantenimiento es requerido y debe ser un MongoID válido.').isMongoId(),
        check('id').custom(async (idMaquina, { req }) => {
            await helpersMaquinas.putId(idMaquina, req.body);
        }),
        check('codigo').optional().trim().custom((codigo, { req }) => helpersMaquinas.putCodigo(codigo, req.params.id)),
        check('sede').custom(helpersMaquinas.postputID).optional(),
        check('fechaIngreso', 'La fecha de ingreso debe estar en formato ISO8601').optional().toDate(),
        check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }),
        validarCampos,
        validarJWT
    ],
    httpMaquinas.putMaquinas
);

router.put('/activar/:id',
    [
        check('id', 'Se necesita un mongoId válido').isMongoId(),
        validarCampos,
        validarJWT
    ],
    httpMaquinas.putMaquinasActivar
);

router.put('/inactivar/:id',
    [
        check('id', 'Se necesita un mongoId válido').isMongoId(),
        validarCampos,
        validarJWT
    ],
    httpMaquinas.putMaquinasInactivar
);

export default router;