'use strict'

// Load environment variables from a .env file if available
// (This is used for adding environment variables in local development for testing. The "Deploy with Heroku"
// button will prompt for the variables in the Heroku setup process.)
require('dotenv').load({silent: true})

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const sendFormToSlack = require('./src/sendFormToSlack')

app.set('port', (process.env.PORT || 80)) // set in step 3 when you created your heroku app

app.use(bodyParser.urlencoded({
    extended: true
}))

// Optional endpoint included to verify service is online
app.get('/', function(request, response) {
    response.send('Service online') // this will show up if you go to your base URL
})

// Endpoint for webhook target
// In this example, we validate the signature (if a secret is set), and then we send the form payload to a Slack
app.post('/submission', function(request, response) {

    // Otherwise, do what you want with the form payload
    // In this example, we'll send it to slack
    sendFormToSlack(request, function(err) {
        if (err) {
            response.sendStatus(500)
        }
        response.sendStatus(200)
    })

})

// Start the app/server
app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})
