/* ============================================================
 * SBS — Sirius Biotech Summit promo page
 * Auto language (EN / RU) based on browser/device locale.
 * ============================================================ */

const APP_DOWNLOAD_URL = "downloads/sbs-latest.apk";
const WEB_APP_URL = "https://158.160.205.107/app/";

const I18N = {
  en: {
    docTitle: "Sirius Biotech Summit — App",
    title: "Sirius Biotech Summit",
    qrText: "To install the app, open this page on your mobile device or scan this QR code",
    download: "Download the app",
    openApp: "Open the app",
    qrLink: "Open the web app",
    qrDownload: "Download the Android app",
    adv1: "Stay tuned for schedule updates",
    adv2: "Get all information about the event",
    adv3: "Ask questions to speakers",
    adv4: "Share your impressions in the news feed",
    poweredBy: "Powered by",
    poweredTech: "Web Technologies",
  },
  ru: {
    docTitle: "Сириус Биотех Саммит — Приложение",
    title: "Сириус Биотех Саммит",
    qrText: "Чтобы установить приложение, откройте эту страницу на мобильном устройстве или отсканируйте QR-код",
    download: "Скачать приложение",
    openApp: "Открыть приложение",
    qrLink: "Открыть веб-приложение",
    qrDownload: "Скачать приложение для Android",
    adv1: "Следите за обновлениями программы",
    adv2: "Получайте всю информацию о мероприятии",
    adv3: "Задавайте вопросы спикерам",
    adv4: "Делитесь впечатлениями в ленте новостей",
    poweredBy: "Powered by",
    poweredTech: "Web Technologies",
  },
};

function detectLang() {
  const locales =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || "en"];
  for (const locale of locales) {
    if (typeof locale === "string" && locale.toLowerCase().startsWith("ru")) {
      return "ru";
    }
  }
  return "en";
}

function applyLang(lang) {
  const dict = I18N[lang] || I18N.en;
  document.documentElement.lang = lang;
  document.title = dict.docTitle;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
}

function isAppleMobile(device) {
  const ua = device.userAgent || "";
  // iPadOS can request desktop pages and identify itself as a Macintosh.
  return /iPhone|iPad|iPod/i.test(ua) ||
    (/Macintosh/i.test(ua) && device.maxTouchPoints > 1);
}

function isAndroidDevice(device) {
  return !isAppleMobile(device) && /Android/i.test(device.userAgent || "");
}

const lang = detectLang();
applyLang(lang);

const androidDevice = isAndroidDevice(navigator);
const destination = androidDevice ? APP_DOWNLOAD_URL : WEB_APP_URL;
const dict = I18N[lang];
const downloadBtn = document.getElementById("downloadBtn");
if (downloadBtn) {
  downloadBtn.href = destination;
  downloadBtn.setAttribute("data-mobile-platform", String(androidDevice || isAppleMobile(navigator)));
  downloadBtn.querySelector("span").textContent = androidDevice ? dict.download : dict.openApp;
  if (androidDevice) downloadBtn.setAttribute("download", "sbs-latest.apk");
}

const qrLink = document.getElementById("qrLink");
if (qrLink) {
  qrLink.href = destination;
  qrLink.setAttribute("aria-label", androidDevice ? dict.qrDownload : dict.qrLink);
  if (androidDevice) qrLink.setAttribute("download", "sbs-latest.apk");
}

/* PWA: register a minimal service worker so the page can be
 * installed as an app on mobile devices. */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
