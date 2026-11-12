# C.R.E.M.E — site web

Site vitrine du collectif de DJs **C.R.E.M.E** (_conseil régional of electronic music elites_), Paris / Toulouse.

Construit avec [Astro](https://astro.build) et hébergé sur Cloudflare Pages.

## Développement

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # build statique dans ./dist
npm run preview   # sert ./dist en local
npm run format    # Prettier
```

## Déploiement (Cloudflare Pages)

- Build command : `npm run build`
- Output directory : `dist`
- Variable d'environnement : `NODE_VERSION=24`

Chaque push sur `main` déploie la production ; chaque branche a son URL de preview.
