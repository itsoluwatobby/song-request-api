const { newUser, newRequest, editRequest, deleteRequest, voteRequest, getAllRequest } = require('../controller/requestController')
const router = require('express').Router()

router.post('/new', newUser)
router.post('/newRequest/:userId', newRequest)
router.put('/edit/:userId', editRequest)
router.delete('/delete/:userId/:requestId', deleteRequest)
router.put('/vote/:userId/:requestId', voteRequest)
router.get('/', getAllRequest)

module.exports = router