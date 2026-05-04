"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// ── French ────────────────────────────────────────────
import frCommon from "./locales/fr/common.json";
import frHome from "./locales/fr/home.json";
import frProducts from "./locales/fr/products.json";
import frAuth from "./locales/fr/auth.json";
import frProfile from "./locales/fr/profile.json";
import frVendors from "./locales/fr/vendors.json";
import frCart from "./locales/fr/cart.json";
import frModals from "./locales/fr/modals.json";
import frData from "./locales/fr/data.json";

// ── English ───────────────────────────────────────────
import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enProducts from "./locales/en/products.json";
import enAuth from "./locales/en/auth.json";
import enProfile from "./locales/en/profile.json";
import enVendors from "./locales/en/vendors.json";
import enCart from "./locales/en/cart.json";
import enModals from "./locales/en/modals.json";
import enData from "./locales/en/data.json";

// ── Arabic ────────────────────────────────────────────
import arCommon from "./locales/ar/common.json";
import arHome from "./locales/ar/home.json";
import arProducts from "./locales/ar/products.json";
import arAuth from "./locales/ar/auth.json";
import arProfile from "./locales/ar/profile.json";
import arVendors from "./locales/ar/vendors.json";
import arCart from "./locales/ar/cart.json";
import arModals from "./locales/ar/modals.json";
import arData from "./locales/ar/data.json";

// ── Tamazight ─────────────────────────────────────────
import tzCommon from "./locales/tz/common.json";
import tzHome from "./locales/tz/home.json";
import tzProducts from "./locales/tz/products.json";
import tzAuth from "./locales/tz/auth.json";
import tzProfile from "./locales/tz/profile.json";
import tzVendors from "./locales/tz/vendors.json";
import tzCart from "./locales/tz/cart.json";
import tzModals from "./locales/tz/modals.json";
import tzData from "./locales/tz/data.json";

function readStored() {
  try {
    if (typeof window === "undefined") return "fr";
    return localStorage.getItem("biohna_lang") ?? "fr";
  } catch {
    return "fr";
  }
}

const RTL_LANGS = ["ar", "tz"];

function applyLangToDOM(lng) {
  if (typeof window === "undefined") return;
  document.documentElement.lang = lng;
  document.documentElement.dir = RTL_LANGS.includes(lng) ? "rtl" : "ltr";
  document.documentElement.dataset.lang = lng;
  try {
    localStorage.setItem("biohna_lang", lng);
  } catch {}
}

i18n.use(initReactI18next).init({
  lng: typeof window !== "undefined" ? readStored() : "fr",
  fallbackLng: "fr",
  defaultNS: "common",
  ns: [
    "common",
    "home",
    "products",
    "auth",
    "profile",
    "vendors",
    "cart",
    "modals",
    "data",
  ],
  resources: {
    fr: {
      common: frCommon,
      home: frHome,
      products: frProducts,
      auth: frAuth,
      profile: frProfile,
      vendors: frVendors,
      cart: frCart,
      modals: frModals,
      data: frData,
    },
    en: {
      common: enCommon,
      home: enHome,
      products: enProducts,
      auth: enAuth,
      profile: enProfile,
      vendors: enVendors,
      cart: enCart,
      modals: enModals,
      data: enData,
    },
    ar: {
      common: arCommon,
      home: arHome,
      products: arProducts,
      auth: arAuth,
      profile: arProfile,
      vendors: arVendors,
      cart: arCart,
      modals: arModals,
      data: arData,
    },
    tz: {
      common: tzCommon,
      home: tzHome,
      products: tzProducts,
      auth: tzAuth,
      profile: tzProfile,
      vendors: tzVendors,
      cart: tzCart,
      modals: tzModals,
      data: tzData,
    },
  },
  interpolation: { escapeValue: false },
});

// Apply on every language change
i18n.on("languageChanged", applyLangToDOM);

// Apply immediately on load (only on client)
if (typeof window !== "undefined") {
  applyLangToDOM(i18n.language);
}

export default i18n;
