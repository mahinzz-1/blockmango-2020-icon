const path = require('path')
const fs = require('fs')
const express = require('express')

const app = express()

const DOMAIN = 'https://blockmango-private-server-icon.vercel.app'
const ICONS_DIR = path.join(__dirname, 'icons')

function sendPngOr(res, filePath, missMessage) {
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable')
    fs.createReadStream(filePath).pipe(res)
  } else {
    res.status(404).json({ code: 0, message: missMessage, data: null })
  }
}

function parseId(raw) {
  const id = Number(String(raw || '').replace(/\.png$/i, ''))
  return Number.isInteger(id) && id >= 0 ? id : null
}

// Root info (same shape as before, on the new domain)
app.get('/', (req, res) => {
  res.json({
    code: 1,
    message: 'SUCCESS',
    data: {
      name: 'blockmango-private-server-icon',
      iconUrlTemplate: `${DOMAIN}/icons/{id}.png`,
      routes: ['/icons/{id}.png', '/image/idle/{id}.png', '/skins.json'],
    },
  })
})

// Static manifest (served by @vercel/static via vercel.json; this handler is a local-dev fallback)
app.get('/skins.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  fs.createReadStream(path.join(__dirname, 'skins.json')).pipe(res)
})

// /icons/<id>.png - served statically by @vercel/static on Vercel;
// this handler covers local dev + any cache miss falling through
app.get('/icons/:file', (req, res) => {
  if (String(req.params.file).toLowerCase() === 'none.png') {
    return sendPngOr(res, path.join(ICONS_DIR, 'none.png'), 'Icon not found')
  }
  const id = parseId(req.params.file)
  if (id === null) {
    return res.status(400).json({ code: 0, message: 'Invalid id', data: null })
  }
  sendPngOr(res, path.join(ICONS_DIR, `${id}.png`), 'Icon not found')
})

// /image/idle/<id>.png - falls back to the icon if no dedicated idle asset exists
app.get('/image/idle/:file', (req, res) => {
  const id = parseId(req.params.file)
  if (id === null) {
    return res.status(400).json({ code: 0, message: 'Invalid id', data: null })
  }
  const idle = path.join(__dirname, 'idle', `${id}.png`)
  if (fs.existsSync(idle)) return sendPngOr(res, idle, 'Idle image not found')
  sendPngOr(res, path.join(ICONS_DIR, `${id}.png`), 'Idle image not found')
})

app.use((req, res) => {
  res.status(404).json({ code: 0, message: 'Not found', data: null })
})

// Local dev: node index.js  (Vercel uses module.exports as the serverless handler)
if (require.main === module) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => console.log(`running at http://localhost:${PORT}`))
}

module.exports = app
