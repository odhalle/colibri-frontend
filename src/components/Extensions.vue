<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-btn color="primary" dark slot="activator" class="mb-2">New Item</v-btn>
      <v-form v-model="valid" ref="form" lazy-validation>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
              <v-text-field label="Email" prepend-icon="mail" v-model="editedItem.host_email" :rules="host_email_rules" required></v-text-field>
              <v-text-field label="Nom" v-model="editedItem.host_last_name" :rules="host_last_name_rules" :counter="40" required></v-text-field>
              <v-text-field label="Prénom" v-model="editedItem.host_first_name" :rules="host_first_name_rules" :counter="20" required></v-text-field>
              <v-text-field label="Numéro de téléphone" prepend-icon="phone" v-model="editedItem.host_phone_number" :rules="host_phone_number_rules" required></v-text-field>
              <v-select label="Nombre d'invités" v-model="editedItem.number_of_guests" :items="number_of_guests_items" :rules="[v => !!v || 'Number of guests is required']" required></v-select>
              <v-select
              label="Prénoms des invités"
              chips
              tags
              prepend-icon="people"
              append-icon=""
              v-model="editedItem.guests_first_names"
              >
                <template slot="selection" slot-scope="data">
                  <v-chip
                  close
                  @input="remove(data.item)"
                  :selected="data.selected"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
              </v-select>
              <!-- date -->
              <v-menu
              ref="menu"
              lazy
              :close-on-content-click="false"
              v-model="menu"
              transition="scale-transition"
              offset-y
              full-width
              :nudge-right="40"
              min-width="290px"
              :return-value.sync="editedItem.date"
              >
              <v-text-field
              slot="activator"
              label="Picker in menu"
              v-model="editedItem.date"
              prepend-icon="event"
              readonly
              ></v-text-field>
              <v-date-picker v-model="editedItem.date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.menu.save(editedItem.date)">OK</v-btn>
              </v-date-picker>
              </v-menu>
              <v-text-field v-model="editedItem.remark" label="Vos remarques" multi-line :rules="remark_rules" :counter="300"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="saveItem" :disabled="!valid">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-card>
      <v-card-title>
        <span class="display-1">
          Prolongations
        </span>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Rechercher"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
    </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        hide-actions
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.host_last_name }}</td>
          <td>{{ props.item.host_first_name }}</td>
          <td>{{ props.item.host_email }}</td>
          <td>{{ props.item.host_phone_number }}</td>
          <td>{{ props.item.number_of_guests }}</td>
          <td>{{ props.item.guests_first_names | formatStringArray }}</td>
          <td>{{ props.item.date | formatDate }}</td>
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
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>
    <v-btn color="primary" fab fixed bottom right>
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Extensions',
  data () {
    return {
      dialog: false,
      valid: true,
      menu: false,
      search: '',
      headers: [
        { text: 'Nom', align: 'left', value: 'host_last_name' },
        { text: 'Prénom', value: 'host_first_name' },
        { text: 'Email', value: 'host_email' },
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
        host_email: '',
        host_last_name: '',
        host_first_name: '',
        host_phone_number: '',
        number_of_guests: 1,
        guests_first_names: [],
        date: null,
        remark: ''
      },
      defaultItem: {
        host_email: '',
        host_last_name: '',
        host_first_name: '',
        host_phone_number: '',
        number_of_guests: 1,
        guests_first_names: [],
        date: null,
        remark: ''
      },
      host_email_rules: [
        v => !!v || 'E-mail is required',
        v =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        'E-mail must be valid'
      ],
      host_last_name_rules: [],
      host_first_name_rules: [],
      host_phone_number_rules: [],
      remark_rules: [],
      number_of_guests_items: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20
      ]
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Ajouter une prolongation' : 'Editer une prolongation'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  mounted () {
    axios.get(process.env.API_BASE_URL + '/api/extensions/').then(response => {
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
      if (confirm('Are you sure you want to delete this extension ?')) {
        axios
          .delete(process.env.API_BASE_URL + '/api/extensions/' + item._id)
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
    saveItem () {
      var _this = this
      if (this.editedIndex > -1) {
        if (this.$refs.form.validate()) {
          // Update an existing item
          axios.put(process.env.API_BASE_URL + '/api/extensions/' + this.editedItem._id, {
            host_email: this.editedItem.host_email,
            host_last_name: this.editedItem.host_last_name,
            host_first_name: this.editedItem.host_first_name,
            host_phone_number: this.editedItem.host_phone_number,
            number_of_guests: this.editedItem.number_of_guests,
            guests_first_names: this.editedItem.guests_first_names,
            date: this.editedItem.date,
            remark: this.editedItem.remark
          })
          .then(function (response) {
            console.log(response)
            Object.assign(_this.items[_this.editedIndex], _this.editedItem)
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      } else {
        // Insert a new item
        if (this.$refs.form.validate()) {
          axios.post(process.env.API_BASE_URL + '/api/extensions/', {
            host_email: this.editedItem.host_email,
            host_last_name: this.editedItem.host_last_name,
            host_first_name: this.editedItem.host_first_name,
            host_phone_number: this.editedItem.host_phone_number,
            number_of_guests: this.editedItem.number_of_guests,
            guests_first_names: this.editedItem.guests_first_names,
            date: this.editedItem.date,
            remark: this.editedItem.remark
          })
          .then(function (response) {
            console.log(response)
            _this.items.push(_this.editedItem)
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      }
      this.close()
    },
    remove (item) {
      this.editedItem.guests_first_names.splice(this.editedItem.guests_first_names.indexOf(item), 1)
      this.editedItem.guests_first_names = [...this.editedItem.guests_first_names]
    }
  }
}
</script>