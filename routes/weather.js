var unirest = require('unirest');
var express = require('express');

var router = express.Router()

router.get('/', function(request, response) {
    unirest.get("https://community-open-weather-map.p.rapidapi.com/weather")
    .header("X-RapidAPI-Key", "4165b5da19msh442263a57547cdap159f3cjsna1fc6e6389b6")
    .header("x-rapidapi-host", "community-open-weather-map.p.rapidapi.com")
    .query({
        'appid' : 'default-application_4891802',
        'lon': '12.4924',
        'lat': '41.8902',
        'units': 'metric'
    })
    .end(function(result) {
        response.write(result.body);
    })
})

module.exports = router