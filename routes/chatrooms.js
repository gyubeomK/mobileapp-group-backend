//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

var router = express.Router()

//This allows parsing of the body of POST requests, that are encoded in JSON
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

/*router.get("/", (request, response, next) => {
    //validate MemberID is not empty or non-number
    if (!request.query.memberId) {
        response.status(400).send({
            message: "Missing required information"
        });
    }  else if (isNaN(request.query.memberId)) {
        response.status(400).send({
            message: "Malformed parameter. memberID must be a number"
        });
    } else {
        next();
    }
    
}, (request, response, next) => {
    //validate that the memberID exists
    let query = 'SELECT * FROM Members WHERE MemberId=$1';
    let values = [request.query.memberId];
    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Member ID not found"
                });
            } else {
                next();
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error1",
                error: error
        });
    });
}, (request, response) => {
    //perform the Select
    let query = 'SELECT ChatID FROM ChatMembers WHERE MemberId=$1';
    let values = [request.query.memberId];
    pool.query(query, values)
        .then(result => {
            response.send({
                rowCount: result.rowCount,
                chatid: result.rows[0].chatid,
                name: result.rows[0].name
            });
        }).catch(err => {
        response.status(400).send({
            message: "SQL Error2",
            error: err
        });
    });
});*/


module.exports = router