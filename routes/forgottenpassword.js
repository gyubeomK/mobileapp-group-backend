//express is the framework we're going to use to handle requests
const express = require('express')

const crypt = require("crypto")

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

var router = express.Router()

const bodyParser = require("body-parser")

let getHash = require('../utilities/utils').getHash

//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

router.post('/change', (request, response, next)=> {
    var email = request.body.email
    var newPass = request.body.newPass
    if(!email || !newPass) {
        response.status(404).send({
            message: 'Missing Information'
        })
    } else {
        next()
    }
}, (request, response) => {
    let query = 'SELECT Password, Salt FROM Members WHERE Email=$1'
    let values = [request.body.email]
    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "User Information not found"
                })
                return
            } 
            let cursalt = result.rows[0].salt
            let curpass = result.rows[0].password
            let newSalt = crypt.randomBytes(32).toString('hex')
            let mySaltNewPass = getHash(request.body.newpassword, newSalt) //hash for new password
            let update =`UPDATE Members 
                         SET Password=$1, Salt=$2 WHERE email=$3`
            let values = [mySaltNewPass, newSalt, request.body.email]
                pool.query(update, values)
                .then(result => {
                    if(result.rowCount > 0) {
                        response.json({
                        success: true,
                        message: "New Password is UPDATED!"
                        })
                    } else {
                        response.status(400).send({
                            message: 'Password is not able to be Changed!'
                        })
                    }
                }) 
            
        })
    }
)