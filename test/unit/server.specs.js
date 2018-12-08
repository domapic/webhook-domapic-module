const path = require('path')

const test = require('narval')

const DomapicMocks = require('./Domapic.mocks')
const RequestPromiseMocks = require('./RequestPromise.mocks')

test.describe('server', () => {
  const fooConfig = {
    url: 'foo-url',
    method: 'foo-method'
  }
  let domapic
  let requestPromise
  let abilities

  test.before(() => {
    domapic = new DomapicMocks()
    requestPromise = new RequestPromiseMocks()
    domapic.stubs.module.config.get.resolves(fooConfig)
    require('../../server')
  })

  test.after(() => {
    domapic.restore()
    requestPromise.restore()
  })

  test.it('should have created a Domapic Module, passing the package path', () => {
    test.expect(domapic.stubs.createModule.getCall(0).args[0].packagePath).to.equal(path.resolve(__dirname, '..', '..'))
  })

  test.it('should have called to start the server', () => {
    test.expect(domapic.stubs.module.start).to.have.been.called()
  })

  test.describe('when domapic module is returned', () => {
    test.before(() => {
      return domapic.utils.resolveOnStartCalled()
    })

    test.it('should have registered abilities', () => {
      abilities = domapic.stubs.module.register.getCall(0).args[0]
      test.expect(domapic.stubs.module.register).to.have.been.called()
    })
  })

  test.describe('switch action handler', () => {
    test.it('should request the webhook with the module configuration', async () => {
      await abilities.webhook.action.handler()
      test.expect(requestPromise.stub.getCall(0).args[0].uri).to.equal(fooConfig.url)
      test.expect(requestPromise.stub.getCall(0).args[0].method).to.equal(fooConfig.method)
    })

    test.it('should emit a webhook event', async () => {
      await abilities.webhook.action.handler()
      test.expect(domapic.stubs.module.events.emit).to.have.been.calledWith('webhook')
    })

    test.it('should return no data', async () => {
      const result = await abilities.webhook.action.handler()
      test.expect(result).to.be.undefined()
    })
  })
})
