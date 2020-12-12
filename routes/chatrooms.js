/**
 * Chat back-end
 * @author Gyubeom Kim
 * @version 3.0
 */

 /**
 * @api {chatrooms} /:memId? to add a member to the chat
 * @apiName chatrooms
 * @apiGroup Chat
 * 
 * @apiDescription get list of chat
 * 
 * @apiParam {number} memId
 * 
 * @apiSuccess {boolean, list} true, chatlist if the member belongs to chats
 * 
 * @apiError (400: Missing Params) {String} message "Missing required information"
 * @apiError (400: Invalid memberId) {String} message "Malformed parameter. memberId must be a number"
 * @apiError (404: query return no row) {String} message "No messages"
 * 
 * @apiError (400: SQL Error) {String} SQL error
 * 
 * @apiUse JSONError
 */

//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

var router = express.Router()

router.use(require("body-parser").json())

router.get("/", (request, response, next) => {
    console.log("/chatrooms");
    console.log("User memberID: " + request.decoded.memberid);
    if (!request.decoded.memberid) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.decoded.memberid)) {
        response.status(400).send({
            message: "Malformed parameter. memberId must be a number"
        })
    } else {
        next()
    }
}, (request, response) => {
    //Get all chats
    let query = 'SELECT ChatID, Name FROM Chats where ChatID in (SELECT ChatID FROM ChatMembers where MemberID=$1)'
    let values = [request.decoded.memberid]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "No messages"
                })
            } else {
                let listChats = [];
                result.rows.forEach(entry =>
                    listChats.push(
                        {
                            "chat": entry.chatid,
                            "name": entry.name
                        }
                    )
                )
                response.send({
                    success: true,
                    chats: listChats
                })
            }
        }).catch(error => {
            console.log(error);
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
});

module.exports = router