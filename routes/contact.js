/**
 * Contact back-end
 * @author Ford Nguyen
 * @version 3.0
 */

const { response } = require('express')
const e = require('express')

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
 * @apiGroup Contacts
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
 * @apiUse JSONError
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
    let query2 = 'DELETE FROM Contacts WHERE MemberID_A = $2 and MemberID_B = $1'
    let values = [request.decoded.memberid, request.params.memberId]

    pool.query(query, values).then(result => {
        if (result.rowCount == 0 ) {
            response.status(404).send({
                message: "contact not found"
            })
        } else {
            
            pool.query(query2, values)
            
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


/**
 * @api {get} /contacts/requestlist Request to get list of friend request 
 * @apiName getFriendRequestList
 * @apiGroup Contacts
 * 
 * @apiDescription Request to get list of friend requests
 * 
 * @apiSuccess {Object[]} request List of contact
 * 
 * @apiError (400: Missing Params) {String} message "Missing Required Information"
 * @apiError (400: Bad Token) {String} message "MemberID must be a number"
 * 
 * @apiError (404: memberId Not Found) {String} message "no friend request"
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */
router.get("/requestlist", (request, response, next) => {
    console.log("/requestlist");
    if (!request.decoded.memberid) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.decoded.memberid)) {
        response.status(400).send({
            message: "MemberID must be a number"
        })
    } else {
        next()
    }
}, (request, response) => {
    //Get contact info
    let query = 'SELECT Verified, MemberID_B, Members.FirstName, Members.LastName, Members.email, Members.Username FROM Contacts INNER JOIN Members ON Contacts.MemberID_B = Members.MemberID WHERE Contacts.MemberID_A = $1'
    let values = [request.decoded.memberid]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "no friend request"
                })
            } else {
                let listRequest = [];
                result.rows.forEach(entry => {
                    if (entry.verified == 0) {
                        listRequest.push(
                        {
                            "username" : entry.username,
                            "memberid" : entry.memberid_b
                        })
                    }
                })
                response.send({
                    success: true,
                    request: listRequest
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
 * @api {post} /favorite Request to favorite a person
 * @apiName Favorite 
 * @apiGroup Contacts
 * 
 * @apiParam {number} memberID
 * 
 * @apiDescription alter value on favorite column of contacts to 1 if user choose to favorite a person on their contact list
 * 
 * @apiError (400: Missing Params) {String} message "Missing Required Information"
 * @apiError (400: Bad Token) {String} message "MemberID must be a number"
 * 
 * 
 * @apiSuccess success: true
 * @apiError (400: SQL Error) catch by SQL Error
 * 
 * @apiUse JSONError
 */
router.post('/favorite/:memberId?', (request, response, next) => {
    console.log("User " + request.decoded.memberid + " Favor " + request.params.memberId);
    if(!request.params.memberId) {
        response.status(400).send({
            message: "Missing Required Information"
        })
    } else if (isNaN(request.params.memberId)) {
        response.status(400).send({
            message: "MemberID must be a number"
        })
    } else {
        next()
    }
}, (request, response) => {
    let query = 'UPDATE Contacts SET Favorite = 1 WHERE MemberID_A = $1 AND MemberID_B = $2'
    let values = [request.decoded.memberid, request.params.memberId]
    pool.query(query, values).then(result => {
        if (result.rowCount == 0) {
            response.status(404).send({
                message: "error"
            })
        } else {
            response.send({
            success: true
        })
        }
    }).catch(err => {
        console.log(err);
        response.status(400).send({
            message: "SQL Error",
            error: err
        })
        
    })
})

/**
 * @api {get} /contacts Request to get list of favorite contact 
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
router.get("/favorite", (request, response, next) => {
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
    let query = 'SELECT Favorite, Verified, MemberID_B, Members.FirstName, Members.LastName, Members.email, Members.Username FROM Contacts INNER JOIN Members ON Contacts.MemberID_B = Members.MemberID where Contacts.MemberID_A = $1'
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
                            "favorite": entry.favorite
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
 * @api {post} /request/:memberId? Accept friend request
 * @apiName acceptFriendRequest
 * @apiGroup Contacts
 * 
 * @apiParam {number} memberID
 * 
 * @apiDescription API to accept friend request changing verified in Contact tables from 0 to 1
 * 
 * @apiError (400 Missing Params) {String} message "Missing required information"
 * @apiError (400 Bad Token) {String} message "Malformed parameter. MemberID must be a number"
 * 
 * @apiSuccess success:true
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * @apiUse JSONError
 */
router.post("/request/:memberId?", (request, response, next) => {
    console.log("User " + request.decoded.memberid + " accept " + request.params.memberId);
    if (!request.params.memberId) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.params.memberId)) {
        response.status(400).send({
            message: "Malformed parameter. memberId must be a number"
        })
    } else {
        next()
    }
}, (request, response) => {
    let query = 'UPDATE Contacts SET Verified = 1 WHERE MemberID_A = $1 AND MemberID_B = $2'
    let query2 = 'UPDATE Contacts SET Verified = 1 WHERE MemberID_B = $1 AND MemberID_A = $2'
    let values = [request.decoded.memberid, request.params.memberId]

    pool.query(query, values).then(result => {
        pool.query(query2, values)
        response.send({
            success: true
        })
    }).catch(error => {
        response.status(400).send({
            message: "SQL Error",
            error: error
        })
    })
})

/**
 * @api {post} /favorite/delete/:memberId? un-favorite a contact
 * @apiName deleteFavorite
 * @apiGroup Contacts
 * 
 * @apiParam {number} memberID
 * 
 * @apiDescription Unfavorite a contact by setting the according favorite column value to 0.
 * 
 * @apiError (400 Missing Params) {String} message "Missing required information"
 * @apiError (400 Bad Token) {String} message "Malformed parameter. MemberID must be a number"
 * 
 * @apiSuccess success:true
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * @apiUse JSONError
 * 
 */
router.post('/favorite/delete/:memberId?', (request, response, next) => {
    console.log("User " + request.decoded.memberid + " un-favorite " + request.params.memberId);
    if (!request.params.memberId) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.params.memberId)) {
        response.status(400).send({
            message: "Malformed Parameter. MemberID must be a number"
        })
    } else {
        next()
    }
}, (request, response) => {
    let query = 'UPDATE Contacts SET Favorite = 0 WHERE MemberID_A = $1 AND MemberID_B = $2'
    let values = [request.decoded.memberid, request.params.memberId]

    pool.query(query, values).then(result => {
        if (result.rowCount < 0) {
            response.send({
                success: false
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
})

/**
 * @api {post} /add Send Friend Request to another user
 * @apiName addUser
 * @apiGroup Contacts
 * 
 * @apiDescription API to send friend request using username
 * 
 * 
 * @apiError (400 Missing Params) {String} message "Missing required information"
 * @apiError (404 Contact Exist) {String} message "This username is already in your contact"
 * 
 * @apiSuccess success: true
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */
router.post("/add", (request, response, next) => {
    console.log("User " + request.decoded.memberid + " Add " + request.body.userName)
    if (!request.body.userName) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        next()
    }
}, (request, response) => {
    let check = 'SELECT * FROM Contacts WHERE MemberID_A = "$1"::int AND MemberID_B = (SELECT MemberID FROM Members WHERE Username = $2)'
    let check2 = 'SELECT * FROM Members WHERE Username = $2'
    let query = 'INSERT INTO Contacts (MemberID_B, MemberID_A) VALUES ("$1"::int, (SELECT MemberID FROM Members WHERE Username = $2))'
    let query2 = 'INSERT INTO Contacts (MemberID_A, MemberID_B, Verified) VALUES ("$1"::int, (SELECT MemberID FROM Members WHERE Username = $2), 2)'
    let values = [request.decoded.memberid, request.body.userName]

    pool.query(check2, values).then(result => {
        if (result.rowCount == 0) {
            response.status(404).send({
                message: "Contact does not exist"
            })
        } else {
            pool.query(check, values).then(result => {
                if (result.rowCount > 0) {
                    response.status(404).send({
                        message: "This username is in your contact"
                    })
                } else {
                    pool.query(query, values)
                    pool.query(query2, values)
                    response.send({
                        success: true
                    })
                }
            }).catch (error => {
                response.status(400).send({
                    message: "SQL Error 1",
                    error: error
                })
            })
        }
    }).catch (error => {
        response.status(400).send({
            message: "SQL Error 2 " + error,
            error: error
        })
    })
})



/**
 * @api {post} /decline decline the friend request
 * @apiName declineUser
 * @apiGroup Contacts
 * 
 * @apiDescription API to decline a friend request using username
 * 
 * 
 * @apiError (400 Missing Params) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */
router.post('/decline', (request, response, next) => {
    console.log("User " + request.decoded.memberid + " Decline " + request.body.userName)
    if (!request.body.userName) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        next()
    }
}, (request, response) => {
    let query = 'DELETE FROM Contacts WHERE MemberID_A = (SELECT MemberID from Members WHERE Username = $2) AND MemberID_B = $1'
    let query2 = 'DELETE FROM Contacts WHERE MemberID_B = (SELECT MemberID from Members WHERE Username = $2) AND MemberID_A = $1'
    let values = [request.decoded.memberid, request.body.userName]
    
    pool.query(query, values).then(
        pool.query(query2, values),
        response.send({
            success: true
        })
    ).catch (error => {
        response.status(400).send({
            message: "SQL Error",
            error: error
        })
    })
})

module.exports = router