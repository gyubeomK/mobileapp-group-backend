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
 * @api {post} /twelvehour Request the 12 hour forecast of a location key
 * @apiName PostTwelveHour
 * 
 * @apiGroup AccuWeather
 * 
 * @apiDescription This end point is a pass through to the developer.accuweather.com API.
 * All parameters will pass on to http://dataservice.accuweather.com/currentconditions/v1/.
 * See the <a href="https://developer.accuweather.com/accuweather-forecast-api/apis/get/
 * forecasts/v1/hourly/12hour/%7BlocationKey%7D">Accuweather documentation</a> for a list of optional
 * parameters and expected results.
 */
router.post("/", (req, res) => {

    
    
    const query = req.body.locationkey

    let url = "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/"+query+"?apikey="+API_KEY

    request(url, function (error, response, body) {

        const data = JSON.parse(body)
        if (error) {
            res.send(error)
        } else {
            
             res.send(data);
              //var n = body
            //  var nakidBody = n.substring(1, n.length-1)

            //  res.send(nakidBody)
            

            
            
        }
    })

})

module.exports = router