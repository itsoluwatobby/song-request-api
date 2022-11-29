require('dotenv').config()
require('./config/dbConfig')();
const express = require('express');
const app = express();
const cors = require('cors')
const helmet = require('helmet');
const morgan = require('morgan')
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 4000

app.use(cors(corsOptions))

app.use(helmet())
app.use(morgan('common'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/public', (req, res) => {
   res.status(200).json({status: true, message: 'server up and running'})
})

app.use('/user', require('./router/requestRoute'))

app.all('*', (req, res) => {
   res.status(404).json({ status: false, message: 'resource not found'})
})

mongoose.connection.once('open', () => {
   console.log('Database connected')
   app.listen(PORT, () => console.log(`server running on port - ${PORT}`))
})

