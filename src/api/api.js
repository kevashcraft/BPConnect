import { Server } from 'http'
import IO from 'socket.io'

import postgres from './postgres'
import router from './router'
import upload from './upload'

let http = Server()
let io = IO(http)


io.on('connection', (socket) => {

  upload(socket)

  socket.on('request', async (request, callback) => {
    let route = request.route.split(':')
    let controller = route[0]
    let method = route[1]

    let data = request.data

    console.log("request received for ", request.route);
    let response = await router[controller][method](data)

    callback(response)
  })


  // socket.on('request', async (requests) => {
  //   // console.log("request", requests);
  //   if (!Array.isArray(requests)) {
  //     requests = [requests]
  //   }

  //   requests.forEach(async req => {
  //     let response = {
  //       object: req.object,
  //       key: req.key,
  //     }

  //     response.value = await router[req.controller][req.method](req.data, postgres)
  //     // console.log("response",response);
  //     socket.emit('response', response)
  //   })

  // })
})

http.listen('3001', () => {
  console.log("listening on 3001");
})
