const express = require('express')
//Get the connection to Heroku Database
let pool = require('./sql_conn.js')
const sourceEmail = process.env.SENDER_EMAIL
var router = express.Router();
const crypto = require("crypto")
const bodyParser = require("body-parser")
let getHash = require('../utilities/utils').getHash
let sendEmail = require('../utilities/utils').sendEmail
router.use(bodyParser.json())
router.get("/", (request, res) => {
    var address = request.params.email
    var hash = request.params.hash
    //check for hash in the table
    let theQuery = "IF EXISTS(SELECT 1 FROM Valid_Verifiers WHERE mHash=\"" + hash + "\")"  
    pool.query(theQuery)
            .then(result => {
                if(result) {
                    //If it is in the table 
                    res.status(201).send({
                        //front end can read this to progress screens
                        success: true
                    })
                    //remove entry from the table 
                    let theQuery2 = "DELETE FROM Valid_Verifiers WHERE mHash=VALUES($1) AND Email = VALUES($2) RETURNING *"
                    let values = [hash, address]
                    pool.query(theQuery2, values)
                                .then(result => {

                                })
                                .catch((err)=> {
                                    res.status(400).send({
                                        message: err.detail
                                    })
                                })
                                //TODO: direct to register endpoint idk how

                            } else {
                                res.status(400).send( {
                                    message: "Link has already been used"
                                })
                            }
            })
            .catch((err)=> {
                
                    res.status(400).send({
                        message: err.detail
                    })
                
            })
})