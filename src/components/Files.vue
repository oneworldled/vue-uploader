<template lang="html">
  <div>
    <slot :files="files">
    </slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
      files: []
    }
  },
  mounted () {
    this.files = this.$uploader.queue
  }
}
</script>
