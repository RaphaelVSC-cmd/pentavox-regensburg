# Product Requirements Document (PRD) - Pentavox Regensburg
**Projekt:** Pentavox Regensburg – Das 5-Stimmen Vokalensemble
**Tier:** TIER 1 - GOLD | **Datum:** 2026-10-26 | **Lead:** Maria & Raphael Neumeier

---

## 1. Grammatik & Seitenarchitektur
- **Gewählte Seiten-Grammatik:** **Grammatik 3: The Craft Editorial (Tradition, Werte & Meisterliche Handschrift)**
- **Begründung:** Ein 5-stimmiges A-cappella-Vokalensemble mit Domspatzen-Wurzeln verlangt nach erhabener, emotional tiefer Feierlichkeit, meisterlicher Handwerkskunst und redaktioneller Eleganz. Keine reißerischen Knallfarben, sondern sakrale Ruhe und Gänsehaut-Klang.
- **Hero-Komposition:** Pool-Variante e) *Redaktionell mit schwebenden Badge-Karten*. 4 präzise Elemente innerhalb 100dvh:
  1. Eyebrow-Badge: Geprägte Glas-Pille mit Domspatzen-Signet: *„1.050 Jahre Chortradition · Regensburg“*
  2. Hero-Headline: *„Fünf Stimmen. Ein reiner Domklang.“* (Playfair 600 / 500 italic mit Champagner-Gold)
  3. Unterstützungstext (138 Zeichen): *„Ausgebildet bei den Regensburger Domspatzen. Wir schenken Ihrer Trauung in Bayern einen 5-stimmigen A-cappella-Klang, der tief berührt.“*
  4. CTA-Reihe: Primär-CTA (*„Trauungstermin anfragen“*) + Sekundär-Trigger (*„Hörprobe anspielen“* mit pulsierendem Play-Icon).

---

## 2. Generatives Farb- & Typografie-System (Bespoke HSL-Harmonie)

### 2.1 CSS-Farb-Token:
```css
:root {
  /* Kathedral-Nachtblau Basis & Surface */
  --sc-canvas: hsl(211, 58%, 9%);       /* #0a1420 */
  --sc-surface: hsl(210, 42%, 15%);     /* #162536 */
  --sc-surface-elevated: hsl(210, 38%, 20%); /* #1f334a */

  /* Elfenbein-Sandstein Kontrastflächen */
  --sc-canvas-light: hsl(40, 24%, 95%); /* #f6f3ee */
  --sc-surface-light: #ffffff;
  --sc-border-light: rgba(18, 30, 42, 0.12);

  /* Edles Champagner-Gold (WCAG AA >= 4.5:1 auf Nachtblau) */
  --sc-accent: hsl(42, 48%, 68%);       /* #d8c292 */
  --sc-accent-hover: hsl(42, 55%, 74%); /* #e2cf9f */
  --sc-accent-subtle: hsla(42, 48%, 68%, 0.15);
  --sc-accent-rgb: 216, 194, 146;

  /* Dom-Messing Linien & Glassmorphismus */
  --sc-border: hsla(42, 48%, 68%, 0.22);
  --sc-border-subtle: rgba(255, 255, 255, 0.08);

  /* Typografie Inks */
  --sc-ink: hsl(40, 20%, 97%);          /* #faf8f5 Warmes Alabaster-Weiß */
  --sc-ink-muted: hsl(212, 14%, 68%);   /* #a3abb5 Feines Quarz-Grau */
  --sc-ink-dark: hsl(211, 50%, 14%);    /* #121e2a Tiefes Dom-Anthrazit für Hell-Sektion */
  --sc-ink-muted-dark: hsl(212, 18%, 38%); /* #4f5f70 Muted Text für Hell-Sektion */
}
```

### 2.2 Sektions-Kontrast-Rhythmus (3 dynamische Hell-Dunkel-Wechsel):
1. **Sektion 1 (Hero & Heritage):** Kathedral-Nachtblau (`#0a1420`)
2. **Sektion 2 (Das 5-Stimmen-Feld):** Mitternachts-Marine (`#162536`)
3. **Sektion 3 (Cinematische Pause):** Vollflächige Dom-Impression mit dezentem Kathedralen-Schein
4. **Sektion 4 (Die 3 Meister-Pakete):** Heller Elfenbein-Sandstein (`#f6f3ee`) mit dunklem Ink
5. **Sektion 5 (Repertoire & Audio-Lounge):** Kathedral-Nachtblau (`#0a1420`)
6. **Sektion 6 (Trauungs-Assistent) & Sektion 7 (Footer):** Nachtblau mit Champagner-Gold-Akzenten

