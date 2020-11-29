
/**
 * Pusher Beam for notification back-end
 * @author Ford Nguyen
 * @version 1.0
 */
const express = require('express');
const { route } = require('./login')

//Access to Heroku database
let pool = require('../utilities/utils').pool

var router = express.Router()

//This allow parsing of the body of POST requests, that are encoded in JSON
router.use(require("body-parser").json())
const PushNotifications = require('@pusher/push-notifications-server');

const port = 8080;
const app = express();
const beamsClient = new PushNotifications({
  instanceId: 'YOUR_INSTANCE_ID_HERE',
  secretKey: 'YOUR_SECRET_KEY_HERE'
});

router.get('/pusher/beams-auth', (request, response) => {
  // Do your normal auth checks here 🔒
  let theQuery = 'SELECT Username FROM Members WHERE MemberID = $1'
  let values = [request.decoded.memberid]

  pool.query(theQuery, values).then(result => {
      if (result.rowCount == 0) {
          response.status(400).send({
              message: "SQL Error"
          })
      } else {
        const userId = result.rows[0].username 
        const userIDInQueryParam = request.query['user_id'];
        if (userId != userIDInQueryParam) {
          response.send(401, 'Inconsistent request');
        } else {
          const beamsToken = beamsClient.generateToken(userId);
          response.send(JSON.stringify(beamsToken));
        }
      }
  }).catch ((err) => {
      response.status(400).send({
          message: "SQL Error" + err
      })
  })
  
});

module.exports = router