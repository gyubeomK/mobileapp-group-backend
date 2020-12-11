const API_KEY = process.env.ACCUWEATHER_API_KEY
const API_KEY2 = 'KrNJ7epExtHswickfnlR95tqZGTQkQ46'
const API_KEY3 = 'sGtmTVEQIFpRnH0fOhfXi77X3MMlhNak'
const API_KEY4 = 'bMpjOJLDdzSHqmrJzs5Oj33R9X4OTETn'
const API_KEY5 = 'wARLT1uu1WL3PDoHmc5DrfFTH5kmy5F6'

//express is the framework we're going to use to handle requests
const express = require('express')

//request module is needed to make a request to a web service
const request = require('request')

var router = express.Router()

/**
 * @api {post} /fiveday Request the 5 day forecast of a location key
 * @apiName PostTweleveHour
 * 
 * @apiGroup AccuWeather
 * 
 * @apiDescription This end point is a pass through to the developer.accuweather.com API.
 * All parameters will pass on to http://dataservice.accuweather.com/currentconditions/v1/.
 * See the <a href="https://developer.accuweather.com/accuweather-forecast-api/apis/get
 * /forecasts/v1/daily/5day/%7BlocationKey%7D">Accuweather documentation</a> for a list of optional
 * parameters and expected results.
 */
router.post("/", (req, res) => {

    const query = req.body.locationkey

    let url = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/"+query+"?apikey="+API_KEY2

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