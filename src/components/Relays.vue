<template>
  <v-data-table
    :headers="headers"
    :items="items"
    hide-actions
    class="elevation-1"
  >
  <!-- {"guests_first_names":[],"nb_of_guests":4,"date":"2018-03-20T00:00:00.000Z","remark":"hfsgqfsq","__v":0}, -->
    <template slot="items" slot-scope="props">
      <td>{{ props.item.host_last_name }}</td>
      <td>{{ props.item.host_first_name }}</td>
      <td>{{ props.item.host_email }}</td>
      <td>{{ props.item.number_of_guests }}</td>
      <td>{{ props.item.guests_first_names }}</td>
      <td>{{ props.item.date }}</td>
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
          value: 'host_last_name'
        },
        { text: 'Prénom', value: 'host_first_name' },
        { text: 'Email', value: 'host_email' },
        { text: 'Nombre d\'invités', value: 'number_of_guests' },
        { text: 'Prénoms des invités', value: 'guests_first_names' },
        { text: 'Date', value: 'date' },
        { text: 'Remarque', value: 'remark' }
      ],
      items: []
    }
  },
  mounted () {
    axios.get('http://localhost:8080/relays/')
    .then(response => { this.items = response.data })
  }
}
</script>