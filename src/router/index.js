import Vue from 'vue'
import Router from 'vue-router'
import HelloWorldRoute from './helloworld'
import CreateRelayRoute from './createrelay'
import CreateExtensionRoute from './createextension'
import CreateRideRoute from './createride'
import AccomodationsRoute from './accomodations'
import RidesRoute from './rides'
import RelaysRoute from './relays'
import ExtensionsRoute from './extensions'

Vue.use(Router)

export default new Router({
  routes: [
    HelloWorldRoute,
    AccomodationsRoute,
    RidesRoute,
    RelaysRoute,
    ExtensionsRoute,
    CreateRelayRoute,
    CreateExtensionRoute,
    CreateRideRoute
  ]
})
