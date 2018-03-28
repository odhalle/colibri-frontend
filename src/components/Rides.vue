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
            <v-text-field label="Email" prepend-icon="mail" v-model="editedItem.driver_email" :rules="driver_email_rules" required></v-text-field>
            <v-text-field label="Nom" v-model="editedItem.driver_last_name" :rules="driver_last_name_rules" :counter="40" required></v-text-field>
            <v-text-field label="Prénom" v-model="editedItem.driver_first_name" :rules="driver_first_name_rules" :counter="20" required></v-text-field>
            <v-text-field label="Numéro de téléphone" prepend-icon="phone" v-model="editedItem.driver_phone_number" :rules="driver_phone_number_rules" required></v-text-field>
            <v-text-field label="Code postal" v-model="editedItem.driver_address.zip_code" :rules="driver_address_zip_code_rules" required></v-text-field>
            <v-text-field label="Ville" v-model="editedItem.driver_address.city" :rules="driver_address_city_rules" required></v-text-field>
            <v-select label="Capacité" v-model="editedItem.vehicle_capacity" :items="capacity_items" :rules="[v => !!v || 'Capacity is required']" required></v-select>
            <v-select
            label="Arrangements"
            chips
            tags
            prepend-icon=""
            append-icon=""
            v-model="editedItem.driver_arrangements"
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
            <v-text-field v-model="editedItem.remark" label="Vos remarques" multi-line :counter="150"></v-text-field>
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
          Chauffeurs
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
          <td>{{ props.item.driver_last_name }}</td>
          <td>{{ props.item.driver_first_name }}</td>
          <td>{{ props.item.driver_email }}</td>
          <td>{{ props.item.driver_phone_number }}</td>
          <td>{{ props.item.driver_address.zip_code }}</td>
          <td>{{ props.item.driver_address.city }}</td>
          <td>{{ props.item.vehicle_capacity }}</td>
          <td>{{ props.item.date | formatDate }}</td>
          <td>{{ props.item.driver_arrangements | formatStringArray }}</td>
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
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Rides',
  data () {
    return {
      dialog: false,
      valid: true,
      menu: false,
      search: '',
      driver_last_name_rules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 40) || 'Name must be less than 40 characters'
      ],
      driver_first_name_rules: [
        v => !!v || 'First name is required',
        v => (v && v.length <= 20) || 'First name must be less than 20 characters'
      ],
      driver_email_rules: [
        v => !!v || 'E-mail is required',
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          'E-mail must be valid'
      ],
      driver_phone_number_rules: [],
      driver_address_zip_code_rules: [],
      driver_address_city_rules: [],
      headers: [
        { text: 'Nom', align: 'left', sortable: true, value: 'driver_last_name' },
        { text: 'Prénom', value: 'driver_first_name' },
        { text: 'Email', value: 'driver_email' },
        { text: 'Numéro de téléphone', value: 'driver_phone_number' },
        { text: 'Code postal', value: 'driver_address.zip_code' },
        { text: 'Ville', value: 'driver_address.city' },
        { text: 'Capacité', value: 'vehicle_capacity' },
        { text: 'Date', value: 'date' },
        { text: 'Arrangements', value: 'driver_arrangements' },
        { text: 'Remarque', value: 'remark' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        driver_last_name: '',
        driver_first_name: '',
        driver_email: '',
        driver_phone_number: '',
        driver_address: {
          zip_code: '',
          city: ''
        },
        vehicle_capacity: 1,
        date: null,
        driver_arrangements: [],
        remark: ''
      },
      defaultItem: {
        driver_last_name: '',
        driver_first_name: '',
        driver_email: '',
        driver_phone_number: '',
        driver_address: {
          zip_code: '',
          city: ''
        },
        vehicle_capacity: 1,
        date: null,
        driver_arrangements: [],
        remark: ''
      },
      capacity_items: [
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
  mounted () {
    axios.get('http://localhost:8080/rides/').then(response => {
      this.items = response.data
    })
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Ride' : 'Edit Ride'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      var _this = this
      if (confirm('Are you sure you want to delete this ride?')) {
        axios
          .delete('http://localhost:8080/rides/' + item._id)
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
          // Edit existing item
          axios.put('http://localhost:8080/rides/' + this.editedItem._id, {
            driver_last_name: this.editedItem.driver_last_name,
            driver_first_name: this.editedItem.driver_first_name,
            driver_email: this.editedItem.driver_email,
            driver_phone_number: this.editedItem.driver_phone_number,
            driver_address: {
              zip_code: this.editedItem.driver_address.zip_code,
              city: this.editedItem.driver_address.city
            },
            vehicle_capacity: this.editedItem.vehicle_capacity,
            date: this.editedItem.date,
            driver_arrangements: this.editedItem.driver_arrangements,
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
          axios.post('http://localhost:8080/rides/', {
            driver_last_name: this.editedItem.driver_last_name,
            driver_first_name: this.editedItem.driver_first_name,
            driver_email: this.editedItem.driver_email,
            driver_phone_number: this.editedItem.driver_phone_number,
            driver_address: {
              zip_code: this.editedItem.driver_address.zip_code,
              city: this.editedItem.driver_address.city
            },
            vehicle_capacity: this.editedItem.vehicle_capacity,
            date: this.editedItem.date,
            driver_arrangements: this.editedItem.driver_arrangements,
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
    }
  }
}
</script>