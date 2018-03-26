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
              <v-text-field label="Numéro de téléphone" prepend-icon="phone" v-model="host_phone_number" :rules="host_phone_number_rules" required></v-text-field>
              <v-select label="Nombre d'invités" v-model="number_of_guests" :items="items" :rules="[v => !!v || 'Number of guests is required']" required></v-select>
              <v-select
              label="Prénoms des invités"
              chips
              tags
              prepend-icon="people"
              append-icon=""
              v-model="guests_first_names"
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
              <!-- remark -->
              <v-text-field v-model="remark" label="Vos remarques" multi-line :rules="remark_rules" :counter="150"></v-text-field>
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
    host_phone_number: '',
    host_phone_number_rules: [],
    number_of_guests: null,
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
    guests_first_names: [],
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
        axios.post('http://localhost:8080/extensions/', {
          host_email: this.host_email,
          host_last_name: this.host_last_name,
          host_first_name: this.host_first_name,
          host_phone_number: this.host_phone_number,
          number_of_guests: this.number_of_guests,
          guests_first_names: this.guests_first_names,
          date: this.date,
          remark: this.remark
        })
      }
    },
    clear () {
      this.$refs.form.reset()
    },
    remove (item) {
      this.guests_first_names.splice(this.guests_first_names.indexOf(item), 1)
      this.guests_first_names = [...this.guests_first_names]
    }
  }
}
</script>
