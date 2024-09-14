const AppError = require('./appErrorClass');
const errorHandlerMiddleware = require('./errorHandler'); //TODO: Have to rename errorHandler file to errorHandlerMiddleware
const tryCatch = require('./tryCatch')
// const firebase = require('./firebase');

module.exports = {
    AppError,
    errorHandlerMiddleware,
    tryCatch,
    // firebase
};
