const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const { body } = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const validationMiddleware = require('../middleware/validationMiddleware')

router.post('/register', [
    body('email')
        .notEmpty().withMessage('Email не может быть пустым')
        .isEmail().withMessage('Введите корректный email адрес')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Пароль не может быть пустым')
        .isLength({ min: 8 }).withMessage('Пароль должен быть минимум 8 символов')
        .matches(/\d/).withMessage('Пароль должен содержать хотя бы одну цифру')
        .matches(/[a-z]/).withMessage('Пароль должен содержать хотя бы одну строчную букву')
        .matches(/[A-Z]/).withMessage('Пароль должен содержать хотя бы одну заглавную букву')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Пароль должен содержать хотя бы один спецсимвол')
], validationMiddleware, userController.registration)

router.post('/login', [
    body('email')
        .notEmpty().withMessage('Email не может быть пустым')
        .isEmail().withMessage('Введите корректный email адрес')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Пароль не может быть пустым')
], validationMiddleware, userController.login)


module.exports = router