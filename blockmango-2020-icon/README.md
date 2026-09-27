# blockmango-2020-icon

Static skin icon CDN for Blockmango decorations, deployable to Vercel.

## Routes

| Route | Description |
| --- | --- |
| `GET /icons/{id}.png` | Skin icon by decoration id |
| `GET /icons/{id}` | Same, extension optional |
| `GET /image/idle/{id}.png` | Legacy-compatible route for the same icons |
| `GET /skins.json` | All decoration records with hosted `iconUrl` |
| `GET /` | Service info |

Example:

```
https://blockmango-2020-icon.vercel.app/icons/900001.png
```

## Deploy

```
vercel --prod
```

Vercel runs `index.js` as a Node function on `@vercel/node` and serves `icons/`
and `skins.json` from the same function. Images are sent with a one-year
immutable cache header.

## Local development

```
npm install
npm start
```
