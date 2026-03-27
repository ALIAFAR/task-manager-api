const Router  = require('express')
const router = new Router()
const todoRouter = require('./todoRouter')
const userRouter = require('./userRouter')

router.use('/todos',todoRouter)
router.use('/', userRouter)

module.exports =router