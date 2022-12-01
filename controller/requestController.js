const Users = require('../models/Users');
const Request = require('../models/Request');
const asyncHandler = require('express-async-handler')
const {sub} = require('date-fns')

//make request
exports.newUser = asyncHandler(async(req, res) => {
  const {email} = req.body
  if(!email) return res.status(400).json('email required')

  const duplicate = await Users.findOne({email}).exec()
  if(duplicate) return res.status(200).json(duplicate)
  const user = await Users.create({email})
  res.status(200).json(user)
})

exports.newRequest = asyncHandler(async(req, res) => {
  const {userId} = req.params
  const request = req.body
  console.log(request)
  if(!userId) return res.status(400).json('id required')

  const targetUser = await Users.findById(userId).exec()
  if(!targetUser) return res.status(403).json('user not found')

  const duplicate = await Request.findOne({requestTitle: request?.requestTitle}).exec()
  if(duplicate) return res.status(409).json('Title already taken')

  const dateTime = sub(new Date(), {minutes: 0}).toISOString()
  const songRequest = await Request.create({
    userId, email: request?.email, requestTitle: request?.requestTitle, requestLink: request?.requestLink, requestDate: dateTime
  })
  res.status(201).json(songRequest)
})

//edit request
exports.editRequest = asyncHandler(async(req, res) => {
  const editRequest = req.body
  const {userId} = req.params
  if(!userId) return res.status(400).json('id required')

  const user = await Users.findById(userId).exec()
  if(!user) return res.status(403).json('user not found')

  const targetRequest = await Request.findById(editRequest?.id).exec()
  if(!targetRequest) return res.status(403).json('request not found')
  
  if(!targetRequest?.userId.equals(user?._id)) return res.status(401).json('unauthorised')
  const dateTime = sub(new Date(), {minutes: 0}).toISOString()
  await targetRequest.updateOne({$set: {...editRequest, requestDate: dateTime}})

  const request = await Request.findById(targetRequest._id).exec()
  res.status(201).json(request)
})

//delete request/admin delete request
exports.deleteRequest = asyncHandler(async(req, res) => {
  const {userId, requestId} = req.params
  if(!userId || !requestId) return res.status(400).json('id required')

  const targetUser = await Users.findById(userId).exec()
  if(!targetUser) return res.status(403).json('request not found')

  const request = await Request.findById(requestId).exec()
  if(!request) return res.status(403).json('request not found')

  if(targetUser?.admin) await request.deleteOne()

  else if(!targetUser?._id.equals(request?.userId)) return res.status(401).json('unauthorised')
  
  else if(targetUser?._id.equals(request?.userId)) {
    await request.deleteOne()
  }
  res.sendStatus(204)
})

exports.getAllRequest = asyncHandler(async(req, res) => {
  const requests = await Request.find().lean()
  if(!requests?.length) return res.status(400).json('no request available')
  res.status(200).json(requests)
})

//vote for/against a request
exports.voteRequest = asyncHandler(async(req, res) => {
  const {userId, requestId} = req.params
  if(!userId) return res.status(400).json('id required')

  const targetRequest = await Request.findById(requestId).exec()
  if(!targetRequest) return res.status(403).json('request not found')

  const user = await Users.findById(userId).exec()
  if(!user) return res.status(403).json('user not found')

  if(!targetRequest?.upVote.includes(user._id)){
    await targetRequest.updateOne({$push: {upVote: user._id}})
    return res.status(201).json('you voted this request')
  }
  else{
    await targetRequest.updateOne({$pull: {upVote: user._id}})
    return res.status(201).json('you unvoted this request')
  }
})
