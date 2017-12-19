import IO from 'socket.io-client'
import Vue from 'vue'

let socket = IO('http://127.0.0.1:3001')

socket.on('response', (res) => {
  Vue.set(BPC.o[res.object], res.key, res.value)
})

export default socket
