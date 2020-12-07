const API_KEY = process.env.ACCUWEATHER_API_KEY

//express is the framework we're going to use to handle requests
const express = require('express')

//request module is needed to make a request to a web service
const request = require('request')

var router = express.Router()

/**
 * @api {get} /fiveday Request the 5 day forecast of a zip code (98374)
 * @apiName GetTweleveHour
 * 
 * @apiGroup AccuWeather
 * 
 * @apiDescription This end point is a pass through to the developer.accuweather.com API.
 * All parameters will pass on to http://dataservice.accuweather.com/currentconditions/v1/.
 * See the <a href="https://developer.accuweather.com/accuweather-forecast-api/apis/get
 * /forecasts/v1/daily/5day/%7BlocationKey%7D">Accuweather documentation</a> for a list of optional
 * parameters and expected results.
 */
router.get("/", (req, res) => {

    const query = req.body.locationkey

    let url = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/"+query+"?apikey="+API_KEY

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