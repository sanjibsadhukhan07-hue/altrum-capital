# Altrum Capital — Website

Static website for Altrum Capital (wealth advisory, Hooghly). Plain HTML, CSS and JavaScript — no build step, no framework.

## Run it

Open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

To publish, upload the whole folder to any static host (cPanel, Netlify, GitHub Pages, S3 and so on).

## Folder structure

```
index.html            Home page (hero, SIP estimator, AMC logo strip)
services.html  why-us.html  calculators.html  process.html
testimonials.html  contact.html
amcs.html             List of all AMCs
amc.html              ONE page for every AMC — loads content by ?amc=<slug>

css/style.css         All styling (colours are variables at the top)
js/main.js            Menu, scroll effects, Login dropdown
js/calculators.js     Calculators
js/amc-data.js        List of AMCs (slug, name, short name, website domain)
js/amc-content.js     Office / contact details for each AMC
js/amc-menu.js        AMC mega-menu, logo handling, home-page logo strip
js/amc-page.js        Fills amc.html for the chosen AMC

images/logo-full.png  Full Altrum logo (header and footer)
images/logo-icon.png  Icon only
images/amc/           AMC logos, named <slug>.png
```

## How the AMC page works

`amc.html?amc=hdfcmf` shows HDFC, `amc.html?amc=licmf` shows LIC, and so on.
The page reads the `amc` value from the address, finds that AMC in `amc-data.js` and `amc-content.js`, and fills in the logo, badges (empanelled / RTA) and office cards. An unknown name shows a "not found" message.

### Edit an AMC's offices or contacts
Open `js/amc-content.js`, find the AMC by its slug and edit its `cards` text (address, phone, email). Each entry has:

| Field | Meaning |
|---|---|
| `arn` | ARN number, or `null` if empanelment is still in process |
| `rta` | `CAMS` or `KFintech` |
| `h2`, `intro` | Heading and intro paragraph |
| `cards` | HTML for the office cards |

### Add a new AMC
1. Add an entry to `js/amc-data.js`:
   ```js
   { "slug": "newmf", "name": "New Mutual Fund", "short": "New", "empanelled": false, "domain": "newmf.com" }
   ```
2. Add an entry with the same slug to `js/amc-content.js` (copy an existing one and change it).
3. Save the logo as `images/amc/newmf.png`.

The menu, AMCs list and home-page strip pick it up automatically.

### AMC logos
The site looks for `images/amc/<slug>.png` first. If that file is missing it shows the small icon from the AMC's website (using `domain`) together with the AMC name. **To use a proper logo, just drop a PNG named `<slug>.png` into `images/amc/`** — no code change needed.

Currently without a logo file: `360onemf, abakkusmf, alphagrepmf, dspmf, heliosmf, icicimf, invescomf, itimf, jiomf, jmmf, mahindramf, ppfasmf, quantmf, sundarammf, tatamf, utimf, whiteoakmf`.

## Login menu

The header **Login** dropdown is repeated in the header of each page (and in the mobile menu). To change a link, search for the URL in the HTML files and replace it everywhere.

| Group | Item | Link |
|---|---|---|
| Office Login | Admin | https://altrumcapital.investwell.app/app/#/login |
| Office Login | NSE MF | https://www.nseinvest.com/nsemfdesk/login.htm |
| Office Login | LAMF | https://voltmoney.in/partner/signup |
| Client Login | MF Portfolio | https://altrumcapital.investwell.app/app/#/login |
| Client Login | LAMF | https://app.voltmoney.in/ |

## Home-page logo strip

A continuous right-to-left slider of all AMC logos, each linking to its AMC page. It pauses on hover.
- Speed: in `js/amc-menu.js`, `Math.max(40, data.length * 3)` is the seconds for one full loop — raise the number for slower.
- Look: `.amc-strip`, `.amc-marquee`, `.amc-slide` in `css/style.css`.

## Colours and layout

Brand colours (green and yellow, from the Altrum login screen) are CSS variables at the top of `css/style.css`:
`--orange-400` / `--orange-500` (main green — the names are old), `--gold-400` (yellow), `--navy-900` … `--navy-700` (light green tints), `--ivory-100` (text).

Content width is the `.wrap` rule (`max-width:1800px`). Lower it for narrower pages.

## Logo

The header and footer use `images/logo-full.png` (the `logo-full` class). Change its size with the `height` values in the "Full logo" block at the end of `css/style.css`.

## Notes
- AMC icons for the fallback come from Google's favicon service, so visitors need an internet connection to see them.
- Old per-AMC pages (for example `hdfcmf.html`) no longer exist; links must use `amc.html?amc=<slug>`.
- Check each AMC's ARN number in `js/amc-content.js` — some entries share the same value.
