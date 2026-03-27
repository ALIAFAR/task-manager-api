const Router  =require('express')
const router = new Router()
const todoController = require ('../controllers/todoController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, todoController.getAll)
router.post('/', authMiddleware, todoController.create)
router.patch('/:id', authMiddleware, todoController.update_status)
router.delete('/:id', authMiddleware, todoController.delete) 

module.exports =router