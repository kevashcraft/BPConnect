import Noty from 'noty'

export default {
  req (route, data) {
    console.log('requesting', route, data)
    return new Promise((resolve, reject) => {
      this.socket.emit('request', {route, data}, (response) => {
        console.log('received', response)
        resolve(response)
      })
    })
  },
  noty (text, type = 'success') {
    new Noty({text: text, theme: 'semanticui', type: type, timeout: 2500}).show()
  }
}
