const express = require('express')
const router = express.Router()


router.get('/user/userId', (req, res) => {
  res.send('entramos a orders')
})

module.exports = router
