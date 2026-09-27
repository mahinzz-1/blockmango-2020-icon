const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

const ICONS_DIR = path.join(__dirname, 'icons')

const IMAGE_CACHE = 'public, max-age=31536000, immutable'

function imageOptions(res) {
  res.set('Cache-Control', IMAGE_CACHE)
  res.set('Access-Control-Allow-Origin', '*')
  return { maxAge: '1y', immutable: true, etag: true, index: false }
}

app.get('/icons/:id', (req, res) => {
  const name = req.params.id.replace(/\.png$/i, '')
  const id = Number(name)

  if (!Number.isInteger(id)) {
    res.status(400).json({ code: 0, message: 'Invalid id', data: null })
    return
  }

  const file = path.join(ICONS_DIR, `${id}.png`)

  if (!fs.existsSync(file)) {
    res.status(404).json({ code: 0, message: 'Icon not found', data: null })
    return
  }

  res.sendFile(file, imageOptions(res))
})

app.use('/icons', express.static(ICONS_DIR, imageOptions))
app.use('/image/idle', express.static(ICONS_DIR, imageOptions))

app.get('/skins.json', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.sendFile(path.join(__dirname, 'skins.json'))
})

app.get('/', (req, res) => {
  res.json({
    code: 1,
    message: 'SUCCESS',
    data: {
      name: 'blockmango-2020-icon',
      iconUrlTemplate: 'https://blockmango-2020-icon.vercel.app/icons/{id}.png',
      routes: ['/icons/{id}.png', '/image/idle/{id}.png', '/skins.json']
    }
  })
})

app.use((req, res) => {
  res.status(404).json({ code: 0, message: 'Not found', data: null })
})

if (require.main === module) {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`blockmango-2020-icon listening on ${port}`)
  })
}

module.exports = app
