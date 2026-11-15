# 8-Säulen Master-Audit-Report – five elements (Regensburg)
Erstellt: 2026-11-15 | Tier: TIER 1 - GOLD | Prüfung: website-audit-pro v2.0 + Chromium QA

---

## Säule 1 — Deutsches Recht (§ 5 DDG)
- [x] Anbietername: *five elements – Vokalensemble*
- [x] Anschrift: *Jakob Kessel, Westheim 1, 93049 Regensburg*
- [x] Vertretung & Unabhängigkeits-Hinweis (Domspatzen-Schüler bis Ende 2027, eigenständiges Ensemble) enthalten
- [x] Offene Kontakt-/Rechtsform-Felder ehrlich mit `[MANUELL PRUEFEN]` markiert
- [x] Verbraucherstreitbeilegung (§ 36 VSBG) & durchgängiger Haftungsausschluss („Alle Angaben ohne Gewähr / unverbindlich“) aktiv
- **Ergebnis:** **GRÜN**

## Säule 2 — DSGVO Art. 13 & 14 (Datenschutzerklärung)
- [x] Verantwortliche Stelle (`Jakob Kessel / five elements, Westheim 1, 93049 Regensburg`) benannt
- [x] Vercel Hosting, Google Fonts / jsDelivr CDN, Formspree, Two-Click Maps & lokaler Browser-Chat transparent aufgeführt
- [x] Betroffenenrechte (Art. 15–21 DSGVO) und Aufsichtsbehörde (BayLDA Ansbach) vollständig dokumentiert
- **Ergebnis:** **GRÜN**

## Säule 3 — TDDDG § 25 Cookie Consent
- [x] Keine Drittanbieter-Maps oder Tracking vor aktiver Zustimmung
- [x] Optisch & funktional gleichwertige Buttons (*„Nur notwendige“* vs. *„Alle akzeptieren“*)
- [x] Nachträglicher Aufruf über Footer-Button *„Cookie-Einstellungen“* jederzeit möglich
- **Ergebnis:** **GRÜN**

## Säule 4 — Assets & Performance-Vorbereitung
- [x] Bespoke Hero- & Konzertsaal-Grafiken verlustarm komprimiert (~190 KB je JPEG, exakt mit `width`/`height` versehen -> 0 CLS)
- [x] Hero LCP Bild über `<link rel="preload" as="image" fetchpriority="high">` priorisiert
- [x] Security- & Cache-Header via `vercel.json` aktiv
- **Ergebnis:** **GRÜN**

## Säule 5 — Two-Click Google Maps
- [x] `iframe#googleMapIframe` trägt initial nur `data-src` (verifiziert per Playwright: `src` vor Klick `null`, nach Klick Google Maps URL)
- **Ergebnis:** **GRÜN**

## Säule 6 — Favicon & PWA-Integrität
- [x] Physische geometrische Vektor-Datei `favicon.svg` (5-Wellen-Emblem in Pastellblau & Silber-Metallic) im Root verknüpft
- [x] `manifest.webmanifest` vorhanden und aktualisiert
- **Ergebnis:** **GRÜN**

## Säule 7 — Technisches SEO & Schema.org
- [x] Genau ein semantisches `<h1>` und ein `<header>`
- [x] Schema.org JSON-LD (`MusicGroup` + `FAQPage`) konsistent mit dem Konzeptplan
- [x] `robots.txt` (`Disallow: /bewertung.html`) und `sitemap.xml` auf `https://fiveelements.vercel.app/`
- **Ergebnis:** **GRÜN**

## Säule 8 — Mobile-First Zero-Collision & WCAG 2.1 AA
- [x] Alle 6 getesteten Breiten (`375, 390, 414, 768, 1024, 1440px`) erreichen **0px horizontalen Overflow**, 0 kaputte Bilder und 0 Konsolenfehler
- [x] Kontrastverhältnisse zwischen **6.81:1** und **15.46:1** (alle >= WCAG AA)
- [x] Skip-Link, `:focus-visible`, `prefers-reduced-motion`, `scroll-behavior: auto !important` & explizite CSS-Transitions verifiziert
- **Ergebnis:** **GRÜN (BLOCKER-GATE BESTANDEN)**