### 2.3 Typografie-System:
- **Headline / Display:** `Playfair Display` (Gewichte: 600 Semi-Bold für sakrale Erhabenheit, 500 italic für Gänsehaut-Auszeichnungen).
- **Fließtext / UI / Controls:** `Plus Jakarta Sans` (Gewichte: 400 Regular, 500 Medium, 600 Semi-Bold).
- **Hero-Claim (exakt 39 Zeichen):** *„Fünf Stimmen. Ein reiner Domklang.“*

---

## 3. Motion- & Interaktions-System (Emil Kowalski Craft & 6 Primitiven)

### Gewählte 6 Primitiven:
1. **Primitiv 1: Hero Kinetic Typography (SplitType Reveal):**
   - Headline-Wörter und -Zeichen fliegen mit Stagger 0.04s, yPercent: 100 → 0, Duration 0.9s, Ease: `power3.out` ein.
2. **Primitiv 6: Native CSS-3D Perspective Tilt & Parallax (0 KB Zusatz-Payload):**
   - Feinfühliger Maus-Tilt (max. 7°) auf Bento-Karten und Audio-Stelen im Desktop; sanfter 3D-Scroll-Tilt auf Smartphones.
3. **Primitiv 7: Text Scrubbing / Editorial Dim-to-Reveal:**
   - Großzitat in Sektion 3 (*„Gänsehaut, als alle 5 Stimmen einstimmten.“*) enthüllt sich Wort für Wort synchron zum Scrollen von 20% auf 100% Opazität.
4. **Primitiv 4: Dynamic Stat & Rating Counters:**
   - 5 Gesangsstimmen, 1.050 Jahre Tradition, 100% Naturklang, 5.0 Sterne Google-Rating zählen beim Viewport-Eintritt hoch.
5. **Primitiv 5: Magnetic Buttons (Desktop):**
   - Primär-CTA Buttons ziehen sich im Umkreis von 40px elastisch zum Cursor (`duration: 0.3s, ease: power2.out`).
6. **Primitiv 12: Continuous Rotating Stamp / Seal:**
   - Typografischer Kreisstempel *„1.050 JAHRE CHORTRADITION • REGENSBURGER DOMSPATZEN •“* rotiert gleichmäßig mit dem Seiten-Scroll.

---

## 4. Signature Feature: „Das Pentavox Polyphonie-Pult“
- **Konzept:** Interaktives 5-Kanal-Vokal-Mischpult für die Stimmlagen Sopran, Alt, Tenor, Bariton, Bass.
- **Funktionsweise:**
  - Besucher kann zwischen Werken (Mendelssohn Bartholdy, Cohens Hallelujah, Ed Sheeran) wählen.
  - Über 5 vertikale Klangstelen können einzelne Stimmen stummgeschaltet (Mute) oder isoliert (Solo) werden.
  - Die Web Audio API moduliert in Echtzeit die Lautstärken der polyphonen Vokal-Harmonien.
  - Ein HTML5-Canvas zeichnet 60fps die Resonanz- und Frequenzkurven der aktiven Stimmen als fließende Sinuswellen.
- **Mobile-Handling:** Akkordeon-Modus mit vertikalen Tabs; aktive Gesangsstimme expandiert auf 140px, inaktive Stimmen als 44px Schnellwähler.

---

## 5. Erlebnis-Kontaktpunkt: 3-Schritte Trauungs-Assistent
- **Schritt 1 (Anlass & Vokal-Konzept):** Kirchliche Trauung / Freie Trauung / Standesamt / Empfang & Gala.
- **Schritt 2 (Wunschort, Datum & Wunschsong):** Veranstaltungsort (z.B. Regensburg, München, Nürnberg), Wunschdatum und Vormerkung des persönlichen Wunschlieds.
- **Schritt 3 (Kontaktdaten & DSGVO):** Name, Telefon/WhatsApp, E-Mail, persönliche Notiz mit sofortiger WhatsApp-Weiterleitung und Formspree-Fallback.

---

## 6. Tageszeit-Personalisierung (data-time-greeting)
- **Morgen (06:00 – 11:59):** *„Guten Morgen — Willkommen bei Pentavox Regensburg.“*
- **Tag (12:00 – 18:59):** *„Guten Tag — Wir schenken Ihrer Feier den unverwechselbaren Domspatzen-Klang.“*
- **Abend / Nacht (19:00 – 05:59):** *„Guten Abend — Planen Sie Ihre Traumhochzeit für die Saison 2026 / 2027?“*

---

## 7. Smart-Assistenten Suite (v8.0)
- **Baustein A (Chat-Assistent):** Lokaler Vokal-Berater *„Pentavox Trauungs-Assistent“* (kein externer API-Call, sofortige Antworten zu Preisen, Repertoire, Einsatzgebiet, Ablauf).
- **Baustein B (Bewertungs-Tool):** `bewertung.html` mit automatischem WhatsApp-Direktlink für Brautpaare nach der Feier.
- **Baustein C (Recruiting):** Deaktiviert (Recruiting: NEIN).
