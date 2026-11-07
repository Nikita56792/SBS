# SBS app download page

Public GitHub Pages site: https://nikita56792.github.io/SBS/

Source repository: https://github.com/Nikita56792/SBS

Current Android release: **12.2.3** (7 November 2026). Uses the supplied Sirius Biotech 2027 home logo. Android logo width is 128 dp; the web logo keeps its 160 CSS-pixel width. SHA-256 is published alongside the APK in `downloads/sbs-latest.apk.sha256`.

These are different URLs. The QR code encodes the **Pages URL**, including its trailing slash. Scanning it opens this download page; clicking the QR image on this page follows the device routing below.

## Device routing

- Android phone or tablet (`Android` in the user agent): download `downloads/sbs-latest.apk`, relative to this site.
- iPhone, iPad, iPadOS with a desktop Macintosh user agent and multiple touch points, desktop computers: open https://158.160.205.107/app/.
- The main button is always visible on Android and iOS/iPadOS, including full-screen tablets, independently of viewport width. Its Russian web-app label is "Открыть приложение"; Android uses "Скачать приложение". Desktop screens retain the responsive layout. Clicking the QR image follows the same destination at all screen widths.
- Device routing relies on browser user-agent information, not screen width. Browsers overriding their device identity may be treated as desktop.

## Publish an APK update

Place the final signed APK at `downloads/sbs-latest.apk` before publishing. Do not publish signing keys or passwords. Commit the binary and page changes to the Pages source branch (`main`, repository root). GitHub Pages then serves the APK from:

https://nikita56792.github.io/SBS/downloads/sbs-latest.apk

Keep the stable filename for later updates. The service worker excludes APK requests from its offline cache so it does not return an old package. The final APK is supplied by the application build; no placeholder binary is included.

## QR asset

`assets/qr.svg` is a local SVG generated with Segno 1.6.6, medium error correction and a four-module quiet zone. It does not call an external QR service. Encoded value:

`https://nikita56792.github.io/SBS/`

## Tests

Run `node --test tests/routing.test.cjs` and `node --check sw.js`. Tests exercise desktop, iOS/iPadOS, Android phone/tablet routing, Russian/English labels, and QR click targets without requiring a browser or dependencies.
