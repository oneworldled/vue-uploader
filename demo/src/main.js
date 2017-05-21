import VueUploader from '../../src/index.js'
import App from './components/App.vue'
import Vue from 'vue'

Vue.use(VueUploader)

new Vue({
  el: '#app',
  render: h => h(App),
  components: {
    App
  }
})
