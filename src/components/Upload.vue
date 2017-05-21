<template lang="html">
  <div @drop.prevent="call($event, 'drop')"
   @dragover.prevent="call($event, 'over')"
   @dragenter.prevent="call($event, 'enter')"
   @dragleave.prevent="call($event, 'leave')"
   @dragend.prevent="call($event, 'end')">
    <form v-on:submit.prevent="upload" ref="form" :files="files">
      <slot name="form-fields"></slot>
      <slot name="file-input">
        <input id="default-file-input" type="file" @change="fileChange" multiple :accept="acceptedTypes"/>
        <input type="submit" value="Upload">
      </slot>
      <slot name="files" :files='files'>
        <ul>
          <li v-for="file in files">
            {{ file.file.name }} - {{ (file.progress * 100).toFixed(2) }} / 100
            <span @click="stop(file)">&#9608;</span>
            <span @click="remove(file)">&times;</span>
          </li>
        </ul>
      </slot>
    </form>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'upload',
  props: {
    events: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    },
    accepted: {
      type: Array,
      required: false,
      default () {
        return []
      }
    },
    destination: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      params: {},
      files: []
    }
  },
  computed: {
    acceptedTypes () {
      return this.accepted.length > 0 ? this.accepted.join() : ''
    }
  },
  mounted () {
    let fileInputs = this.getFileInputs()
    for (let fileInput of fileInputs) {
      fileInput.addEventListener('change', this.fileChange)
    }
  },
  beforeDestroy () {
    let fileInputs = this.getFileInputs()
    for (let fileInput of fileInputs) {
      fileInput.removeEventListener('change', this.fileChange)
    }
  },
  methods: {
    serialise () {
      let form = this.$refs.form

      if (!form || form.nodeName !== 'FORM') {
        return
      }

      let i
      let j
      let params = {}

      for (i = form.elements.length - 1; i >= 0; i = i - 1) {
        if (form.elements[i].name === '') {
          continue
        }
        switch (form.elements[i].nodeName) {
          case 'INPUT':
            switch (form.elements[i].type) {
              case 'text':
              case 'hidden':
              case 'password':
              case 'button':
              case 'reset':
              case 'submit':
                params[form.elements[i].name] = form.elements[i].value
                break
              case 'checkbox':
              case 'radio':
                if (form.elements[i].checked) {
                  params[form.elements[i].name] = form.elements[i].value
                }
                break
            }
            break
          case 'file':
            break
          case 'TEXTAREA':
            params[form.elements[i].name] = form.elements[i].value
            break
          case 'SELECT':
            switch (form.elements[i].type) {
              case 'select-one':
                let selectedIndex = form.elements[i].selectedIndex
                let select = form.elements[i]
                params[select.name] = select.options[selectedIndex].value
                break
              case 'select-multiple':
                for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                  if (form.elements[i].options[j].selected) {
                    params[form.elements[i].name] = form.elements[i].options[j].value
                  }
                }
                break
            }
            break
          case 'BUTTON':
            switch (form.elements[i].type) {
              case 'reset':
              case 'submit':
              case 'button':
                params[form.elements[i].name] = form.elements[i].value
                break
            }
            break
        }
      }
      return params
    },
    upload () {
      if (this.files.length > 0) {
        for (let file of this.files) {
          if (file.status === 'queued') {
            file.status = 'ready'
          }
        }
        this.$uploader.processQueue()
      }
    },
    fileChange (e) {
      let newFiles = [].slice.call(e.target.files).filter(this.validateFile)
      this.addFiles(newFiles)
    },
    fileDrop (e) {
      let newFiles = [].slice.call(e.dataTransfer.files).filter(this.validateFile)
      this.addFiles(newFiles)
    },
    addFiles (newFiles) {
      let params = this.serialise()

      for (let file of newFiles){
        let item = {
          file: file,
          params: params
        }

        if (this.destination) {
          item.destination = this.destination
        }

        let filePresent = !! _.find(this.$uploader.queue, (queued) => {
          return queued.file.name === file.name
        })

        if (!filePresent) {
          this.$uploader.add(item)
          this.files.push(item)
        }
      }
    },
    validateFile (file) {
      let accepted = false

      if (this.accepted.length > 0) {
        for (let type of this.accepted) {
          let fileType = file.type.split('/')
          let mimeType = type.split('/')

          if (fileType[0] === mimeType[0]) {
            if (fileType[1] === mimeType[1] || mimeType[1] === '*') {
              accepted = true
              break
            }
          }
        }
      } else {
        accepted = true
      }

      if (!accepted) {
        this.$emit('invalid', file)
      }

      return accepted
    },
    call (e, method) {
      if (method in this.events) {
        this.events[method].call(this, e)

        if (method === 'drop') {
          this.fileDrop(e)        }
      } else if (method === 'drop') {
        this.fileDrop(e)
      }
    },
    getFileInputs () {
      let form = this.$refs.form
      let fileInputs = []

      if (form.length > 0) {
        for (let i = 0; i < form.length; i++) {
          if (form[i].getAttribute('type') === 'file' && form[i].id !== 'default-file-input') {
            fileInputs.push(form[i])
          }
        }
      }
      return fileInputs
    },
    stop (file) {
      this.$uploader.cancel(file)
    },
    remove (file) {
      this.$uploader.remove(file)
    }
  },
}
</script>
