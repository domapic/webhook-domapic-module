const test = require('narval')

const utils = require('./utils')

test.describe('webhook api', function () {
  this.timeout(10000)
  let connection

  test.before(() => {
    connection = new utils.Connection()
  })

  test.describe('webhook action', () => {
    test.it('should fail with a 502 error when launching the webhook', () => {
      return connection.request('/abilities/webhook/action', {
        method: 'POST'
      }).then(response => {
        return Promise.all([
          test.expect(response.statusCode).to.equal(502),
          test.expect(response.body.message).to.equal('Error 405 received from POST to http://google.com')
        ])
      })
    })

    test.it('should have traced the errror', () => {
      return utils.moduleLogs()
        .then(logs => {
          test.expect(logs).to.contain('Error 405 received from POST to http://google.com')
        })
    })

    test.it('should have not tried to emit a webhook event', () => {
      return utils.moduleLogs()
        .then(logs => {
          test.expect(logs).to.not.contain('Error sending "webhook" event')
        })
    })
  })
})
