/**
 * Chat back-end
 * @author Gyubeom Kim
 * @version 3.0
 */

/**
 * @api {addcontactmember} /:chatId? to add a member to the chat
 * @apiName addContactMember
 * @apiGroup Chat
 * 
 * @apiDescription Adds the user in contact into the corressponding chat 
 * 
 * @apiParam {number} chatId
 * 
 * @apiSuccess {boolean, string} true, message if the member is correctly added to chat
 * 
 * @apiError (400: Missing Params) {String} message "Missing required information"
 * @apiError (400: Invalid ChatId) {String} message "Malformed parameter. chatId must be a number"
 * @apiError (404: query return no row) {String} message "Chat ID not found"
 * @apiError (404: query return no row) {String} message "email not found"
 * 
 * @apiError (400: SQL Error) {String} SQL error
 * 
 * @apiUse JSONError
 */

const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

var router = express.Router()

//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(require("body-parser").json())

router.put("/:chatId/:memberId", (request, response, next) => {
    //validate on empty parameters
    if (!request.params.chatId || !request.body.memberid) {
        response.status(400).send({
            message: "Missing required information"
        })
    }  else if (isNaN(request.params.chatId)) {
        response.status(400).send({
            message: "Malformed parameter. chatId must be a number"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //validate chat id exists
    let query = 'SELECT * FROM CHATS WHERE ChatId=$1'
    let values = [request.params.chatId]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
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

}, (request, response, next) => {
    //validate email exists 
    let query = 'SELECT * FROM Members WHERE MemberId=$1'
    let values = [request.body.memberid]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "email not found"
                })
            } else {
                //user found
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
        let query = 'SELECT * FROM ChatMembers WHERE ChatId=$1 AND MemberId=$2'
        let values = [request.params.chatId, request.body.memberid]
    
        pool.query(query, values)
            .then(result => {
                if (result.rowCount > 0) {
                    response.json({
                        success: false,
                        message: "user already joined"
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
    //Insert the memberId into the chat
    let insert = `INSERT INTO ChatMembers(ChatId, MemberId)
                  VALUES ($1, $2)
                  RETURNING *`
    let values = [request.params.chatId, request.body.memberid]
    pool.query(insert, values)
        .then(result => {
            response.json({
                success: true,
                message: "Added To Chat!"
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
    }
)

module.exports = router