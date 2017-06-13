var queue = []
var maxUploads
var url
var uploading = 0
var globalHeaders = {}

function Uploader (Vue, options) {
  options = options || {}
  url = options.url || ''
  maxUploads = options.maxUploads || 3
  globalHeaders = options.headers || {}
}

Uploader.prototype.queue = queue
Uploader.prototype.url = url
Uploader.prototype.maxUploads = maxUploads
Uploader.prototype.uploading = uploading

// {
//    params: {k, v},
//    file: fileObject,
//    status: (success, error, queued, uploading, aborted)
//    progress: float
// }
Uploader.prototype.add = function (file) {
  file.status = 'queued'
  file.progress = 0
  queue.push(file)
}

Uploader.prototype.processQueue = function () {
  if (uploading < maxUploads) {
    let file = this.getNext()
    if (file) {
      let destination = file.destination ? file.destination : url
      let headers = file.headers || {}
      this.upload(destination, file, file.params, headers)
      this.processQueue()
      uploading++
    }
  }
}

Uploader.prototype.getNext = function () {
  return queue.find((element) => {
    return element.status === 'ready'
  })
}

Uploader.prototype.remove = function (file) {
  queue.splice(queue.findIndex((element) => {
    return element === file
  }), 1)
}

Uploader.prototype.cancel = function (file) {
  if (file.request) {
    file.request.abort()
  }
}

Uploader.prototype.updateProgress = function (event, file) {
  // set status to uploading
  file.status = 'uploading'
  if (event.lengthComputable) {
    // update progress
    file.progress = event.loaded / event.total
  }
}

Uploader.prototype.transferCanceled = function (event, file) {
  // set file status to aborted
  file.status = 'aborted'
  uploading--
  this.processQueue()
}

Uploader.prototype.transferComplete = function (request, file) {
  if (request.status >= 200 && request.status < 300) {
    // set file status to success
    file.status = 'success'
  } else {
    // set file status to error
    // add statusCode & statusText
    file.status = 'error'
    file.statusCode = request.status
    file.statusText = request.statusText
  }

  uploading--
  this.processQueue()
}

Uploader.prototype.error = function (request, file) {
  // set status to error
  // add statusCode & statusText
  file.status = 'error'
  file.statusCode = request.status
  file.statusText = request.statusText
  request.abort()
  uploading--
  this.processQueue()
}

Uploader.prototype.upload = function (url, file, params, headers) {
  let self = this
  file.status = 'uploading'
  // Create the request and add some upload listeners
  let request = new XMLHttpRequest()
  file.request = request

  request.onload = function () {
    self.transferComplete(request, file)
  }
  request.onerror = function () {
    self.error(request, file)
  }
  request.upload.onprogress = function (event) {
    self.updateProgress(event, file)
  }
  request.onabort = function (event) {
    self.transferCanceled(event, file)
  }

  let formData = new FormData()

  // Append any passed parameters
  for (let key of Object.keys(params)) {
    formData.append(key, params[key])
  }

  // Add the file
  formData.append('file', file.file, file.file.name)

  request.open('POST', url, true)

  let requestHeaders = Object.assign({}, this.headers, headers)
  // set any request headers
  Object.keys( requestHeaders ).forEach( key => {
    request.setRequestHeader(key, requestHeaders[key])
  })
  
  request.send(formData)
}

export default Uploader
