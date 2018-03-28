import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY')
  }
})

Vue.filter('formatStringArray', function (arrayValue) {
  return arrayValue.join(', ')
})

Vue.filter('formatBoolean', function (value) {
  return value ? 'Oui' : 'Non'
})
