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

## Contenu

| Quoi            | Où                                                                         |
| --------------- | -------------------------------------------------------------------------- |
| Membres         | `src/content/members/<slug>.md` + photos dans `src/assets/members/`        |
| Événements      | `src/content/events/<date>-<nom>.yaml` + affiche dans `src/assets/events/` |
| Textes FR / EN  | `src/i18n/ui.ts`                                                           |
| Couleurs, fonts | `src/styles/tokens.css`                                                    |

Les pages FR sont à la racine (`/`, `/members`, `/events`), les pages EN sous `/en/...` ;
les deux utilisent les mêmes vues (`src/views/`).

## Déploiement (Cloudflare Pages)

- Build command : `npm run build`
- Output directory : `dist`
- Variable d'environnement : `NODE_VERSION=24`

Chaque push sur `main` déploie la production ; chaque branche a son URL de preview.
