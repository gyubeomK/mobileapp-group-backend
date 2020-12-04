/**
 * Weather back-end
 * @author Ford Nguyen
 * @version 1.0
 */

const { response } = require('express')
const e = require('express')

//express is the framework we're going to use to handle requests
const express = require('express')
const { route } = require('./login')

//Access to Heroku database
let pool = require('../utilities/utils').pool

var router = express.Router()

var unirest = require("unirest");

var req = unirest("GET", "https://community-open-weather-map.p.rapidapi.com/weather");

req.query({
	"q": "London,uk",
	"lat": "0",
	"lon": "0",
	"id": "2172797",
	"lang": "null",
	"units": "\"metric\" or \"imperial\"",
	"mode": "xml, html"
});

req.headers({
	"x-rapidapi-key": "4165b5da19msh442263a57547cdap159f3cjsna1fc6e6389b6",
	"x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
	"useQueryString": true
});


req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(res.body);
});

module.exports = req