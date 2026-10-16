# Artem Studio „Van Gogh”

One-page site for Artem Studio „Van Gogh”, an art studio in Chișinău. Linked from the Instagram bio.

- Live: https://artemstudio.github.io/
- Direct language links: `?lang=ro`, `?lang=ru`, `?lang=en` (otherwise the visitor's phone language decides, with Romanian as the fallback)

## Structure

Plain HTML/CSS/JS, no build step. GitHub Pages serves the `main` branch.

- `index.html` — the page. Romanian text lives here.
- `js/i18n.js` — Russian and English translations, keyed by `data-i18n` attributes.
- `js/main.js` — language switch, mobile menu, gallery buttons.
- `css/style.css` — styles. Brand colours are the custom properties at the top.
- `img/` — photos at 1200px and 640px widths, logo, icons.

## Editing

- To change a text: edit it in `index.html` (RO) and in both dictionaries in `js/i18n.js` (RU, EN).
- To show the e-mail: in `index.html`, search for `EMAIL@EXAMPLE.COM`, replace it in both places and remove `hidden` from that `<li>`.
- New photo: export at 1200px wide (and a 640px copy with the `-640` suffix) as JPEG, drop into `img/`.
