const { Client, Intents, Util } = require('discord.js')
const axios = require('axios')
const parser = require('body-parser')
const express = require('express')
const http = require('http')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

const app = express()
const server = http.Server(app)
const io = require('socket.io')(server)

app.use(parser.json())

app.post('/webhook', (req, res) => {
  const data = req.body

  data.allowed_mentions = { parsed: [] }
  
  axios.request({
    method: 'POST',
    url: process.env.WEBHOOK_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
    .then(({ data }) => {
      res.end(data)
    })
    .catch(({ response }) => {
      res.statusCode = response.status
      res.end(response.data)
    })
})

client.on('messageCreate', message => {
  if (message.channelId !== '981684251869192192') return
  
  io.emit('message', { content: message.content, author: message.author })
})

server.listen(80, () => {
  console.log('Server online!')
})

client.login(process.env.DISCORD_TOKEN)
