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
            <v-text-field label="Alias Facebook" v-model="editedItem.host_alias" :rules="host_alias_rules" :counter="20" required></v-text-field>
            <v-text-field label="Numéro de téléphone" prepend-icon="phone" v-model="editedItem.host_phone_number" :rules="host_phone_number_rules" required></v-text-field>
            <v-text-field label="Rue" v-model="editedItem.host_address.street" :rules="host_address_street_rules" required></v-text-field>
            <v-text-field label="Numéro" v-model="editedItem.host_address.number" :rules="host_address_number_rules" required></v-text-field>
            <v-text-field label="Code postal" v-model="editedItem.host_address.zip_code" :rules="host_address_zip_code_rules" required></v-text-field>
            <v-text-field label="Ville" v-model="editedItem.host_address.city" :rules="host_address_city_rules" required></v-text-field>
            <v-select label="Nombre d'invités" v-model="editedItem.number_of_guests" :items="number_of_guests_items" :rules="[v => !!v || 'Number of guests is required']" required></v-select>
            <v-select label="Nombre de nuits" v-model="editedItem.number_of_nights" :items="number_of_nights_items" :rules="[v => !!v || 'Number of nights is required']" required></v-select>
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
            <v-checkbox label="Je conduis moi-même" v-model="editedItem.host_does_drive"></v-checkbox>
            <v-select label="Place additionnelles" v-model="editedItem.host_additional_places" :items="host_additional_places_items" :rules="[]" required></v-select>
            <v-text-field v-model="editedItem.host_selected_driver" label="Chauffeur"></v-text-field>
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
          Hébergeurs
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
          <!--<td>{{ props.item.host_alias }}</td>-->
          <td>{{ props.item.host_phone_number }}</td>
          <td>{{ props.item.number_of_guests }}</td>
          <td>{{ props.item.number_of_nights }}</td>
          <td>{{ props.item.date | formatDate }}</td>
          <td>{{ props.item.host_does_drive | formatBoolean }}</td>
          <td>{{ props.item.host_additional_places }}</td>
          <td>{{ props.item.host_selected_driver }}</td>
          <!--<td>{{ props.item.remark }}</td>-->
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
        // { text: 'Alias', value: 'host_alias' },
        { text: 'Numéro de téléphone', value: 'host_phone_number' },
        { text: "Nombre d'invités", value: 'number_of_guests' },
        { text: 'Nombre de nuits', value: 'number_of_nights' },
        { text: 'Date', value: 'date' },
        { text: 'Conduit ?', value: 'host_does_drive' },
        { text: 'Places suppl.', value: 'host_additional_places' },
        { text: 'Autre conducteur', value: 'host_selected_driver' },
        // { text: 'Remarque', value: 'remark' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        host_last_name: '',
        host_first_name: '',
        host_email: '',
        host_alias: '',
        host_phone_number: '',
        host_address: {
          number: '',
          street: '',
          zip_code: '',
          city: ''
        },
        number_of_guests: 1,
        number_of_nights: 1,
        date: '',
        host_does_drive: false,
        host_additional_places: 0,
        host_selected_driver: '',
        remark: ''
      },
      defaultItem: {
        host_last_name: '',
        host_first_name: '',
        host_email: '',
        host_alias: '',
        host_phone_number: '',
        host_address: {
          number: '',
          street: '',
          zip_code: '',
          city: ''
        },
        number_of_guests: 1,
        number_of_nights: 1,
        date: '',
        host_does_drive: false,
        host_additional_places: 0,
        host_selected_driver: '',
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
      host_alias_rules: [],
      host_phone_number_rules: [],
      host_address_street_rules: [],
      host_address_city_rules: [],
      host_address_number_rules: [],
      host_address_zip_code_rules: [],
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
      ],
      number_of_nights_items: [
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
      ],
      host_additional_places_items: [
        0,
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
    axios.get(process.env.API_BASE_URL + '/api/accomodations/').then(response => {
      this.items = response.data
    })
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Accomodation' : 'Edit Accomodation'
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
          .delete(process.env.API_BASE_URL + '/api/accomodations/' + item._id)
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
          axios.put(process.env.API_BASE_URL + '/api/accomodations/' + this.editedItem._id, {
            host_last_name: this.editedItem.host_last_name,
            host_first_name: this.editedItem.host_first_name,
            host_email: this.editedItem.host_email,
            host_alias: this.editedItem.host_alias,
            host_phone_number: this.editedItem.host_phone_number,
            host_address: {
              number: this.editedItem.host_address.number,
              street: this.editedItem.host_address.street,
              zip_code: this.editedItem.host_address.zip_code,
              city: this.editedItem.host_address.city
            },
            number_of_guests: this.editedItem.number_of_guests,
            number_of_nights: this.editedItem.number_of_nights,
            date: this.editedItem.date,
            host_does_drive: this.editedItem.host_does_drive,
            host_additional_places: this.editedItem.host_additional_places,
            host_selected_driver: this.editedItem.host_selected_driver,
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
          axios.post(process.env.API_BASE_URL + '/api/accomodations/', {
            host_last_name: this.editedItem.host_last_name,
            host_first_name: this.editedItem.host_first_name,
            host_email: this.editedItem.host_email,
            host_alias: this.editedItem.host_alias,
            host_phone_number: this.editedItem.host_phone_number,
            host_address: {
              number: this.editedItem.host_address.number,
              street: this.editedItem.host_address.street,
              zip_code: this.editedItem.host_address.zip_code,
              city: this.editedItem.host_address.city
            },
            number_of_guests: this.editedItem.number_of_guests,
            number_of_nights: this.editedItem.number_of_nights,
            date: this.editedItem.date,
            host_does_drive: this.editedItem.host_does_drive,
            host_additional_places: this.editedItem.host_additional_places,
            host_selected_driver: this.editedItem.host_selected_driver,
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