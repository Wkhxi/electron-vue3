// eslint-disable-next-line no-undef
// const native = require('./build/Release/addon.node')
const native = require('bindings')('addon.node')
const paths = native.readFilePaths()
console.log('addon index', paths, native)

// eslint-disable-next-line no-undef
module.exports = native
