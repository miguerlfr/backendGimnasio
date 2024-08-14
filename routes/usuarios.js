import { Router } from 'express';
import httpUsuarios from '../controllers/usuarios.js';
import { check } from 'express-validator';
import helpersUsuarios from '../helpers/usuarios.js';
import { validarCampos } from '../middlewares/validar-campos.js';
// import { validarJWTPassword } from '../middlewares/validar-jwt.js';
// import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get('/',
  [
    validarCampos,
    // validarJWT
  ],
  httpUsuarios.getUsuarios
);

router.get('/activos',
  [
    validarCampos,
    // validarJWT
  ],
  httpUsuarios.getUsuariosActivos
);

router.get('/inactivos',
  [
    validarCampos,
    // validarJWT
  ],
  httpUsuarios.getUsuariosInactivos
);

router.get('/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    // validarJWT
  ],
  httpUsuarios.getUsuariosID
);

router.post('/login',
  [
    validarCampos
  ],
  httpUsuarios.postUsuariosLogin
);

router.post('/',
  [
    check('sede', 'La sede es requerida').notEmpty(),
    check('sede').custom(helpersUsuarios.postputSede).optional(),
    check('nombre', 'El nombre es requerido').notEmpty(),
    check('email', 'El email es requerido y debe ser válido').notEmpty().isEmail(),
    check('email').custom(helpersUsuarios.postEmail).optional(),
    check("telefono", "El teléfono deben ser solo números y tener mínimo de 10 caracteres").optional().isNumeric().isLength({ min: 10 }),
    check('password', 'La contraseña es requerida y debe tener al menos 8 caracteres').notEmpty().isLength({ min: 8 }),
    check('rol').custom(helpersUsuarios.postputRol).optional(),
    check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }),
    validarCampos,
    // validarJWT
  ],
  httpUsuarios.postUsuarios
);

router.put('/:id',
  [
    check('id', 'Se necesita un ID válido').isMongoId(),
    check('id').custom(async (idUsuario, { req }) => {
      await helpersUsuarios.putId(idUsuario, req.body);
    }).optional(),
    check('sede').custom(helpersUsuarios.postputSede).optional(),
    check('email', 'Debe proporcionar un email válido').optional().isEmail(),
    check('email').optional().trim().custom((email, { req }) => helpersUsuarios.putEmail(email, req.params.id)),
    check("telefono", "El teléfono deben ser solo números y tener una longitud mínima de 10 caracteres").optional().isNumeric().isLength({ min: 10 }),
    check('password', 'La contraseña debe tener al menos 8 caracteres').optional().isLength({ min: 8 }),
    check('rol').custom(helpersUsuarios.postputRol).optional(),
    check('estado', 'El estado debe ser un número entero entre 0 y 1').optional().isInt({ min: 0, max: 1 }),
    validarCampos,
    // validarJWT
  ],
  httpUsuarios.putUsuarios
);

router.put('/activar/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    // validarJWT
  ],
  httpUsuarios.putUsuariosActivar
);

router.put('/inactivar/:id',
  [
    check('id', 'Se necesita un mongoId válido').isMongoId(),
    validarCampos,
    // validarJWT
  ],
  httpUsuarios.putUsuariosInactivar
);

router.put('/restablecer/contrasena',
  [
    // check('email', 'El correo electrónico es requerido y debe ser válido.').notEmpty().isEmail(),
  ],
  httpUsuarios.recuperarContrasena
);

router.put('/notificacion/token',
  // validarJWTPassword,
  httpUsuarios.contraseñaCambiada
)

router.put('/cambiar/contrasena/:token',
  httpUsuarios.putUsuariosContrasena
);

export default router;
