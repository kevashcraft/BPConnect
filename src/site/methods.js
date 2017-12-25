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
  },
  notyConfirm (text, callback, ...opts) {
    let yes = opts.yes || 'Yes'
    let no = opts.no || 'No'

    let nC = new Noty({
      text: text,
      theme: 'semanticui',
      buttons: [
        Noty.button(yes, 'ui primary button', () => {
          nC.success = true
          nC.close()
          callback(nC)
        }),
        Noty.button(no, 'ui button', () => {
          nC.success = false
          nC.close()
          callback(nC)
        })
      ]
    }).show()
  }
}
