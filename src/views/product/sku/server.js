const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.get('/test', (req, res) => {
  res.send('1111111112123123123')
})
app.listen(3000)
