const ApiError = require('../error/ApiError')
const { User, Todo } = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') 

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password, role } = req.body
            
            if (!email || !password) {
                return next(ApiError.badRequest('Email и пароль обязательны'))
            }
            
            const candidate = await User.findOne({ where: { email } })
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }
            
            const hashPassword = await bcrypt.hash(password, 5)
            
            // Создание пользователя
            const user = await User.create({
                email,
                password: hashPassword,
                role: role || 'USER'
            })
            
            const token = generateJwt(user.id, user.email, user.role)
            
            return res.status(201).json({
                message: 'Пользователь успешно зарегистрирован',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            })
        } catch (error) {
            next(ApiError.internal(error.message))
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            
            if (!email || !password) {
                return next(ApiError.badRequest('Email и пароль обязательны'))
            }
            
            const user = await User.findOne({ where: { email } })
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'))
            }
            
            const comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.badRequest('Неверный пароль'))
            }
            
            const token = generateJwt(user.id, user.email, user.role)
            
            return res.json({
                message: 'Успешный вход',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            })
        } catch (error) {
            next(ApiError.internal(error.message))
        }
    }

}

module.exports = new UserController()