# Cody Davis — Portfolio

A zero-dependency, cyberpunk-neon 3D portfolio. Plain HTML/CSS/JS + Three.js
(loaded from a CDN via import map) — no `npm install`, no build step.

## Run it locally

Node/Python weren't found on this machine, so a tiny local server is included:

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then open **http://localhost:8123** in your browser.

(If you install Node or Python later, `npx serve` or `python -m http.server`
work too — any static file server does, since it's plain HTML/CSS/JS. Opening
`index.html` directly via `file://` will NOT work — browsers block ES module
imports from the local filesystem.)

## Deploy it

Live at **https://codydavis2.github.io/**, served by GitHub Pages from the
`main` branch of `codydavis2/codydavis2.github.io`. To publish an update, commit
and push to `main` — it goes live in about a minute:

```bash
git add -A && git commit -m "Describe the change" && git push
```

## Customize

- **Content**: everything is plain text in [index.html](index.html) — name,
  bio, skills, project cards, contact links.
- **Colors**: edit the CSS variables at the top of
  [css/style.css](css/style.css) (`--cyan`, `--magenta`, `--bg`, etc.) to
  reskin the whole site.
- **3D background**: [js/scene.js](js/scene.js) — particle count, bloom
  strength, grid, and the rotating wireframe core.
- **Interactions** (cursor, nav, typewriter, scroll reveal, tilt cards, skill
  sphere): [js/main.js](js/main.js).

## Before sharing on LinkedIn

The social preview tags are in the `<head>` of [index.html](index.html) and
the image is [assets/og-image.png](assets/og-image.png). Crawlers need
**absolute** URLs, so they point at `https://codydavis2.github.io/` — update
them if the site ever moves. Run your link through LinkedIn's
[Post Inspector](https://www.linkedin.com/post-inspector/) to refresh its
cache — LinkedIn caches previews, so re-inspect after any change to the
title, description or image.

## Already configured

- **Resume** is served from `assets/Cody-Davis-Resume.pdf`. To update it,
  replace that file (keep the filename) and redeploy.
- **Projects**: Dot-Tracker
  ([repo](https://github.com/codydavis2/dot-tracker)), Doro Ad Designer
  ([repo](https://github.com/codydavis2/doro_ad_designer)) and Doro Inventory
  Tracker (no public link yet — when it has one, add a `card-links` block to
  its card in [index.html](index.html), same as the other two).
- **Schedule a Call** is a live Calendly embed
  ([calendly.com/cody-davis5614/30min](https://calendly.com/cody-davis5614/30min)),
  wired up in `CALENDLY_URL` at the top of [js/schedule.js](js/schedule.js).
  (Prefer Cal.com instead? Same idea — swap the embed script/URL in that file
  for Cal.com's inline embed snippet.)
