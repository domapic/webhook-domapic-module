'use strict'

const { WEBHOOK_URI, WEBHOOK_METHOD } = require('./statics')

module.exports = {
  [WEBHOOK_URI]: {
    type: 'string',
    alias: ['url'],
    describe: 'Define the webhook url'
  },
  [WEBHOOK_METHOD]: {
    type: 'string',
    describe: 'GPIO number where the relay is connected',
    choices: ['GET', 'POST'],
    default: 'POST'
  }
}
