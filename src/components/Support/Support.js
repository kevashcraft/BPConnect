import sgMail from '@sendgrid/mail'
import keys from '../../api/keys'

exports.email = (req) => {
  sgMail.setApiKey(keys.sg)
  const msg = {
    to: 'kevin@kevashcraft.com',
    from: 'kevin@logicdudes.com',
    subject: 'BPConnect Support - ' + req.message.substring(0, 50),
    text: req.message,
    html: req.message,
    attachments: [{filename: 'screenshot.jpg', content: req.screenshot, type: 'image/jpeg'}]
  }

  sgMail.send(msg)
}
