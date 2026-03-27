jest.mock('../models/models', () => ({
    Todo: {
        findAll: jest.fn(),
        create: jest.fn(),
        findOne: jest.fn(),
        destroy: jest.fn()
    }
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
            return new MockApiError(404, message);
        }

        static internal(message) {
            return new MockApiError(500, message);
        }

        static forbidden(message) {
            return new MockApiError(303, message);
        }
    }

    return MockApiError;
});

const todoController = require('./todoController')
const { Todo } = require('../models/models')

describe('TodoController Tests', () => {
    let req, res, next

    beforeEach(() => {
        jest.clearAllMocks()
        
        req = {
            user: { id: 1 },
            body: {},
            params: {}
        }
        
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        }
        
        next = jest.fn()
    })

    test('getAll - должен вернуть все задачи пользователя', async () => {
        const mockTodos = [
            { id: 1, title: 'Задача 1', userId: 1 },
            { id: 2, title: 'Задача 2', userId: 1 }
        ]
        
        Todo.findAll.mockResolvedValue(mockTodos)
        
        await todoController.getAll(req, res, next)
        
        expect(Todo.findAll).toHaveBeenCalledWith({ where: { userId: 1 } })
        expect(res.json).toHaveBeenCalledWith(mockTodos)
    })

    test('create - должен создать новую задачу', async () => {
        req.body = {
            title: 'Новая задача',
            description: 'Описание'
        }
        
        const mockTodo = {
            id: 1,
            title: 'Новая задача',
            description: 'Описание',
            todo_status: false,
            userId: 1
        }
        
        Todo.create.mockResolvedValue(mockTodo)
        
        await todoController.create(req, res, next)
        
        expect(Todo.create).toHaveBeenCalledWith({
            title: 'Новая задача',
            description: 'Описание',
            todo_status: false,
            userId: 1
        })
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(mockTodo)
    })

    test('create - должен вернуть ошибку если нет title', async () => {
        req.body = {
            description: 'Описание'
        }
        
        await todoController.create(req, res, next)
        
        expect(next).toHaveBeenCalled()
        expect(Todo.create).not.toHaveBeenCalled()
    })


    test('update_status - должен переключить статус задачи', async () => {
        req.params = { id: '1' }
        
        const mockTodo = {
            id: 1,
            title: 'Задача',
            todo_status: false,
            save: jest.fn().mockResolvedValue(true)
        }
        
        Todo.findOne.mockResolvedValue(mockTodo)
        
        await todoController.update_status(req, res, next)
        
        expect(Todo.findOne).toHaveBeenCalledWith({ where: { id: "1", userId: 1 } })
        expect(mockTodo.todo_status).toBe(true)
        expect(mockTodo.save).toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith(mockTodo)
    })

    test('delete - должен удалить задачу', async () => {
        req.params = { id: '1' }
        
        const mockTodo = {
            id: 1,
            destroy: jest.fn().mockResolvedValue(true)
        }
        
        Todo.findOne.mockResolvedValue(mockTodo)
        
        await todoController.delete(req, res, next)
        
        expect(Todo.findOne).toHaveBeenCalledWith({ where: { id: "1", userId: 1 } })
        expect(mockTodo.destroy).toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ 
            message: 'Задача успешно удалена', 
            id: 1 
        })
    })
})