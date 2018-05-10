import { Server } from 'http'
import IO from 'socket.io'

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

    console.log('request received for ', request.route)
    let response = await router[controller][method](data)

    callback(response)
  })

})

http.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
