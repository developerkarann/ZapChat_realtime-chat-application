// const { userSocketIds } = require("../app")


exports.getOtherMembers = (members, userId) => {
    return members.find((member) => member._id.toString() !== userId.toString())
}

exports.getSockets = (users = [], userSocketIds) => {

    // console.log('Members from getSockets', users)
    // console.log('socket ids from helper function', userSocketIds)

    // const sockets = users.map((user) => {console.log(user) , userSocketIds.get(user.toString()) })
    const sockets = users.map((user)=>userSocketIds.get(user.toString()))
    
    // console.log(sockets)

    return sockets

}
exports.getBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
// console.log('getBase64', file)



