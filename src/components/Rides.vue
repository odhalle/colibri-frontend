<template>
  <v-data-table
    :headers="headers"
    :items="items"
    hide-actions
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.driver_last_name }}</td>
      <td>{{ props.item.driver_first_name }}</td>
      <td>{{ props.item.driver_email }}</td>
      <td>{{ props.item.driver_phone_number }}</td>
      <td>{{ props.item.driver_address.zip_code }}</td>
      <td>{{ props.item.driver_address.city }}</td>
      <td>{{ props.item.vehicle_capacity }}</td>
      <td>{{ props.item.date }}</td>
      <td>{{ props.item.driver_arrangements }}</td>
      <td>{{ props.item.remark }}</td>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      headers: [
        {
          text: 'Nom',
          align: 'left',
          sortable: true,
          value: 'driver_last_name'
        },
        { text: 'Prénom', value: 'driver_first_name' },
        { text: 'Email', value: 'driver_email' },
        { text: 'Numéro de téléphone', value: 'driver_phone_number' },
        { text: 'Ville', value: 'driver_address.zip_code' },
        { text: 'Code postal', value: 'driver_address.city' },
        { text: 'Capacité', value: 'vehicle_capacity' },
        { text: 'Date', value: 'date' },
        { text: 'Arrangements', value: 'driver_arrangements' },
        { text: 'Remarque', value: 'remark' }
      ],
      items: []
    }
  },
  mounted () {
    axios.get('http://localhost:8080/rides/').then(response => {
      this.items = response.data
    })
  }
}
</script>