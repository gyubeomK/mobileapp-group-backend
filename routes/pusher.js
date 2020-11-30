
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
  instanceId: 'c9680030-b0e8-4d56-a722-5d92adf8c303',
  secretKey: '4E7868AEA87EFE9D3786A988AE6DAFC4856C3500650786959F8F5FFDB21D1A39'
});

/**
 * 
 */
router.get('/', (request, response) => {
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