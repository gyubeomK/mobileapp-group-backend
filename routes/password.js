//express is the framework we're going to use to handle requests
const express = require('express')

const crypt = require("crypto")

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

var router = express.Router()

const bodyParser = require("body-parser")
const { nextTick } = require('process')

let getHash = require('../utilities/utils').getHash

//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

router.post('/', (request, response, next)=> {
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
}, (request, response, next) => {
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
            let salt = result.rows[0].salt
            let curpassword = result.rows[0].password
            let TheirSalt = getHash(request.body.oldpassword, salt)
            let newSalt = crypt.randomBytes(32).toString('hex')
            let MySalt = getHash(request.body.newpassword, newSalt) //hash for new password
            let update =`UPDATE Members 
                         SET Password=$1, Salt=$2 WHERE email=$3`
            let values = [request.body.oldpassword, request.body.newpassword, request.body.email]
            if(TheirSalt === curpassword) {
                console.log('Credentials Match!')
                pool.query(update, values)
                .then(result => {
                    if(result.rowCount > 0) {
                        response.send({
                        message: "New Password is UPDATED!"
                        })
                    } else {
                        response.status(400).send({
                            message: 'Password is not able to be Changed!'
                        })
                    }
                }) 
            } else {
                response.status(400).send({
                    message: 'Credentials did not match'
                }) 
            }
        })
    }
)
module.exports= router