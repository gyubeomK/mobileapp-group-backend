const API_KEY = process.env.ACCUWEATHER_API_KEY
const API_KEY2 = 'KrNJ7epExtHswickfnlR95tqZGTQkQ46'

//express is the framework we're going to use to handle requests
const express = require('express')

//request module is needed to make a request to a web service
const request = require('request')

var router = express.Router()

/**
 * @api {get} /twelvehour Request the 12 hour forecast of a zip code (98374)
 * @apiName GetTweleveHour
 * 
 * @apiGroup AccuWeather
 * 
 * @apiDescription This end point is a pass through to the developer.accuweather.com API.
 * All parameters will pass on to http://dataservice.accuweather.com/currentconditions/v1/.
 * See the <a href="https://developer.accuweather.com/accuweather-forecast-api/apis/get/
 * forecasts/v1/hourly/12hour/%7BlocationKey%7D">Accuweather documentation</a> for a list of optional
 * parameters and expected results.
 */
router.get("/", (req, res) => {

    
    const query = req.body.locationkey

    let url = "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/"+query+"?apikey="+API_KEY2

    request(url, function (error, response, body) {

        const data = JSON.parse(body)
        if (error) {
            res.send(error)
        } else {
            
             //res.send(data);
             var n = body
             var nakidBody = n.substring(1, n.length-1)

             res.send(nakidBody)
            
            
        }
    })

})

module.exports = router