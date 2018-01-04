import moment from 'moment'
import path from 'path'
import pdf from 'html-pdf'

import TicketsModel from './TicketsModel'
import TicketsExtModel from './TicketsExtModel'

exports.create = async (req) => {
  let ticket = await TicketsModel.retrieve({id: req.ticketId})
  let roomsAll = await TicketsExtModel.retrieveRooms({id: req.ticketId})
  let tasks = await TicketsExtModel.retrieveTasks(req)

  let roomsObj = {}
  roomsAll.forEach(part => {
    if (!roomsObj[part.roomName]) {
      roomsObj[part.roomName] = []
    }
    roomsObj[part.roomName].push(part)
  })

  let roomNames = Object.keys(roomsObj)
  let rooms = []
  roomNames.forEach(room => {
    rooms.push({
      name: room,
      parts: roomsObj[room]
    })
  })

  let superPhone = ticket.builderSupervisorPhone ? ` (${ticket.builderSupervisorPhone})` : ''
  let createdDate = moment().format('MM/DD/YY')
  let html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hello Bulma!</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.1/css/bulma.min.css">
    <style>
      html { font-size: 10px; }
      .title { margin-bottom: 0.3rem !important; }
      .middle-margin { margin: 0 auto; }
      .section { padding-top: 1rem; padding-bottom: 1rem; }
      .section:first-of-type { padding-top: 0rem; padding-bottom: 0rem; }
      .container { margin: 0 3rem; }
    </style>
  </head>
  <body>
  <section class="section">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <img src="src/site/static/images/bpconnect-logo-two.svg" width="45px">
        </div>
        <div class="level-item">
          <h1 class="title is-4">Bordeau Plumbing</h1>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <div>
            <h1 class="title is-4">Ticket #${ticket.ticketId} - ${ticket.ticketType}</h1>
            <p class="title is-5">${ticket.subdivisionName} ${ticket.houseLot} by ${ticket.builderName}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="level">
      <div class="level-right">
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <p class="title is-5">Job Info</p>
      <div class="columns">
        <div class="column is-one-half">
          <table class="table middle-margin">
            <tbody>
              <tr>
                <td>Scheduled</td>
                <td>${ticket.ticketDateScheduledFormatted}</td>
              </tr>
              <tr>
                <td>Supervisor</td>
                <td>${ticket.supervisorName}</td>
              </tr>
              <tr>
                <td>Plumber</td>
                <td>${ticket.plumberName}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="column is-one-half">
          <table class="table middle-margin">
            <tbody>
              <tr>
                <td>Builder Super</td>
                <td>${ticket.builderSupervisor}${superPhone}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>${ticket.houseAddress}</td>
              </tr>
              <tr>
                <td>Location</td>
                <td>${ticket.houseCity}, ${ticket.houseState} ${ticket.houseZip}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
  `
  if (rooms.length) {
    html += `
  <section class="section">
    <div class="container">
      <p class="title is-5">Rooms & Parts</p>
      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Room</th>
            <th>Part</th>
          </tr>
        </thead>
        <tbody>
    `
    rooms.forEach(room => {
      let firstPart = room.parts.shift()
      html += `
          <tr>
            <td>${room.name}</td>
            <td>${firstPart.partDescription}</td>
          </tr>
      `
      room.parts.forEach(part => {
        html += `
            <tr>
              <td></td>
              <td>${part.partDescription}</td>
            </tr>
        `
      })
    })

    html += `
        </tbody>
      </table>
    </div>
  </section>
    `
  }

  if (tasks.length) {
    html += `
  <section class="section">
    <div class="container">
      <p class="title is-5">Additional Tasks</p>
      <table class="table is-fullwidth is-striped">
        <thead>
          <tr><th></th></tr>
        </thead>
        <tbody>
    `
    tasks.forEach(task => {
      html += `
          <tr>
            <td>${task.task}</td>
          </tr>
      `
    })

    html += `
        </tbody>
      </table>
    </div>
  </section>
    `
  }

  html += `
  </body>
</html>
  `

  let options = {
    format: 'letter',
    base: 'file:///' + path.join(__dirname, '../../../../'),
    border: {
      top: '5mm'
    },
    footer: {
      height: '10mm',
      contents: {
        default: `<div class="columns" style="margin: 0 15px"><div class="column one-third">Created ${createdDate}</div><div class="column one-third has-text-centered">CAC #23423432</div><div class="column one-third has-text-right">Page {{page}}/{{pages}}</div></div>`
      }
    }
  }

  return new Promise((resolve, reject) => {
    pdf.create(html, options).toFile(`./generated/pdfs/Ticket ${ticket.ticketId}.pdf`, (err, res) => {
      if (err) console.log('err', err)
      let filename = path.basename(res.filename)
      resolve('/pdfs/' + filename)
    })
  })
}
