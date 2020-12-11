const API_KEY = process.env.ACCUWEATHER_API_KEY
const API_KEY2 = 'KrNJ7epExtHswickfnlR95tqZGTQkQ46'
const API_KEY3 = 'sGtmTVEQIFpRnH0fOhfXi77X3MMlhNak'
const API_KEY4 = 'bMpjOJLDdzSHqmrJzs5Oj33R9X4OTETn'

//express is the framework we're going to use to handle requests
const express = require('express')

//request module is needed to make a request to a web service
const request = require('request')

var router = express.Router()
/**
 * @api {post} /geoposition Requests information of latitude and longitude coordinates
 * @apiName PostGeoPosition
 * 
 * @apiGroup AccuWeather
 * 
 * @apiDescription This end point is a pass through to the developer.accuweather.com API.
 * All parameters will pass on to http://dataservice.accuweather.com/currentconditions/v1/.
 * See the <a href="https://developer.accuweather.com/accuweather-locations-api/apis/get/locations/v1/cities/geoposition/search">Accuweather documentation</a> for a list of optional
 * parameters and expected results.
 */
router.post("/", (req, res) => {
    
    const lat = req.body.latitude
    const lon = req.body.longitude

    let url = "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey="+API_KEY+"&q="+lat+"%2C"+lon

    request(url, function (error, response, body) {

        const data = JSON.parse(body)
        if (error) {
            res.send(error)
        } else {
            
            res.send(data)

            //  var n = body
            //  var nakidBody = n.substring(1, n.length-1)

            //  res.send(nakidBody)
            
            
        }
    })

})

module.exports = router