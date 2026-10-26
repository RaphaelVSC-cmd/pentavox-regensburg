'use strict';

/**
 * === BAUSTEIN B: BEWERTUNGS-TOOL (v8.0) ===
 * WhatsApp-Link-Generator für Bewertungsanfragen nach abgeschlossenen Trauungen & Festen.
 * Rein clientseitig, ephemer – keine dauerhafte Speicherung von Kundendaten.
 */

const BEWERTUNG_CONFIG = {
  firma: 'Pentavox Regensburg',
  googleLink: 'https://maps.google.com/?cid=pentavox-regensburg', // [MANUELL PRUEFEN: Exakte Google Maps Review Place-ID eintragen]
  nachrichtVorlage: (kundenname, firma, googleLink) =>
    `Liebe/r ${kundenname}, vielen herzlichen Dank, dass wir eure Feier mit ${firma} musikalisch begleiten durften! ` +
    `Wenn euch unser 5-stimmiger Satzgesang und die Gänsehaut-Momente berührt haben, würden wir uns riesig freuen, ` +
    `wenn ihr euch kurz 2 Minuten für eine Google-Bewertung nehmt – das hilft anderen Brautpaaren enorm: ` +
    `${googleLink} ` +
    `Herzlichen Dank, alles Gute für eure gemeinsame Zukunft und bis zum nächsten Wiederhören!`
};

function normalizeTel(raw) {
  let t = raw.replace(/[\s\-\.]/g, '');
  if (t.startsWith('00')) t = '+' + t.slice(2);
  if (t.startsWith('0'))  t = '+49' + t.slice(1);
  if (!t.startsWith('+')) t = '+49' + t;
  return t.replace(/[^0-9+]/g, '');
}

function buildWaMessage(tel, name) {
  const normalized = normalizeTel(tel);
  const waNum = normalized.replace('+', '');
  const text = BEWERTUNG_CONFIG.nachrichtVorlage(name, BEWERTUNG_CONFIG.firma, BEWERTUNG_CONFIG.googleLink);
  return 'https://wa.me/' + waNum + '?text=' + encodeURIComponent(text);
}

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('bewertungForm');
  const result    = document.getElementById('bewertungResult');
  const waLinkEl  = document.getElementById('bewertungWaLink');
  const copyBtn   = document.getElementById('bewertungCopyBtn');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = (document.getElementById('bKundenname')?.value || '').trim();
    const tel  = (document.getElementById('bTelefon')?.value || '').trim();
    if (!name || !tel) return;

    const waUrl = buildWaMessage(tel, name);
    if (waLinkEl) {
      waLinkEl.href = waUrl;
      waLinkEl.textContent = 'In WhatsApp öffnen & versenden';
    }
    if (result) result.classList.add('is-visible');
    result?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  copyBtn && copyBtn.addEventListener('click', async () => {
    const link = waLinkEl?.href;
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      copyBtn.textContent = 'Link kopiert!';
      setTimeout(() => { copyBtn.textContent = 'Link kopieren'; }, 2000);
    } catch {
      copyBtn.textContent = 'Manuell kopieren';
    }
  });
});
