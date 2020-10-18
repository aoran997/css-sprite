globalThis.body = document.querySelector('body')

import filejs from './src/file'
import resultjs from './src/result'
globalThis.proxy = {
  files: []
};
globalThis.proxy = new Proxy(globalThis.proxy, {
  set(target, key, value) {
    target[key] = value
    if (key === 'files') {
      globalThis.showResult(target[key])
    }
    return true
  }
})

filejs()
resultjs()