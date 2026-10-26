# Kundenanleitung & System-Handbuch – Pentavox Regensburg

Herzlich willkommen zu Ihrer neuen Website! Dieses Dokument erläutert alle Funktionen, Einstellmöglichkeiten und die Verwaltung Ihrer digitalen Präsenz.

---

## 1. Was wurde für Pentavox Regensburg gebaut?

### 1.1 Das Pentavox Polyphonie-Pult (Signature Feature)
Auf der Startseite befindet sich ein interaktives 5-Kanal-Vokal-Mischpult. Besucher können:
- Zwischen 4 Meister-Chorsätzen wählen (*Mendelssohn, Hallelujah, Ed Sheeran, Elvis*).
- Die 5 Stimmlagen (**Sopran, Alt, Tenor, Bariton, Bass**) einzeln isolieren (*Solo*) oder stummschalten (*Mute*).
- Eine fließende, mathematisch exakte 60fps Sinuswellen-Animation visualisiert die harmonische Raumresonanz in Echtzeit.
- Das Pult demonstriert Brautpaaren unmittelbar die klangliche Reinheit und handwerkliche Exzellenz der Regensburger Domspatzen-Schule.

### 1.2 3-Schritte Trauungs-Assistent (Erlebnis-Kontaktpunkt)
Statt eines statischen Formulars führt ein 3-stufiger Assistent Brautpaare intuitiv durch die Anfrage:
1. **Anlass & Konzept:** Kirchliche Trauung, Freie Trauung, Trauung & Empfang (Paket M) oder Ganztagsbegleitung.
2. **Ort, Datum & Wunschsong:** Angabe von Datum, Trauort und dem persönlichen Wunschlied (1 individuelles Arrangement ist inklusive).
3. **Kontaktdaten & DSGVO:** Direkte Übermittlung per Formspree mit sofortigem WhatsApp-Fallback bei Funklöchern.

### 1.3 Baustein A: Lokaler Vokal-Assistent (Chat-Widget)
Rechts unten auf der Website steht rund um die Uhr ein digitaler Berater zur Verfügung. Er beantwortet Fragen zu Paket-Preisen, Repertoire, Einsatzgebieten und Erreichbarkeit – vollständig lokal im Browser, ohne externe laufende Serverkosten oder DSGVO-Risiken.

### 1.4 Baustein B: Internes Bewertungs-Tool (`/bewertung.html`)
Unter der Adresse `pentavox-regensburg.vercel.app/bewertung.html` (nicht in der Menüleiste sichtbar, exklusiv für Sie) können Sie nach einer gelungenen Trauung mit 2 Klicks eine personalisierte WhatsApp-Bewertungsbitte an das Brautpaar generieren und versenden.

---

## 2. Einrichtung & Aktivierung (Nach Übergabe)

### 2.1 Kontaktformular scharfschalten (Formspree)
1. Kostenlosen Account auf [formspree.io](https://formspree.io) registrieren.
2. Neues Formular mit dem Namen *„Pentavox Trauungsanfragen“* anlegen.
3. Die erhaltene Form-ID (z.B. `xbjnqkyv` oder Ihre neue ID) in `index.html` in Zeile 508 im Attribut `action="https://formspree.io/f/DEINE_ID"` eintragen.
4. Fertig! Ab sofort landen alle Anfragen direkt in Ihrem E-Mail-Postfach.

### 2.2 Datenschutz-Webanalyse aktivieren (Plausible.io oder Clarity)
- **Option A (Plausible.io - Empfohlen, 100 % DSGVO-konform ohne Cookie-Banner):**
  1. Account auf [plausible.io](https://plausible.io) anlegen und Domain eintragen.
  2. In `index.html` (ca. Zeile 38) die Zeile `<!-- <script defer data-domain="..." src="..."></script> -->` einkommentieren.
- **Option B (Microsoft Clarity - Kostenlose Heatmaps & Klick-Aufzeichnungen):**
  1. Auf [clarity.microsoft.com](https://clarity.microsoft.com) registrieren und Projekt anlegen.
  2. Den Tracking-Code in `index.html` einkommentieren und Ihre Project-ID eintragen.

### 2.3 Eigene Wunschdomain aufschalten (z.B. pentavox-regensburg.de)
1. In Ihrem Vercel-Dashboard das Projekt *pentavox-regensburg* auswählen.
2. Unter **Settings &rarr; Domains** Ihre Wunschdomain eingeben (z.B. `www.pentavox-regensburg.de`).
3. Bei Ihrem Domain-Registrar (z.B. Strato, IONOS, All-Inkl) die angezeigten DNS-Einträge hinterlegen:
   - Typ **CNAME** für `www` auf `cname.vercel-dns.com`
   - Typ **A** für Root auf `76.76.21.21`
4. SSL-Zertifikate werden von Vercel vollautomatisch innerhalb von 15 Minuten ausgestellt.

---

## 3. Was Sie selbst jederzeit anpassen können
In der Datei `index.html` können Sie mit jedem Texteditor einfache Änderungen vornehmen:
- **Telefonnummer / WhatsApp:** Suchen Sie nach `4917651270378` und ersetzen Sie die Rufnummer.
- **E-Mail-Adresse:** Suchen Sie nach `kontakt@nexbot.info`.
- **Repertoire-Titel:** Im Bereich `<section id="repertoire">` können Sie neue Lieder oder Genres ergänzen.

---

## 4. Support & Wartung
Haben Sie Fragen, wünschen Sie neue Hörproben oder technische Erweiterungen?  
Ihr technischer Ansprechpartner:

**Raphael Neumeier**  
Nexbot Webdesign  
Telefon / WhatsApp: **+49 176 51270378**  
E-Mail: **kontakt@nexbot.info**  
*Reaktionszeit im Wartungs-Paket: Innerhalb von 24 Stunden.*
