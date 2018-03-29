<template>
  <v-container fluid>
    <v-layout column align-center>
      <v-flex>
        <v-card>
          <v-card-text>
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-text-field label="Email" prepend-icon="mail" v-model="driver_email" :rules="driver_email_rules" required></v-text-field>
              <v-text-field label="Nom" v-model="driver_last_name" :rules="driver_last_name_rules" :counter="40" required></v-text-field>
              <v-text-field label="Prénom" v-model="driver_first_name" :rules="driver_first_name_rules" :counter="20" required></v-text-field>
              <v-text-field label="Numéro de téléphone" prepend-icon="phone" v-model="driver_phone_number" :rules="driver_phone_number_rules" required></v-text-field>
              <v-text-field label="Code postal" v-model="driver_address.zip_code" :rules="driver_address_zip_code_rules" required></v-text-field>
              <v-text-field label="Ville" v-model="driver_address.city" :rules="driver_address_city_rules" required></v-text-field>
              <v-select label="Capacité" v-model="vehicle_capacity" :items="items" :rules="[v => !!v || 'Capacity is required']" required></v-select>
              <v-select
              label="Arrangements"
              chips
              tags
              prepend-icon=""
              append-icon=""
              v-model="driver_arrangements"
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
    driver_last_name: '',
    driver_last_name_rules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 40) || 'Name must be less than 40 characters'
    ],
    driver_first_name: '',
    driver_first_name_rules: [
      v => !!v || 'First name is required',
      v => (v && v.length <= 20) || 'First name must be less than 20 characters'
    ],
    driver_email: '',
    driver_email_rules: [
      v => !!v || 'E-mail is required',
      v =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        'E-mail must be valid'
    ],
    driver_phone_number: '',
    driver_phone_number_rules: [],
    driver_address: {
      zip_code: '',
      city: ''
    },
    driver_address_zip_code_rules: [],
    driver_address_city_rules: [],
    vehicle_capacity: null,
    items: [
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
    driver_arrangements: [],
    date: null,
    menu: false,
    modal: false,
    remark: '',
    remark_rules: [
      v => (v.length <= 300) || 'Remark name must be less than 300 characters'
    ]
  }),

  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        axios.post('http://localhost:8080/api/rides/', {
          driver_email: this.driver_email,
          driver_last_name: this.driver_last_name,
          driver_first_name: this.driver_first_name,
          driver_phone_number: this.driver_phone_number,
          driver_address: {
            zip_code: this.driver_address.zip_code,
            city: this.driver_address.city
          },
          vehicle_capacity: this.vehicle_capacity,
          driver_arrangements: this.driver_arrangements,
          date: this.date,
          remark: this.remark
        })
      }
    },
    clear () {
      this.$refs.form.reset()
    },
    remove (item) {
      this.driver_arrangements.splice(this.driver_arrangements.indexOf(item), 1)
      this.driver_arrangements = [...this.driver_arrangements]
    }
  }
}
</script>
