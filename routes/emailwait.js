const express = require('express')
//Get the connection to Heroku Database
let pool = require('../utilities/utils').pool
const sourceEmail = process.env.SENDER_EMAIL
var router = express.Router();
const crypto = require("crypto")
const bodyParser = require("body-parser");
const { response } = require('express');
router.use(bodyParser.json())
router.get("/", (request, res) => {
    var address = request.body.email 
    // check for hash in the table
    let theQuery = "SELECT * FROM Valid_Verifiers WHERE Email=" + email +";"
    pool.query(theQuery)
            .then(result => {
                if(result.rowCount == 0) { 
                    res.status(201).send({
                        success: true,
                        message: "Email verification successful"
                    })
                } else {
                    res.status(201).send({
                        success: false
                    })

                        }
                        
            })
            .catch((err)=> {
                
                    res.status(400).send({
                        message: "SQL Error " + err
                    })
                
            })
})

module.exports = router