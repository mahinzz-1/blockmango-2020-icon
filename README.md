# blockmango-private-server-icon

Icon host for Block Mango private server dress skins.

## Endpoints
| Route | Description |
|---|---|
| `GET /` | service info JSON (name, iconUrlTemplate, routes) |
| `GET /icons/{id}.png` | dress skin icon (static, cached 7d) |
| `GET /image/idle/{id}.png` | idle image (falls back to icon) |
| `GET /skins.json` | full skin manifest (1,105 skins) |

## Deploy (Vercel)
1. Replace all files in your repo with these (keep `icons/` and `skins.json`).
2. `vercel deploy --prod` (or push to GitHub and let Vercel build).
3. Test: `https://<your-domain>/icons/200001.png`

## Local test
```
npm install
node index.js
# open http://localhost:3000/icons/200001.png
```

## Notes
- `icons/` contains 1,106 PNGs named `<skinId>.png` (+ `none.png` fallback).
- `vercel.json` uses `@vercel/static` builds for `icons/**` and `skins.json`
  with a catch-all route to `index.js` - this is the config that correctly
  served icons on Vercel previously.
