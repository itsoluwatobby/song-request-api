const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'users'},
    email: {type: String, required: true},
    requestTitle: {type: String},
    requestLink: {type: String},
    requestDate: {type: String},
    upVote: {type: Array, default: []},
    completed: {type: Boolean, default: false},
  },
  {minimize: false},
  {timestamps: true}
)

module.exports = mongoose.model('requests', requestSchema)