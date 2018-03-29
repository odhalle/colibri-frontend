<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <img src="@/assets/colibri.jpg" alt="Colibri" height="300px" class="mb-5">
        <blockquote>
          &#8220;Colibri ! Tu n’es pas fou ? Ce n’est pas avec ces gouttes d’eau que tu vas éteindre le feu !&#8221;
<br>
Et le colibri lui répondit : &#8220;Je le sais, mais je fais ma part.&#8221;
          <footer>
            <small>
              <em>&mdash;Extrait d'une légende amérindienne</em>
            </small>
          </footer>
        </blockquote>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
    }
  },
  mounted () {
    console.log(process.env.NODE_ENV)
    console.log(process.env.API_BASE_URL)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
