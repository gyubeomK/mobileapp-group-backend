const API_KEY = process.env.ACCUWEATHER_API_KEY

//express is the framework we're going to use to handle requests
const express = require('express')

//request module is needed to make a request to a web service
const request = require('request')

var router = express.Router()
/**
 * @api {get} /currentweather Request the current weather of a zip code (98374)
 * @apiName GetCurrentWeather
 * 
 * @apiGroup AccuWeather
 * 
 * @apiDescription This end point is a pass through to the developer.accuweather.com API.
 * All parameters will pass on to http://dataservice.accuweather.com/currentconditions/v1/.
 * See the <a href="https://developer.accuweather.com/accuweather-current-conditions-api/apis/get
 * /currentconditions/v1/%7BlocationKey%7D">Accuweather documentation</a> for a list of optional
 * parameters and expected results.
 */
router.get("/", (req, res) => {

    let url = `http://dataservice.accuweather.com/currentconditions/v1/41531_PC?apikey=sGtmTVEQIFpRnH0fOhfXi77X3MMlhNak`

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