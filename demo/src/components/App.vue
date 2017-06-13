<template lang="html">
  <div>
    <upload class="upload" :destination="options.url" :accepted="options.acceptedFiles" :headers="options.headers">
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
        url: 'http://localhost:8000/api/v1/displays/1/images',
        headers: {
          Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hZHZlcnBvc3QuY29tIiwiYXVkIjoiaHR0cDpcL1wvYWR2ZXJwb3N0LmNvbSIsImlhdCI6MTQ5NzMzMzc0NywibmJmIjoxNDk3MzMzNzQ3LCJleHAiOjE0OTczMzU1NDcsImFwcGxpY2F0aW9uSWQiOiIxIiwiaXNBZG1pbiI6dHJ1ZSwicGVybWlzc2lvbnMiOnsiZGlzcGxheSI6ZmFsc2UsInByaWNpbmciOmZhbHNlLCJjYW1wYWlnbiI6ZmFsc2UsIm1lZGlhIjpmYWxzZSwiaW52b2ljZSI6ZmFsc2UsInRoaXJkX3BhcnR5X2tleSI6ZmFsc2UsInRlYW0iOmZhbHNlfSwidGVhbXMiOltdLCJ1c2VySWQiOiIxMiIsInVzZXJuYW1lIjoiYWRhbSJ9.5A7dguSxbssbjA5si-jOAhZ4ObbpxHAxBcdMQ_YkR_4'
        }
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
