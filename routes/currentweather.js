const API_KEY = process.env.ACCUWEATHER_API_KEY

//express is the framework we're going to use to handle requests
const express = require('express')

//request module is needed to make a request to a web service
const request = require('request')

var router = express.Router()

router.get("/", (req, res) => {

    let url = `http://dataservice.accuweather.com/currentconditions/v1/41531_PC?apikey=${API_KEY}`

    request(url, function (error, response, body) {

        const data = JSON.parse(body)
        if (error) {
            res.send(error)
        } else {
            // pass on everything (try out each of these in Postman to see the difference)
             res.send(data);
            
            // or just pass on the body

            //var n = body.indexOf("{")
            //var nakidBody = body.substring(n - 1)

            //res.send(nakidBody)
        }
    })

})

module.exports = router