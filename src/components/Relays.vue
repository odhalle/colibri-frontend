<template>
  <v-data-table
    :headers="headers"
    :items="items"
    hide-actions
    class="elevation-1"
  >
  <!-- {"guests_first_names":[],"nb_of_guests":4,"date":"2018-03-20T00:00:00.000Z","remark":"hfsgqfsq","__v":0}, -->
    <template slot="items" slot-scope="props">
      <td>{{ props.item.last_name }}</td>
      <td>{{ props.item.first_name }}</td>
      <td>{{ props.item.email }}</td>
      <td>{{ props.item.nb_of_guests }}</td>
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
          value: 'last_name'
        },
        { text: 'Prénom', value: 'first_name' },
        { text: 'Email', value: 'email' },
        { text: 'Nombre d\'invités', value: 'nb_of_guests' },
        { text: 'Prénoms des invités', value: 'guests_first_names' },
        { text: 'Date', value: 'date' },
        { text: 'Remarques', value: 'remark' }
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