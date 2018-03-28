<template>
  <v-container fluid>
    <v-layout column align-center>
      <v-flex>
        <v-card>
          <v-card-text>
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-text-field label="Email" prepend-icon="mail" v-model="host_email" :rules="host_email_rules" required></v-text-field>
              <v-text-field label="Nom" v-model="host_last_name" :rules="host_last_name_rules" :counter="40" required></v-text-field>
              <v-text-field label="Prénom" v-model="host_first_name" :rules="host_first_name_rules" :counter="20" required></v-text-field>
              <v-text-field label="Alias Facebook" v-model="host_alias" :rules="host_alias_rules" :counter="20" required></v-text-field>
              <v-text-field label="Numéro de téléphone" prepend-icon="phone" v-model="host_phone_number" :rules="host_phone_number_rules" required></v-text-field>
              <v-text-field label="Rue" v-model="host_address.street" :rules="host_address_street_rules" required></v-text-field>
              <v-text-field label="Code postal" v-model="host_address.zip_code" :rules="host_address_zip_code_rules" required></v-text-field>
              <v-text-field label="Ville" v-model="host_address.city" :rules="host_address_city_rules" required></v-text-field>
              <v-select label="Nombre d'invités" v-model="number_of_guests" :items="number_of_guests_items" :rules="[v => !!v || 'Number of guests is required']" required></v-select>
              <v-select label="Nombre de nuits" v-model="number_of_nights" :items="number_of_nights_items" :rules="[v => !!v || 'Number of nights is required']" required></v-select>
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
              :return-value.sync="date"
              >
              <v-text-field
              slot="activator"
              label="Picker in menu"
              v-model="date"
              prepend-icon="event"
              readonly
              ></v-text-field>
              <v-date-picker v-model="date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
              </v-date-picker>
              </v-menu>
              <v-checkbox label="Je conduis moi-même" v-model="host_does_drive"></v-checkbox>
              <v-select label="Place additionnelles" v-model="host_additional_places" :items="host_additional_places_items" :rules="[v => !!v || 'Number of additionnal places is required']" required></v-select>
              <v-text-field v-model="host_selected_driver" label="Chauffeur"></v-text-field>
              <v-text-field v-model="remark" label="Vos remarques" multi-line :counter="150"></v-text-field>
              <v-btn
                @click="submit"
                :disabled="!valid"
              >
                submit
              </v-btn>
              <v-btn @click="clear">clear</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    valid: true,
    host_last_name: '',
    host_last_name_rules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 40) || 'Name must be less than 40 characters'
    ],
    host_first_name: '',
    host_first_name_rules: [
      v => !!v || 'First name is required',
      v => (v && v.length <= 20) || 'First name must be less than 20 characters'
    ],
    host_email: '',
    host_email_rules: [
      v => !!v || 'E-mail is required',
      v =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        'E-mail must be valid'
    ],
    host_alias: '',
    host_alias_rules: '',
    host_phone_number: '',
    host_phone_number_rules: [],
    host_address: {
      street: '',
      zip_code: '',
      city: ''
    },
    host_address_street_rules: [],
    host_address_zip_code_rules: [],
    host_address_city_rules: [],
    number_of_guests: null,
    number_of_guests_items: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20'
    ],
    number_of_nights: null,
    number_of_nights_items: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20'
    ],
    date: null,
    menu: false,
    modal: false,
    host_does_drive: false,
    host_additional_places: null,
    host_additional_places_items: [
      '1',
      '2',
      '3',
      '4',
      '5'
    ],
    host_selected_driver: '',
    remark: '',
    remark_rules: [
      v => (v.length <= 300) || 'Remark name must be less than 300 characters'
    ]
  }),

  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        axios.post('http://localhost:8080/accomodations/', {
          host_last_name: this.host_last_name,
          host_first_name: this.host_first_name,
          host_email: this.host_email,
          host_alias: this.host_alias,
          host_phone_number: this.host_phone_number,
          number_of_guests: this.number_of_guests,
          number_of_nights: this.number_of_nights,
          date: this.date,
          host_does_drive: this.host_does_drive,
          host_additional_places: this.host_additional_places,
          host_selected_driver: this.host_selected_driver,
          remark: this.remark,
          host_address: {
            street: this.host_address.street,
            zip_code: this.host_address.zip_code,
            city: this.host_address.city
          }
        })
      }
    },
    clear () {
      this.$refs.form.reset()
    }
  }
}
</script>
