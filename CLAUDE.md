# CLAUDE.md

Guidance for Claude when working on this codebase.

## Project overview

Static single-page wedding website. No build system, no dependencies, no npm. Serve
`index.html` directly in a browser or via `python -m http.server 8000`.

## Architecture

### i18n system

All user-visible text lives in `locales/{en,fr,ar}.json`. HTML elements carry
`data-i18n="key"` attributes (or `data-i18n-alt="key"` for `alt` text).
`js/main.js:applyTranslations()` walks the DOM and fills them in.

**Rule:** Never hardcode content strings in HTML or JS. Every piece of copy must have
a key in all three locale files.

### Language switching and RTL

`js/main.js:changeLanguage(lang)` handles everything:
- swaps the active button state
- sets `dir` and `lang` on `<html>`
- enables/disables `css/rtl.css` via the `id="rtl-stylesheet"` link element

Arabic (`ar`) is the only RTL language. All RTL overrides live exclusively in
`css/rtl.css` — do not add directional rules elsewhere.

### CSS custom properties

All colours, fonts, and spacing are defined as variables in `css/styles.css :root`.
Use these variables; do not introduce raw hex or pixel values outside of `:root`.

### Privacy tokens

Personal information was replaced with typed `[TOKEN]` placeholders before this repo
was made public. When editing content, keep the same token convention — never fill in
real names, dates, addresses, or phone numbers. See the README for the full token
table.

## File responsibilities

| File | Purpose |
|------|---------|
| `index.html` | Structure only — no content strings, no styles |
| `css/styles.css` | Layout, typography, component styles |
| `css/cultural-elements.css` | Cultural icon and decorative element styles |
| `css/rtl.css` | RTL overrides for Arabic — **only directional rules here** |
| `js/main.js` | Language init, `changeLanguage()`, smooth scroll, RSVP handler |
| `js/translations.js` | `loadTranslations()` — fetches all three locale JSON files |
| `locales/*.json` | All copy in EN / FR / AR |

## Adding content

1. Add the key to `locales/en.json`, `locales/fr.json`, and `locales/ar.json`
2. Add `data-i18n="your_key"` to the HTML element
3. No JS changes needed unless the element type is unusual

## Common pitfalls

- `translations.js` defines `loadTranslations()` but `main.js` also defines it —
  `translations.js` is loaded first and gets overridden. If you need to touch the
  fetch logic, edit `main.js`.
- The `createPlaceholderImage()` function in `main.js` targets
  `img[src="assets/images/placeholder.jpg"]` — that file is gitignored and the
  function is effectively a no-op. Leave it; removing it has no effect on real usage.
- Smooth scrolling offsets by `80px` (`main.js:setupSmoothScrolling`) to clear the
  sticky header — adjust if the header height changes.
