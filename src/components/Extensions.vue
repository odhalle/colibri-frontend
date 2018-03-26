<template>
  <v-data-table
    :headers="headers"
    :items="items"
    hide-actions
    class="elevation-1"
  >
  <!-- {"guests_first_names":[],"nb_of_guests":4,"date":"2018-03-20T00:00:00.000Z","remark":"hfsgqfsq","__v":0}, -->
    <template slot="items" slot-scope="props">
      <td>{{ props.item.host_email }}</td>
      <td>{{ props.item.host_last_name }}</td>
      <td>{{ props.item.host_first_name }}</td>
      <td>{{ props.item.host_phone_number }}</td>
      <td>{{ props.item.number_of_guests }}</td>
      <td>{{ props.item.guests_first_names }}</td>
      <td>{{ props.item.date }}</td>
      <td>{{ props.item.remark }}</td>
      <td class="justify-center layout px-0">
        <v-btn icon class="mx-0" @click="editItem(props.item)">
          <v-icon color="grey">edit</v-icon>
        </v-btn>
        <v-btn icon class="mx-0" @click="deleteItem(props.item)">
          <v-icon color="grey">delete</v-icon>
        </v-btn>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      headers: [
        { text: 'Email', value: 'host_email', sortable: true },
        { text: 'Nom', align: 'left', sortable: true, value: 'host_last_name' },
        { text: 'Prénom', value: 'host_first_name' },
        { text: 'Numéro de téléphone', value: 'host_phone_number' },
        { text: "Nombre d'invités", value: 'number_of_guests' },
        { text: 'Prénoms des invités', value: 'guests_first_names' },
        { text: 'Date', value: 'date' },
        { text: 'Remarque', value: 'remark' },
        { text: 'Actions', value: 'name', sortable: false }

      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      }
    }
  },
  mounted () {
    axios.get('http://localhost:8080/extensions/').then(response => {
      this.items = response.data
    })
  },
  methods: {
    deleteItem (item) {
      var _this = this
      if (confirm('Are you sure you want to delete this relay?')) {
        axios
          .delete('http://localhost:8080/extensions/' + item._id)
          .then(function (response) {
            console.log(response)
            const index = _this.items.indexOf(item)
            _this.items.splice(index, 1)
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  }
}
</script>