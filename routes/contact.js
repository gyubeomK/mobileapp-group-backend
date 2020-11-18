const { response } = require('express')

//express is the framework we're going to use to handle requests
const express = require('express')
const { route } = require('./login')

//Access to Heroku database
let pool = require('../utilities/utils').pool

var router = express.Router()

//This allow parsing of the body of POST requests, that are encoded in JSON
router.use(require("body-parser").json())

/**
 * @api {get} /contacts Request to get list of contacts 
 * @apiName GetContacts
 * @apiGroup Contacts
 * 
 * @apiDescription Request to get list of contacts
 * 
 * @apiSuccess {Object[]} contacts List of contacts
 * 
 * @apiError (404: memberId Not Found) {String} message "member ID Not Found"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */
router.get("/", (request, response, next) => {
    console.log("/contact");
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
    //Get contact info
    let query = 'SELECT Verified, MemberID_B, Members.FirstName, Members.LastName, Members.email, Members.Username FROM Contacts INNER JOIN Members ON Contacts.MemberID_B = Members.MemberID where Contacts.MemberID_A = $1'
    let values = [request.decoded.memberid]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "no contacts"
                })
            } else {
                let listContacts = [];
                result.rows.forEach(entry =>
                    listContacts.push(
                        {
                            "email": entry.email,
                            "firstName": entry.firstname,
                            "lastName": entry.lastname,
                            "userName": entry.username,
                            "memberId": entry.memberid_b,
                            "verified": entry.verified
                        }
                    )
                )
                response.send({
                    success: true,
                    contacts: listContacts
                })
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
});

/**
 * @api {delete} /contact/:memberId? to delete a user contact
 * @apiName deleteContact
 * @apiGroup Contact
 * 
 * @apiDescription send a signal to delete a contact with matching memberID
 * 
 * @apiParam {number} memberID
 * 
 * @apiSuccess {boolean} true if the contact is found and deleted
 * 
 * @apiError (400: Missing Params) {String} message "Missing required information"
 * @apiError (400: Bad Token) {String} message "MemberId must be a number"
 * @apiError (404: query return no row) {String} message "contact not found"
 * 
 * @apiError (400: SQL Error) {String} SQL error
 */

router.delete("/contact/:memberId?", (request, response, next) => {
    console.log("/contact/" + request.params.memberId);
    if (!request.params.memberId) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.params.memberId)) {
        response.status(400).send({
            message: "MemberID must be a number"
        })
    } else {
        next()
    }
}, (request, response) => {
    let query = 'DELETE FROM Contacts WHERE MemberID_A = $1 and MemberID_B = $2'
    let values = [request.decoded.memberid, request.params.memberId]

    pool.query(query, values).then(result => {
        if (result.rowCount == 0 ) {
            response.status(404).send({
                message: "contact not found"
            })
        } else {
            response.send({
                success: true
            })
        }
    }).catch(error => {
        response.status(400).send({
            message: "SQL Error",
            error: error
        })
    })
});


module.exports = router