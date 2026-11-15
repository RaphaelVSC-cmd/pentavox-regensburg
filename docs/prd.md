# Product Requirements Document (PRD) – five elements

**Projekt:** `five elements` – Das junge 5-Stimmen A-cappella-Vokalensemble  
**Tier:** TIER 1 - GOLD (Bespoke Unikat-Engine v8.0)  
**Datum:** 2026-11-15  

---

## 1. Ziele & Zielgruppen
- **Für Besucher (Brautpaare, Konzertgäste, Veranstalter privater & ungewöhnlicher Feste):** In unter 15 Sekunden per 1.-Person-Ansprache („Wir“) verstehen, wer wir sind, was wir kosten, wie wir klingen, und sofort über Suche oder Konfigurator den richtigen Klick finden.
- **Abgrenzung gegen `pentavocalis.com`:** Modern, nahbar, bunt-pastellig (statt düster-klassisch), maximal transparent (Preise, Budget, GEMA, Pflichten) und technisch interaktiv auf Awwwards-/Apple-Craft-Niveau.

## 2. Design- & Farbsystem
- **Farbgebung:** Matte Pastell-Blautöne (`#dce8f5` Canvas, `#eef4fb` Frosted Mist, `#adc8e6` Pastel Cornflower), tiefe schieferblaue & anthrazit-schwarze Akzente (`#162438`, `#12171f`) sowie gebürstetes Silber-Metallic (`#e6ecf5`, `#b8c6d9`, metallische Verläufe & feine Chrome-Ringe).
- **Formensprache:** „Weniger Ecken und Kanten“ – durchgängig sanfte Radien (`20px–32px` Cards, `9999px` Pill-Buttons & Badges). Keine harten Retro-Kästen, kein steriles Nur-Weiß.
- **Typografie:** `Fraunces` (Expressive Display mit weicher `SOFT 100`-Kurve) + `Plus Jakarta Sans` (Ultraklare UI- & Fließtext-Schrift), konsequent flüssig skaliert über `clamp()`.
- **Full-Canvas Raster:** Container bis `1440px` Breite mit harmonischem Innenabstand (`clamp(1.25rem, 3.5vw, 3.5rem)`), Sticky Navbar `<= 76px`, Mobile Breakpoint `<= 1024px`.

## 3. Pflicht-Features & Sektionen (`index.html`)
1. **Header & Editorial Hero:** Abgerundete Pastell-Stage mit Ensemble-Foto/Visual, animiertem 5-Stimmen-Wellen-Siegel, `initTimeGreeting()`, Slogan *„Fünf Stimmen. Ein Klang. Unvergessliche Momente“*, proaktivem „Wir“-Intro und Domspatzen-Hinweis bis Ende 2027 (unabhängig!).
2. **Idiotensichere Schnellsuche (`#schnellsuche`):** Live-Suchfeld + Quick-Jump-Pills, um jedes Thema (Trauung, Vokalkonzert, GEMA, IBAN, Maximalbudget, Wunschsongs, Profile) in 1 Klick anzusteuern.
3. **Klangpult & Wunschsong-Atelier (`#klangpult`):** 5-Kanal Web Audio API Mixer + 60fps Canvas Klangwellen mit den 4 echten Stücken (*Earth Song*, *Ich gedenke der alten Zeit*, *Nun fanget an*, *In the Bleak Midwinter*), Solo/Mute pro Stimme, ehrlichem Hinweis „Studio-Aufnahmen folgen“ sowie interaktivem Wunschsong-Eingabefeld (mit Übergabe in die Anfrage).
4. **Ensemble-Profile & Persönlichkeitstool (`#ensemble`):** Alle 5 Plätze (`Maria` + `Sänger/in 2–5` mit `[MANUELL PRUEFEN]`-Markern ohne Halluzination), Tab-Wechsel („Warum singe ich? / Stimme / Instrument & Song“), Entstehungsstory & interaktiver „Kennenlern- & Klang-Kompass“.
5. **Anlässe & Locations (`#anlaesse`):** `!Eigene Vokalkonzerte!`, Hochzeit, Sektempfang, Taufe/Namensfeiern, Richtfest & ausdrücklich kuriose/ungewohnte Orte – überall hin zzgl. Fahrtkosten.
6. **Pakete, Preise & Maximalbudget-Rechner (`#pakete`):** Trauung (150 €), Vokalkonzert (375 € oder Spendenbasis), Sektempfang (100 €), visuelle Erklärung *Daseinszeit != Singzeit*, Begründung der fairen Preise (Proben-/Übungs-/Vorbereitungszeit) + interaktiver **Maximalpreis-Schieberegler** auf Verhandlungsbasis mit Direkt-Übergabe in den Assistenten.
7. **Veranstalter-Checkliste & GEMA-Umschalter (`#pflichten`):** Interaktive 5-Punkte-Checkliste inkl. Live-Toggle (*GEMA selbst zahlen* vs. *five elements kalkuliert GEMA mit ein*).
8. **Spenden- & Förderbereich (`#spenden`):** Prominente IBAN-Karte mit Ein-Klick-Kopierfunktion (`[MANUELL PRUEFEN: IBAN & Kontoinhaber]`) & klarer Spenden-Erklärung.
9. **3-Schritte Anfrage-Assistent & Two-Click Maps (`#kontakt`):** Synchronisiert mit Maximalbudget, GEMA-Status & Wunschsongs, Formspree-Anbindung + Offline-Fallback + WhatsApp-Übergabe, sowie Regensburg-Karte (`Westheim 1, 93049`) per Two-Click-Consent (`data-src`).
10. **Rechtssicherheit & Baustein-Suite:**
    - § 5 DDG Impressum (`Jakob Kessel, Westheim 1, 93049 Regensburg` + offene Felder `[MANUELL PRUEFEN]`).
    - DSGVO Art. 13/14 + TDDDG § 25 Cookie-Banner mit optisch gleichwertigen Buttons.
    - Klarer rechtlicher Haftungsausschluss („Alle Angaben ohne Gewähr – keine rechtliche Bindung vor Vertragsschluss“) am Chat-Widget (`assets/js/chat-widget.js`), im Budget-Tool & im Footer.
    - Internes Bewertungs-Tool (`bewertung.html` & `assets/js/bewertung.js`), nicht in der Hauptnavigation. Kein `team.html` (Recruiting = NEIN).

## 4. Qualitätssicherung & Abnahme
- **5-Breiten Blocker-Gate via echtem Chromium (`375, 390, 414, 768, 1024px` + `1440px`):** `0px` Horizontal-Overflow, alle Interaktionen & Menüs per Touch getestet.
- **website-audit-pro v2.0:** Alle 8 Säulen 100 % GRÜN, Vercel Web Interface Guidelines + Taste-Skill erfüllt.
