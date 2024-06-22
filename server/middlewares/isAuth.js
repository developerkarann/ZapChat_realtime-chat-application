const jwt = require("jsonwebtoken");
const { ErrorHandler } = require("../utils/utility");
const { TryCatch } = require("./error");
const User = require("../models/userModel");


exports.isAuthenticated = TryCatch(async (req, res, next) => {

    const token = req.cookies['token'];

    // console.log(req.cookies)

    if (!token) {
        return next(new ErrorHandler('Please login to access this route...', 401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    // console.log(token)

    req.user = decodedData._id;

    next()
})

exports.isAdmin = TryCatch(async (req, res, next) => {
    const token = req.cookies['admin-token'];

    if (!token) {
        return next(new ErrorHandler('Only Admin Can Access This Route', 401))
    }

    const adminId = jwt.verify(token, process.env.JWT_SECRET)

    const adminSecretKey = process.env.ADMIN_SECRET_KEY;

    const isMatched = adminId === adminSecretKey;

    if (!isMatched) return next(new ErrorHandler('Only Admin Can Access This Route', 401))

    next()
})

exports.socketAuthenticator = async (err, socket, next) => {
    try {
        if (err) {
            return next(err)
        }

        const authToken = socket.request.cookies['token']

        if (!authToken) {
            return next(new ErrorHandler('Please login to access this resource', 401))
        }

        const decodedData = jwt.verify(authToken, process.env.JWT_SECRET)

        const user = await User.findById(decodedData._id)

        if (!user) {
            return next(new ErrorHandler('Please login to access this resource', 401))
        }

        socket.user = user

        return next()

    } catch (error) {
        console.log(error)
        return next(new ErrorHandler('Please login to access this route', 401))
    }
}
