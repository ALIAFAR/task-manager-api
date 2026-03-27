const { validationResult } = require('express-validator')
const ApiError = require('../error/ApiError')

module.exports = function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg)
        return next(ApiError.badRequest(errorMessages.join(', ')))
    }
    next()
}