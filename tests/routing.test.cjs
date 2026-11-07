const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "..", "main.js"), "utf8");
const WEB = "https://158.160.205.107/app/";
const APK = "downloads/sbs-latest.apk";

function run(userAgent, maxTouchPoints = 0, language = "ru-RU") {
  const span = {};
  const button = {
    attrs: {},
    querySelector: () => span,
    setAttribute(key, value) { this.attrs[key] = value; },
  };
  const qr = {
    attrs: {},
    setAttribute(key, value) { this.attrs[key] = value; },
  };
  const document = {
    documentElement: {},
    querySelectorAll: () => [],
    getElementById: (id) => id === "downloadBtn" ? button : qr,
  };
  vm.runInNewContext(source, {
    navigator: { userAgent, maxTouchPoints, language, languages: [language] },
    document,
  });
  return { button, qr, span, document };
}

for (const [name, ua, touch, phone] of [
  ["Android phone", "Mozilla/5.0 (Linux; Android 16; Pixel 9) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36", 5, true],
  ["Android tablet", "Mozilla/5.0 (Linux; Android 15; SM-X710) AppleWebKit/537.36 Chrome/140.0 Safari/537.36", 5, true],
  ["iPhone", "Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) Mobile/15E148 Safari/604.1", 5, false],
  ["iPad", "Mozilla/5.0 (iPad; CPU OS 19_0 like Mac OS X) Mobile/15E148 Safari/604.1", 5, false],
  ["iPadOS desktop UA", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/19.0 Safari/605.1.15", 5, false],
  ["macOS desktop", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15", 0, false],
  ["Windows desktop", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/140.0", 0, false],
  ["Unknown browser", "", 0, false],
]) {
  test(`${name}: button and QR route correctly`, () => {
    const { button, qr, span } = run(ua, touch);
    assert.equal(button.href, phone ? APK : WEB);
    assert.equal(qr.href, phone ? APK : WEB);
    assert.equal(span.textContent, phone ? "Скачать приложение" : "Открыть приложение");
    assert.equal(button.attrs.download, phone ? "sbs-latest.apk" : undefined);
    assert.equal(qr.attrs.download, phone ? "sbs-latest.apk" : undefined);
    assert.ok(qr.attrs["aria-label"]);
    const mobile = phone || /iPhone|iPad/.test(name);
    assert.equal(button.attrs["data-mobile-platform"], String(mobile));
  });
}

test("English labels preserve locale support", () => {
  assert.equal(run("Android Mobile", 5, "en-US").span.textContent, "Download the app");
  assert.equal(run("Macintosh", 0, "en-US").span.textContent, "Open the app");
});

test("HTML has a safe web fallback and a local QR asset", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  assert.match(html, /id="qrLink" href="https:\/\/158\.160\.205\.107\/app\/"/);
  assert.match(html, /src="assets\/qr.svg"/);
  assert.doesNotMatch(html, /example\.com/);
});
