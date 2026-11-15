# Übergabe- & Pflegeanleitung – five elements

Willkommen zu eurer neuen Website **five elements**! Alle Inhalte wurden exakt anhand eures Konzeptplans in der aktiven „Wir“-Perspektive aufgebaut.

---

## 1. Offene `[MANUELL PRUEFEN]`-Stellen schnell ausfüllen
Im Sinne unserer Zero-Hallucination-Regel wurden keine privaten Daten, IBANs oder fremde Team-Infos erfunden. Alle noch offenen Angaben sind im Code klar mit `[MANUELL PRUEFEN: ...]` markiert – öffnet einfach `index.html` (und ggf. `app.js`):

1. **Ensemble-Kontaktdaten (`index.html`, `#kontakt` & `#impressumModal`):**
   - Eure Ensemble-E-Mail-Adresse eintragen (`[MANUELL PRUEFEN: Ensemble-E-Mail]`).
   - Eure Ensemble-Telefon- / WhatsApp-Nummer eintragen (`[MANUELL PRUEFEN: +49 ...]`).
   - Optional in `app.js` Zeile 11 bei `whatsappNumber: ''` eure Nummer im Format `'4917...'` eintragen, damit der WhatsApp-Button direkt euren Chat öffnet.
   - Im `#impressumModal` Marias Nachnamen und ggf. eure Rechtsform (z. B. GbR) ergänzen.
2. **Spenden-IBAN (`index.html`, `#spenden`):**
   - Kontoinhaber bestätigen und eure echte IBAN statt `[MANUELL PRUEFEN: DE00 ...]` eintragen.
3. **Mitglieder-Steckbriefe (`index.html`, `#ensemble`):**
   - Bei **Maria** sowie **Stimme 2 bis Stimme 5**: Namen, Stimmlage, persönliches „Warum singe ich?“, Zusatz-Instrument und Lieblingssong ergänzen.
4. **Echte Hörproben & Ensemble-Fotos:**
   - Sobald eure Studio-Aufnahmen und echten Bandfotos fertig sind:
     - Bilder einfach unter `/assets/images/ensemble-hero.jpg` und `/assets/images/concert-hall.jpg` ersetzen und den Hinweis „Symbolbild“ im Hero entfernen.
     - Für echte MP3s könnt ihr in `app.js` bei `initKlangpult()` `<audio>`-Quellen einbinden.

---

## 2. Kontaktformular & Analytics einrichten
- **Formspree (`index.html` Zeile ~577):** Aktuell läuft das Formular auf die Demo-ID `https://formspree.io/f/xbjnqkyv`. Erstellt euch kostenlos einen Account auf [formspree.io](https://formspree.io) und ersetzt diese ID durch eure eigene, damit alle Anfragen direkt in eurem Ensemble-Postfach landen.
- **Bewertungs-Tool (`/bewertung.html`):** Unter `https://fiveelements.vercel.app/bewertung.html` (für Google über `noindex` & `robots.txt` unsichtbar) könnt ihr direkt nach Auftritten personalisierte WhatsApp-Bewertungslinks an eure Gastgeber verschicken.

---

## 3. Support
Bei technischen Fragen oder Erweiterungen hilft euch jederzeit weiter:  
**Raphael Neumeier · Nexbot Webdesign** · `+49 176 51270378` · `kontakt@nexbot.info`
