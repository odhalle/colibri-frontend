import Vue from 'vue'
import Router from 'vue-router'
import HelloWorldRoute from './helloworld'
import CreateRelayRoute from './createrelay'
import Relaysroute from './relays'

Vue.use(Router)

export default new Router({
  routes: [
    Relaysroute,
    CreateRelayRoute,
    HelloWorldRoute
  ]
})
