const { 
  newUser, newRequest, editRequest, 
  deleteRequest, voteRequest, 
  getAllRequest, getCompletedRequest, 
  completeRequest, getUser 
  } = require('../controller/requestController')
const router = require('express').Router()

router.post('/new', newUser)
router.post('/newRequest/:userId', newRequest)
router.put('/edit/:userId', editRequest)
router.delete('/delete/:userId/:requestId', deleteRequest)
router.put('/vote/:userId/:requestId', voteRequest)
router.put('/complete/:adminId/:requestId', completeRequest)
router.get('/', getAllRequest)
router.get('/complete', getCompletedRequest)
router.get('/:email', getUser)

module.exports = router