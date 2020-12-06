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

router.post('/', (request, response)=>{
    let emial = request.body.email
    let oldPassword = request.body.oldPassword
    let newPassword = equest.body.newPassword
    if (!emial || !oldPassword|| !newPassword) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //validate chat id exists
    let query = 'SELECT Password, Salt FROM Members WHERE Email=$1'
    let values = [request.body.email]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "User Information not found"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    let ThierSalt = getHash(oldPassword, result.row[0].salt)

    if(ThierSalt == result.row[0].salt) {
        let newSalt = crypt.randomBytes(32).toString('hex')
        let hashNewPass = getHash(newPassword, newSalt)
        let insert = `UPDATE MEMBERS
                      SET Password = $1, Salt = $2 WHERE Email = $3
                      RETURNING *`
        let values = [newSalt, hashNewPass, email]
        pool.query(insert, values)
            .then(result => {
                response.send({
                    message: "Password has been Changed",
                    sucess: true
                })
            }).catch(err => {
                response.status(400).send({
                    message: "SQL Error",
                    error: err
                })
            })
        }
    }
)
module.exports= router
