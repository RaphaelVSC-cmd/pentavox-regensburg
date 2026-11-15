# Selbst-Audit – five elements (Regensburg) | 2026-11-15
Tier: TIER 1 - GOLD | Basis: Konzeptplan_Vokalensemble_Nexbot_Webdesign

## Punkt 1: Blueprint- & Identitäts-Check
- **Frage:** Hebt sich die Seite klar von Standard-Templates, `pentavocalis.com` und dem alten Pentavox-Entwurf ab?
- **Ergebnis:** **PASS.** Matte Pastell-Blautöne (`#dce8f5`, `#eef4fb`, `#c4daf0`), schieferblaue & anthrazit-schwarze Akzente (`#162438`, `#12171f`), gebürstetes Silber-Metallic, durchgehend abgerundete Karten (`22px–36px`), direkte „Wir“-Ansprache und komprimierte Übersicht statt steifer Klassik-Fassade.

## Punkt 2: Innovations- & Konzeptplan-Check
- **Umgesetzte Signature Features:**
  1. **Idiotensichere Schnellsuche (`#schnellsuche`):** Live-Keyword-Filter + Themen-Chips.
  2. **five elements Klangpult & Wunschsong-Atelier (`#klangpult`):** 5-Kanal Web Audio API Harmonie-Vorschau + 60fps Canvas Wellen zu *Earth Song* (Ticheli), *Ich gedenke der alten Zeit* (Becker), *Nun fanget an* (Hassler) & *In the Bleak Midwinter* (Holst) mit direkter Wunschsong-Vormerkung.
  3. **Wer wir 5 sind & Persönlichkeits-Kompass (`#ensemble`):** Alle 5 Plätze (`Maria` + Plätze 2–5 mit `[MANUELL PRUEFEN]`), Domspatzen-Abgrenzung bis Ende 2027 & interaktives Persönlichkeitstool.
  4. **Echte Preise, Daseinszeit & Maximalbudget-Rechner (`#pakete`):** 100 € / 150 € / 375 € oder Spendenbasis + Verhandlungs-Schieberegler.
  5. **5 Pflichten & GEMA-Umschalter (`#pflichten`) + Spenden-IBAN (`#spenden`):** GEMA-Sync direkt in den 3-Schritte-Assistenten.

## Punkt 3: Hartes Blocker-Gate — 6-Viewport-Check in echtem Chromium (Playwright)
- **Test-Matrix (live verifiziert per Chromium headless):**
  - `375px`: `scrollWidth=375`, `overflowPx=0`, `headerHeight=66px`, `hamburger=flex`, 0 Console/Page-Errors -> **PASS**
  - `390px`: `scrollWidth=390`, `overflowPx=0`, `headerHeight=66px`, `hamburger=flex`, 0 Console/Page-Errors -> **PASS**
  - `414px`: `scrollWidth=414`, `overflowPx=0`, `headerHeight=66px`, `hamburger=flex`, 0 Console/Page-Errors -> **PASS**
  - `768px`: `scrollWidth=768`, `overflowPx=0`, `headerHeight=66px`, `hamburger=flex`, 0 Console/Page-Errors -> **PASS**
  - `1024px`: `scrollWidth=1024`, `overflowPx=0`, `headerHeight=66px`, `hamburger=flex`, 0 Console/Page-Errors -> **PASS**
  - `1440px`: `scrollWidth=1440`, `overflowPx=0`, `headerHeight=66px`, `hamburger=none`, 0 Console/Page-Errors -> **PASS**
  - `bewertung.html (390px)`: `overflowPx=0` -> **PASS**

## Punkt 4: Interaktions- & Touch-Prüfung (Playwright)
- Cookie-Banner blendet schwebende Buttons während Auswahl aus (behobener 375px-Overlay-Konflikt) & schließt per Klick (`cookieHiddenAfter=true`).
- Mobile Drawer öffnet & gibt `body.style.overflow` nach Anker-Klick frei (`""`).
- Schnellsuche (`"GEMA"` -> 1 Treffer), Maximalbudget-Transfer (`240` -> `#wizardBudgetInput="240"`), GEMA-Sync (`gemaSynced=true`), lokaler Chat-Bot (`chatMessagesCount=3`) & Two-Click Maps (`mapBlockedInitially=true`, `mapLoadedOnClick=true`): alle **PASS**.

## Punkt 5: WCAG Kontrast & Craft-Check
- `#131c29` auf `#dbe7f4`: **13.66:1** | `#394e67` auf `#dbe7f4`: **6.81:1** | `#131c29` auf `#edf4fc`: **15.46:1** | `#edf4fc` auf `#162438`: **14.10:1** | `#b6c6da` auf `#162438`: **8.99:1** | `#162438` auf `#c4daf0`: **10.89:1**.
- Keine `transition: all`, `scroll-behavior: auto !important` für Lenis, `:focus-visible`, `prefers-reduced-motion`, keine Reste von „Pentavox“, kein `team.html` (Recruiting=NEIN).
