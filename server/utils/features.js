const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { getBase64, getSockets } = require("../lib/helperFunc");
const cloudinary = require('cloudinary').v2
const uuid = require('uuid').v4


const connectDataBase = (uri) => {
   mongoose.connect(uri).then(() => {
      console.log('Database configured successfully')
   }).catch((error) => {
      console.log(`Getting some error while connectiong databse: ${error.message}`)
   })
}

const cookieOptions = {
   maxAge: 15 * 24 * 60 * 60 * 1000,
   sameSite: 'none',
   httpOnly: true,
   secure: true
}
const sendToken = (res, user, code, message) => {
   const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET)
   return res.status(code).cookie('token', token, cookieOptions).json({
      success: true,
      message,
      user,
      token
   })
}

const emitEvent = (req, event, users, data) => {
   const io = req.io
   const usersSocket = getSockets(users, req.userSocketIds)
   // console.log('userSocketIds from feature funtions', usersSocket)
   io.to(usersSocket).emit(event, data)
   // console.log('emit Event', event)
}

const uploadFilesToCloudinary = async (files = []) => {

   // console.log('UploadFilesToCloudinary', files)

   const uploadPromises = files.map((file) => {
      // console.log('UploadPrimese', file)
      return new Promise((resolve, reject) => {
         cloudinary.uploader.upload(getBase64(file), {
            resource_type: 'auto',
            public_id: uuid(),
         },
            (error, result) => {
               // console.log('got an error')
               if (error) return reject(error);
               resolve(result)
               // console.log('Printing result',result)
            }
         )
      })
   })

   try {
      const results = await Promise.all(uploadPromises)
      const formatedResult = results.map((result) => ({
         public_id: result.public_id,
         url: result.secure_url,
      }))

      return formatedResult

   } catch (error) {
      // console.log('getting error')
      // console.log(error.message)
      throw new Error("Error while uploading files...", error.message)
   }

}
const deleteFilesFromCloudinary = async (public_ids) => {

}


module.exports = { connectDataBase, sendToken, emitEvent, uploadFilesToCloudinary, deleteFilesFromCloudinary, cookieOptions }

