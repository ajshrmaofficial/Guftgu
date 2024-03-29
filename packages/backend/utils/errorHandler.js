const AppError = require("./appErrorClass");

const errorHandler = (err, req, res, next) => {
    console.log(err);
    if(err instanceof AppError){
        return res.status(err.statusCode).send(err.message);
    }
    return res.status(500).send("Some error occured at server !!");
};

module.exports = errorHandler;