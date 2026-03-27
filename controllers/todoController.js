const {Todo} = require('../models/models')
const ApiError = require('../error/ApiError')


class TodoController{
    async getAll(req, res, next) {
        try {
            const userId = req.user.id
            const todos = await Todo.findAll({
                where: {userId}
            })
            return res.json(todos)
        } catch (error) {
            next(ApiError.internal(error.message))
        }
    }

    async create(req, res, next) {
        try {
            const { title, description } = req.body
            const userId = req.user.id
            
            if (!title) {
                return next(ApiError.badRequest('Название задачи обязательно'))
            }
            
            const todo = await Todo.create({
                title,
                description: description || '', 
                todo_status: false ,
                userId
            })
            
            return res.status(201).json(todo)
        } catch (error) {
            next(ApiError.internal(error.message))
        }
    }

    async update_status(req, res, next) {
        try {
            const { id } = req.params
            const userId = req.user.id
            
            const todo = await Todo.findOne({
                where: { id, userId }
            })

            if (!todo) {
                return next(ApiError.badRequest('Задача не найдена'))
            }
            
            todo.todo_status = !todo.todo_status
            await todo.save()
            
            return res.json(todo)
        } catch (error) {
            next(ApiError.internal(error.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params
            const userId = req.user.id
            
            const todo = await Todo.findOne({
                where: { id, userId }
            })
            if (!todo) {
                return next(ApiError.badRequest('Задача не найдена'))
            }
            
            await todo.destroy()
            
            return res.json({ message: 'Задача успешно удалена', id: parseInt(id) })
        } catch (error) {
            next(ApiError.internal(error.message))
        }
    }
}

module.exports = new TodoController()