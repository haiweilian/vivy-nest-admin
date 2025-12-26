/* eslint-disable @typescript-eslint/no-this-alias */
// Modify https://github.com/expressjs/multer/blob/main/storage/disk.js
import crypto from 'crypto'
import * as OSS from 'ali-oss'

function getFilename(req, file, cb) {
  crypto.randomBytes(16, function (err, raw) {
    cb(err, err ? undefined : raw.toString('hex'))
  })
}

function getDestination(req, file, cb) {
  cb(null, '')
}

function OssStorage(opts) {
  this.client = new OSS(opts.config)
  this.getFilename = opts.filename || getFilename

  if (typeof opts.destination === 'string') {
    this.getDestination = function ($0, $1, cb) {
      cb(null, opts.destination)
    }
  } else {
    this.getDestination = opts.destination || getDestination
  }
}

OssStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  const that = this

  that.getDestination(req, file, function (err, destination) {
    if (err) return cb(err)

    that.getFilename(req, file, function (err, filename) {
      if (err) return cb(err)

      const finalPath = destination ? `${destination}/${filename}` : filename

      let size = 0
      file.stream.on('data', (chunk) => {
        size += Buffer.byteLength(chunk)
      })

      that.client
        .putStream(finalPath, file.stream)
        .then(function (result) {
          cb(null, {
            destination: destination,
            filename: filename,
            path: finalPath,
            size,
          })
        })
        .catch(function (err) {
          cb(err)
        })
    })
  })
}

OssStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  const path = file.path

  delete file.destination
  delete file.filename
  delete file.path

  this.client
    .delete(path)
    .then((result) => cb(null, result))
    .catch(cb)
}

export default function (opts) {
  return new OssStorage(opts)
}
