const API_KEY = process.env.ACCUWEATHER_API_KEY

//express is the framework we're going to use to handle requests
const express = require('express')

//request module is needed to make a request to a web service
const request = require('request')

var router = express.Router()

router.get("/", (req, res) => {

    let url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/41531_PC?apikey=%20%09${API_KEY}`

    request(url, function (error, response, body) {

        const data = JSON.parse(body)
        if (error) {
            res.send(error)
        } else {
            
             res.send(data);
            
            
        }
    })

})

module.exports = router