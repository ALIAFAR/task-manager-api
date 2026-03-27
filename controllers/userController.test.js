// Мокаем модели
jest.mock('../models/models', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn()
    },
    Todo: {}
}))

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compareSync: jest.fn()
}))

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}))

jest.mock('../error/ApiError', () => {
    class MockApiError extends Error {
        constructor(status, message) {
            super(message);
            this.status = status;
            this.message = message;
            this.name = 'ApiError';
        }

        static badRequest(message) {
            return new MockApiError(400, message);
        }

        static internal(message) {
            return new MockApiError(500, message);
        }

        static unauthorized(message) {
            return new MockApiError(401, message);
        }
    }
    return MockApiError;
});

const userController = require('./userController');
const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('UserController', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();
        
        req = { body: {}, params: {}, query: {} };
        res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        next = jest.fn();
        
        process.env.SECRET_KEY = 'test_secret_key';
    });

    describe('registration', () => {
        it('registration - должен зарегистрировать нового пользователя', async () => {
            req.body = { email: 'test@mail.ru', password: 'Test123456!', role: 'USER' };
            
            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hash_pswrd');
            User.create.mockResolvedValue({ id: 1, email: 'test@mail.ru', password: 'hash_pswrd', role: 'USER' });
            jwt.sign.mockReturnValue('token');
            
            await userController.registration(req, res, next);
            
            expect(User.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Пользователь успешно зарегистрирован',
                    token: 'token'
                })
            );
        });

        it('registration - должен вернуть ошибку если email уже существует', async () => {
            req.body = { email: 'test@mail.ru', password: 'Test123456!' };
            
            User.findOne.mockResolvedValue({ id: 1, email: 'test@mail.ru' });
            
            await userController.registration(req, res, next);
            
            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({ status: 400, message: 'Пользователь с таким email уже существует' })
            );
            expect(User.create).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('login - успешно', async () => {
            req.body = { email: 'test@mail.ru', password: 'Test123456!' };
            
            const mockUser = { id: 1, email: 'test@mail.ru', password: 'hash_pswrd', role: 'USER' };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compareSync.mockReturnValue(true);
            jwt.sign.mockReturnValue('token');
            
            await userController.login(req, res, next);
            
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Успешный вход',
                    token: 'token'
                })
            );
        });

        it('login - должно возврщать ошибку если пользователь не найден', async () => {
            req.body = { email: 'test@mail.ru', password: 'Test123456!' };
            
            User.findOne.mockResolvedValue(null);
            
            await userController.login(req, res, next);
            
            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({ status: 400, message: 'Пользователь не найден' })
            );
        });

        it('login - должно возврщать ошибку если пароль неверный', async () => {
            req.body = { email: 'test@mail.ru', password: 'WrongPassword!' };
            
            User.findOne.mockResolvedValue({ id: 1, email: 'test@mail.ru', password: 'hash_pswrd' });
            bcrypt.compareSync.mockReturnValue(false);
            
            await userController.login(req, res, next);
            
            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({ status: 400, message: 'Неверный пароль' })
            );
            expect(jwt.sign).not.toHaveBeenCalled();
        });
    });
});