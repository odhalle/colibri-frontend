<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-flex>
          <v-card>
            <v-card-text>
              <!--guests_first_names, date, remark-->
              <v-form v-model="valid" ref="form" lazy-validation>
                <!-- Email -->
                <v-text-field
                  label="Email"
                  v-model="host_email"
                  :rules="host_email_rules"
                  required
                ></v-text-field>
                <!-- Name -->
                <v-text-field
                  label="Nom"
                  v-model="host_last_name"
                  :rules="host_last_name_rules"
                  :counter="40"
                  required
                ></v-text-field>
                <!-- First name -->
                <v-text-field
                  label="Prénom"
                  v-model="host_first_name"
                  :rules="host_first_name_rules"
                  :counter="20"
                  required
                ></v-text-field>
                <!-- Number of guests -->
                <v-select
                  label="Nombre d'invités"
                  v-model="number_of_guests"
                  :items="items"
                  :rules="[v => !!v || 'Number of guests is required']"
                  required
                ></v-select>
                <!-- guests_first_names -->
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
                <v-text-field
                v-model="remark"
                label="Vos remarques"
                multi-line
                :counter="150"
                ></v-text-field>

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
    </v-slide-y-transition>
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
    date: null,
    menu: false,
    modal: false,
    remark: ''
  }),

  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        axios.post('http://localhost:8080/relays/', {
          host_email: this.host_email,
          host_last_name: this.host_last_name,
          host_first_name: this.host_first_name,
          number_of_guests: this.number_of_guests,
          // TODO
          guests_first_names: ['TODO1', 'TODO2'],
          date: this.date,
          remark: this.remark
        })
      }
    },
    clear () {
      this.$refs.form.reset()
    }
  }
}
</script>
