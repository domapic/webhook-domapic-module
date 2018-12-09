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
        handler: async () => {
          await dmpcModule.tracer.info(`Sending ${config[WEBHOOK_METHOD]} request to ${config[WEBHOOK_URI]}`)
          return requestPromise({
            uri: config[WEBHOOK_URI],
            method: config[WEBHOOK_METHOD]
          }).then(() => {
            dmpcModule.events.emit(ABILITY)
            return Promise.resolve()
          }).catch(async error => {
            const errorMessage = `Error ${error.response.statusCode} received from ${config[WEBHOOK_METHOD]} to ${config[WEBHOOK_URI]}`
            await dmpcModule.tracer.error(errorMessage)
            return Promise.reject(new dmpcModule.errors.BadGateway(errorMessage))
          })
        }
      }
    }
  })

  return dmpcModule.start()
})
