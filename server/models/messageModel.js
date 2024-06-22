const mongoose = require("mongoose");

const schema = new mongoose.Schema({
   content: {
      type: String,
   },
   attachment: [
      {
         public_id: {
            type: String,
            required: true,
         },
         url: {
            type: String,
            required: true,
         },
      }
   ],
   sender: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
   },
   chat: {
      type: mongoose.Types.ObjectId,
      ref: 'Chat',
      required: true
   },

}, {
   timestamps: true
})

module.exports = mongoose.model('Message', schema)
