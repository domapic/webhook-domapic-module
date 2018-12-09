const test = require('narval')

const utils = require('./utils')

test.describe('webhook api', function () {
  this.timeout(10000)
  let connection

  test.before(() => {
    connection = new utils.Connection()
  })

  test.describe('webhook action', () => {
    test.it('should launch the webhook', () => {
      return connection.request('/abilities/webhook/action', {
        method: 'POST'
      }).then(response => {
        return Promise.all([
          test.expect(response.statusCode).to.equal(200),
          test.expect(response.body).to.be.undefined()
        ])
      })
    })

    test.it('should have traced the request', () => {
      return utils.moduleLogs()
        .then(logs => {
          test.expect(logs).to.contain('Sending GET request to http://google.com')
        })
    })

    test.it('should have tried to emit a webhook event', () => {
      return utils.moduleLogs()
        .then(logs => {
          test.expect(logs).to.contain('Error sending "webhook" event')
        })
    })
  })
})
