const errorMiddleware = (err, req, res, next) => {

    err.message = err.message || 'Internal Server Error';
    err.statusCode = err.statusCode || 500;

    if (err.code == 11000) {
        const error = Object.keys(err.keyPattern).join(',')
        err.message = `This ${error} already exists`;
        err.statusCode = 400;
    }

    if (err.name === 'CastError') {
        const path = err.path
        err.message = `Invalid Formate Of ${path}`;
        err.statusCode = 400;
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
}

const TryCatch = (passedFunction) => async (req, res, next) => {
    try {
        await passedFunction(req, res, next)
    } catch (error) {
        next(error)
    }
}




module.exports = { errorMiddleware, TryCatch }