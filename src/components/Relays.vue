<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-btn color="primary" dark slot="activator" class="mb-2">New Item</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Nom" v-model="editedItem.host_last_name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Prénom" v-model="editedItem.host_first_name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Email" v-model="editedItem.host_email"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Nombres d'invités" v-model="editedItem.number_of_guests"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Remark" multi-line v-model="editedItem.remark"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      dialog: false,
      headers: [
        {
          text: 'Nom',
          align: 'left',
          sortable: true,
          value: 'host_last_name'
        },
        { text: 'Prénom', value: 'host_first_name' },
        { text: 'Email', value: 'host_email' },
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
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  mounted () {
    axios.get('http://localhost:8080/relays/').then(response => {
      this.items = response.data
    })
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      var _this = this
      if (confirm('Are you sure you want to delete this relay?')) {
        axios
          .delete('http://localhost:8080/relays/' + item._id)
          .then(function (response) {
            console.log(response)
            const index = _this.items.indexOf(item)
            _this.items.splice(index, 1)
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem)
      } else {
        this.items.push(this.editedItem)
      }
      this.close()
    }
  },
  name: 'Relays'
}
</script>