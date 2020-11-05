//express is the framework we're going to use to handle requests
const express = require('express')

//retrieve the router pobject from express
var router = express.Router()

router.get("/", (request, response) => {
    setTimeout(() => {
        response.send({
            message: "Thanks for waiting" 
        }); 
    }, 5000) 
})

module.exports = router