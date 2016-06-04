'use strict'

const moment = require('moment-timezone'); // a timezone dependency
const Slack = require('slack-node') // slacks interface dependency
const slack = new Slack() // instantiating slack

slack.setWebhook(process.env.SLACK_WEBHOOK_URL) // acccess the webhook url you pasted into Heroku in step 3

module.exports = function sendFormToSlack(request, callback) {

    var messageOptions = {
        channel: (process.env.SLACK_CHANNEL || '#general'), // looks for a channel override, or defaults to general
        username: "Website Form Submission", // may be any string, like "My Evil Website Robot"
        icon_emoji: ":memo:", // this is the emoji display in slack
        text: 'A new form submission was received on ' + request.body.metadata.submitted_from_domain + '. ',
        attachments: [
            {
                color: '#dddddd',
                fields: [
                    {
                        title: 'Submitted on',
                        value: moment(request.body.metadata.submitted_at).tz("America/Los_Angeles").format('dddd, MMMM Do YYYY [at] h:mma (z)'),
                        short: false
                    },
                    {
                        title: 'Submitted from URL',
                        value: request.body.metadata.submitted_from_url,
                        short: false
                    }
                ]
            },
            {
                //"pretext":"Form Submission",
                "color": "#1F75FE",
                "fields":[]
            }
        ]
    }

    // iterates through the payload and appends the data as attachments to the slack message above
    Object.keys(request.body.data).map(function(key) {
        messageOptions.attachments[1].fields.push({
            "title": key,
            "value": request.body.data[key],
            "short": false
        })
    })
    
    // makes the request to post your information to the slack channel
    slack.webhook(messageOptions, function(err, response) {
        callback(err)
    })

}
