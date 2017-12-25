<template>
  <div class="ui small modal">
    <i class="close icon"></i>
    <div class="header">Support Message</div>
    <div class="ui icon message">
      <i class="arrow right icon"></i>
      <div class="content">
        <p>Experience an error or have a good idea? Send a message!</p>
        <form class="ui form" @submit.prevent="create">
          <div class="field">
            <label>Feedback</label>
            <textarea v-model="support.message"></textarea>
          </div>
        </form>
      </div>
    </div>
    <div class="actions">
      <div class="ui black deny button left floated">Exit</div>
      <div class="ui green icon button" @click="create">
        <span>Submit</span>
        <i class="arrow right icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from '../Modal/Modal'
import html2canvas from 'html2canvas'

export default {
  mixins: [ Modal ],
  data () {
    return {
      meta: {
        name: 'SupportModal'
      },
      support: {
        message: '',
        screenshot: ''
      }
    }
  },
  mounted () {
    this.supportTemplate = JSON.stringify(this.support)
  },
  methods: {
    beforeOpen (callback, data) {
      this.$root.noty('Opening support dialog..')
      this.support = JSON.parse(this.supportTemplate)
      setTimeout(() => {
        html2canvas(document.getElementById('app'), { async: false }).then((canvas) => {
          let dataurl = canvas.toDataURL("image/png")
          let img = document.createElement('img')
          img.onload = () => {
            let canvasResize = document.createElement('canvas')
            let ctx = canvasResize.getContext('2d')

            // We set the dimensions at the wanted size.
            canvasResize.width = 2400
            canvasResize.height = 1600

            // We resize the image with the canvas method drawImage()
            ctx.drawImage(img, 0, 0, 2400, 1600)

            let screenshot = canvasResize.toDataURL('image/jpeg', 0.8)
            screenshot = screenshot.replace('data:image/jpeg;base64,', '')
            this.support.screenshot = screenshot

            callback(data)
            this.$root.req('Support:email', this.support)
          }
          img.src = dataurl
        })
      }, 1250)
    },
    create () {
      this.$root.req('Support:email', this.support).then((response) => {
        this.$root.noty('Thanks! Your message has been sent')
        this.close()
      })
    },
  }
}
</script>
