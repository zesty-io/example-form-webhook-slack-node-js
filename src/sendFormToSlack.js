'use strict'

const moment = require('moment-timezone');
const Slack = require('slack-node')
const slack = new Slack()

slack.setWebhook(process.env.SLACK_WEBHOOK_URL)

module.exports = function sendFormToSlack(request, callback) {

    var messageOptions = {
        channel: (process.env.SLACK_CHANNEL || '#general'),
        username: "Website Form Submission",
        icon_emoji: ":memo:",
        text: 'A new form submission was received on ' + request.body.metadata.submitted_from_domain + '. ',
        attachments: [
            {
                color: '#dddddd',
                fields: [
                    {
                        title: 'Submitted on',
                        value: moment(request.body.metadata.submitted_at).tz("America/Los_Angeles").format('dddd, MMMM Do YYYY [at] h:mma (z)'),
                        //value: request.body.metadata.submitted_at,
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

    Object.keys(request.body.data).map(function(key) {
        messageOptions.attachments[1].fields.push({
            "title": key,
            "value": request.body.data[key],
            "short": false
        })
    })

    slack.webhook(messageOptions, function(err, response) {
        callback(err)
    })

}
