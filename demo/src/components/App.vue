<template lang="html">
  <div>
    <upload class="upload" :destination="options.url" :accepted="options.acceptedFiles">
    </upload>
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: {
        acceptedFiles: [
          'image/*',
          'video/*'
        ],
        url: 'http://0.0.0.0:8090/upload'
      }
    }
  }
}
</script>

<style lang="css">
.upload {
  width: 500px;
  height: 500px;
  border: solid 1px;
}
</style>
