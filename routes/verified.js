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
    var address = request.query.email 
    var hash = request.query.hash
    // check for hash in the table
    let theQuery = "SELECT * FROM Valid_Verifiers WHERE mHash=" + hash +";"
    var isInTable = true;
    pool.query(theQuery)
            .then(result => {
                if(result.rowCount == 0) { 
                    res.status(404).send({
                        message: "email not found"
                    })
                } else {
                    //If it is in the table 
                         isInTable = true;
                    }
                        
            })
            .catch((err)=> {
                
                    res.status(400).send({
                        message: "first query failed, value of hash is: " + hash + " and query is: " + theQuery + " and email is: " + address
                        , error: err
                    })
                
            })
        if(isInTable) {
            console.log("mHash=" + hash)
            let theQuery2 = "Select * FROM Valid_Verifiers WHERE mHash=" +hash+" AND Email=" +address + ";"
            let values = [hash, address]
            console.log(theQuery2)
            pool.query(theQuery2, values)
                        .then(result => {
                            res.status(201).send({
                                //front end can read this to progress screens
                                success: true,
                                message: "query was sucessful with: " + theQuery2
                            })
                        })
                        .catch((err) => {
                            res.status(400).send({
                                message: "Nothing to delete, query was: " + theQuery2 + "and error was: " + err
                                //message: "Nothing to delete"
                            })
                        })
                    }
})

module.exports = router