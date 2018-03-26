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
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                  label="Nom"
                  v-model="editedItem.host_last_name"
                  :rules="host_last_name_rules"
                  :counter="40"
                  required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                  label="Prénom"
                  v-model="editedItem.host_first_name"
                  :rules="host_first_name_rules"
                  :counter="20"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                  label="Email"
                  v-model="editedItem.host_email"
                  :rules="host_email_rules"
                  required
                  ></v-text-field>
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
            <v-btn color="blue darken-1" flat @click.native="save" :disabled="!valid">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
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
      valid: true,
      host_last_name_rules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 40) || 'Name must be less than 40 characters'
      ],
      host_first_name_rules: [
        v => !!v || 'First name is required',
        v => (v && v.length <= 20) || 'First name must be less than 20 characters'
      ],
      host_email_rules: [
        v => !!v || 'E-mail is required',
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          'E-mail must be valid'
      ],
      headers: [
        { text: 'Nom', align: 'left', sortable: true, value: 'driver_last_name' },
        { text: 'Prénom', value: 'driver_first_name' },
        { text: 'Email', value: 'driver_email' },
        { text: 'Numéro de téléphone', value: 'driver_phone_number' },
        { text: 'Ville', value: 'driver_address.zip_code' },
        { text: 'Code postal', value: 'driver_address.city' },
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
        date: Date.now(),
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
        date: Date.now(),
        driver_arrangements: [],
        remark: ''
      }
    }
  },
  mounted () {
    axios.get('http://localhost:8080/rides/').then(response => {
      this.items = response.data
    })
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
    save () {
      if (this.editedIndex > -1) {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
          axios.post('http://localhost:8080/rides/', {
            driver_last_name: this.editItem.driver_last_name,
            driver_first_name: this.editItem.driver_first_name,
            driver_email: this.editItem.driver_email,
            driver_phone_number: this.editItem.driver_phone_number,
            driver_address: {
              zip_code: this.editItem.driver_address.zip_code,
              city: this.editItem.driver_address.city
            },
            vehicle_capacity: this.editItem.vehicle_capacity,
            date: this.editItem.date,
            // TODO
            driver_arrangements: [],
            remark: this.editItem.remark
          })
          Object.assign(this.items[this.editedIndex], this.editedItem)
        }
      } else {
        this.items.push(this.editedItem)
      }
      this.close()
    }
  },
  name: 'Rides'
}
</script>