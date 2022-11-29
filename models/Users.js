const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: {type: String, required: true},
    admin: {type: Boolean, default: false},
  },
  {minimize: false},
  {timestamps: true}
)

module.exports = mongoose.model('users', userSchema)