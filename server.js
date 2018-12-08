'use strict'

const path = require('path')

const domapic = require('domapic-service')
const requestPromise = require('request-promise')

const options = require('./lib/options')
const { WEBHOOK_URI, WEBHOOK_METHOD } = require('./lib/statics')

const ABILITY = 'webhook'

domapic.createModule({
  packagePath: path.resolve(__dirname),
  customConfig: options
}).then(async dmpcModule => {
  const config = await dmpcModule.config.get()

  await dmpcModule.register({
    [ABILITY]: {
      description: 'Launch a request to a webhook',
      event: {
        description: 'The webhook has been triggered'
      },
      action: {
        description: 'Trigger the webhook',
        handler: () => requestPromise({
          uri: config[WEBHOOK_URI],
          method: config[WEBHOOK_METHOD]
        }).then(() => {
          dmpcModule.events.emit(ABILITY)
          return Promise.resolve()
        })
        // TODO, catch the error and return a badGateway
      }
    }
  })

  return dmpcModule.start()
})
