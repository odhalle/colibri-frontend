<template>
  <v-data-table
    :headers="headers"
    :items="items"
    hide-actions
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.host_last_name }}</td>
      <td>{{ props.item.host_first_name }}</td>
      <td>{{ props.item.host_email }}</td>
      <td>{{ props.item.host_alias }}</td>
      <td>{{ props.item.host_phone_number }}</td>
      <td>{{ props.item.number_of_guests }}</td>
      <td>{{ props.item.number_of_nights }}</td>
      <td>{{ props.item.date }}</td>
      <td>{{ props.host_does_drive }}</td>
      <td>{{ props.item.host_additional_places }}</td>
      <td>{{ props.item.host_selected_driver }}</td>
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
        { text: 'Alias', value: 'host_alias' },
        { text: 'Numéro de téléphone', value: 'host_phone_number' },
        { text: "Nombre d'invités", value: 'number_of_guests' },
        { text: 'Nombre de nuits', value: 'number_of_nights' },
        { text: 'Date', value: 'date' },
        { text: 'Conduit ?', value: 'host_does_drive' },
        { text: 'Places suppl.', value: 'host_additional_places' },
        { text: 'Autre conducteur', value: 'host_selected_driver' },
        { text: 'Remarque', value: 'remark' }
      ],
      items: []
    }
  },
  mounted () {
    axios.get('http://localhost:8080/accomodations/').then(response => {
      this.items = response.data
    })
  }
}
</script>