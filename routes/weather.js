/**
 * Weather API at https://api.openweathermap.org
 * @author Ford Nguyen
 * @version 1.0
 */
const express = require('express')
const https = require('https')
const API_KEY = '87778b361ce442fe8501b305005e67c6'

var router = express.Router()
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended: true}))

/**
 * @api {get} /?:city=<city>
 * @apiName getWeatherCurrentUsingCity
 * @apiGroup Weather
 * @apiDescription Connect to a 3rd party API using https and get the current weather with city name provided
 * @apiSuccess weather data
 * @apiError (400: Missing Required Information) {String} message "Missing required information"
 */
router.get("/", (request, response) => {
    const query = request.query.city
    console.log(query)
    let unit = "imperial"
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&units="+unit+"&appid="+API_KEY
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