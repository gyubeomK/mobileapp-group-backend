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
    var oldpass = request.body.oldpassword
    var newpass = request.body.newpassword
    if(!email || !oldpass || !newpass) {
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
            let TheirSalt = getHash(request.body.oldpassword, cursalt)
            let newSalt = crypt.randomBytes(32).toString('hex')
            let mySaltNewPass = getHash(request.body.newpassword, newSalt) //hash for new password
            let update =`UPDATE Members 
                         SET Password=$1, Salt=$2 WHERE email=$3`
            let values = [mySaltNewPass, newSalt, request.body.email]
            /*response.send({
                message: "current salt = " + salt + "/ current hash = " + TheirSalt + "/ current password = " + curpassword  + "/ newsort = " + newSalt + "/ new hash = " + MySalt
            })*/
            if(TheirSalt === curpass) {
                console.log('Credentials Match!')
                pool.query(update, values)
                .then(result => {
                    if(result.rowCount > 0) {
                        response.json({
                        sucess: true,
                        message: "New Password is UPDATED!"
                        })
                    } else {
                        response.status(400).send({
                            message: 'Password is not able to be Changed!'
                        })
                    }
                }) 
            } else {
                response.json({
                    sucss: false,
                    message: 'Your Old Password is WRONG!'
                }) 
            }
        })
    }
)
module.exports= router