const express = require('express')
const https = require('https')
const API_KEY = '87778b361ce442fe8501b305005e67c6'

var router = express.Router()
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended: true}))

router.get("/?q=:city?", (request, response) => {
    const query = request.query.name
    console.log(query)
    let unit = "imperial"
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+request.params.city+"&units="+unit+"&appid=" + API_KEY
    if (query) {
        https.get(url, (res) => {
            res.on('data', (data) => {
                const weather = JSON.parse(data)
                response.send({
                    weather
                })
            })
        })
    } else {
        response.status(400).send({
            message : "Missing required information"
        })
    }
})

module.exports = router