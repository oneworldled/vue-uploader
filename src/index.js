import Uploader from './Uploader.js'
import Upload from './components/Upload.vue'
import Files from './components/Files.vue'

export default function install (Vue, options) {
  var uploader = new Uploader(Vue, options)
  Object.defineProperty(Vue.prototype, '$uploader', {
    get: function get () { return uploader }
  })
  Vue.component('upload', Upload)
  Vue.component('file-progress', Files)
}
