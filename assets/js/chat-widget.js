'use strict';

/**
 * === BAUSTEIN A: SMART CHAT-ASSISTENT (v8.0) ===
 * Pentavox Vokal-Berater: Vollständig lokal – kein externer API-Call zur Laufzeit.
 * CHAT_KB befüllt aus der Signature-DNA von Pentavox Regensburg.
 */

const CHAT_KB = {
  firma: 'Pentavox Regensburg',
  tel: '+49 176 51270378',
  wa: '4917651270378',
  leistungen: [
    'Paket S: Trauung Pur (3–4 Lieder + 1 Wunscharrangement)',
    'Paket M: Trauung & Sektempfang (1,5h Live-A-cappella)',
    'Paket L: Der Exklusivtag (Trauung, Empfang & Festdinner)'
  ],
  preisrahmen: 'Paket S (Trauung Pur), Paket M (Trauung & Sektempfang – unser Bestseller) und Paket L (Exklusivtag). Der Preis richtet sich nach Veranstaltungsort in Bayern und individuellem Wunschsong.',
  oeffnungszeiten: 'Mo–Sa von 09:00 bis 19:00 Uhr. Anfragen per WhatsApp oder über das Formular beantworten wir in der Regel binnen weniger Stunden.',
  einsatzgebiet: 'Regensburg, Oberpfalz, Niederbayern, München, Nürnberg und ganz Bayern (auf Anfrage auch österreichischer Grenzraum).',
  spezialitaet: '5-stimmige Polyphonie der Regensburger Domspatzen-Schule – 100 % A-cappella Naturklang ohne Synthesizer inklusive 1 individuellem Wunscharrangement.',

  intents: [
    {
      keywords: ['preis', 'kosten', 'kostet', 'angebot', 'gage', 'honorar', 'budget', 'paket'],
      antwort: 'Unsere Begleitung ist in drei transparente Meister-Pakete aufgeteilt: Paket S (Trauung Pur), Paket M (Trauung & Sektempfang) und Paket L (Der Exklusivtag). Jedes Paket beinhaltet 1 eigens für 5 Stimmen neu arrangiertes Wunschlied! Gerne erstellen wir Ihnen innerhalb von 24 Stunden eine verbindliche Vorab-Einschätzung für Ihren Wunschort.',
      wa_text: 'Hallo Pentavox Regensburg, ich interessiere mich für eine Terminanfrage und hätte gerne ein unverbindliches Angebot für unsere Hochzeit.',
      wa_label: 'Paket-Preise via WhatsApp anfragen'
    },
    {
      keywords: ['lied', 'lieder', 'repertoire', 'song', 'wunschlied', 'hallelujah', 'mendelssohn', 'ed sheeran', 'elvis', 'programm'],
      antwort: 'Unser Repertoire reicht von sakraler Polyphonie (Mendelssohn, Bach, Rheinberger) über Pop-Balladen (Ed Sheeran, Elvis Presley) bis hin zu modernen Chorsätzen (Cohens Hallelujah im Pentatonix-Arrangement). Das Besondere: Wir studieren für jedes Brautpaar 1 persönlichen Wunschsong 5-stimmig ein!',
      wa_text: 'Hallo Pentavox, wir haben ein bestimmtes Wunschlied für unsere Trauung und möchten fragen, ob ihr dieses 5-stimmig für uns singen könnt.',
      wa_label: 'Wunschlied per WhatsApp anfragen'
    },
    {
      keywords: ['besetzung', 'stimmen', 'domspatzen', 'sanger', 'sänger', 'a cappella', 'begleitung', 'wer seid ihr'],
      antwort: 'Pentavox besteht aus 5 ausgebildeten Stimmen: Sopran, Alt, Tenor, Bariton und Bass. Wir alle wurden bei den weltberühmten Regensburger Domspatzen ausgebildet. Wir singen überwiegend reines A-cappella (Naturklang), auf Wunsch auch mit feiner Klavier- oder Orgelbegleitung.',
      wa_text: 'Hallo Pentavox, ich möchte gerne mehr über eure Besetzung und Hörproben erfahren.',
      wa_label: 'Frage zur Besetzung'
    },
    {
      keywords: ['oeffnung', 'öffnung', 'erreichbar', 'wann', 'zeiten', 'kontakt', 'telefon'],
      antwort: 'Sie erreichen uns telefonisch oder per WhatsApp unter +49 176 51270378 von Mo–Sa 09:00–19:00 Uhr. Für schriftliche Anfragen steht Ihnen rund um die Uhr unser Trauungs-Assistent zur Verfügung.',
      wa_text: null
    },
    {
      keywords: ['einsatzgebiet', 'gebiet', 'wo', 'fahrt ihr', 'region', 'munchen', 'münchen', 'nurnberg', 'nürnberg', 'bayern', 'oberpfalz', 'kelheim', 'straubing', 'landshut'],
      antwort: 'Unser Heimatort ist Regensburg (Domplatz 1), wir begleiten Brautpaare aber in ganz Bayern – von Regensburg und der Oberpfalz über München und Nürnberg bis ins Voralpenland.',
      wa_text: 'Hallo Pentavox, wir heiraten in [Ort eintragen] und möchten fragen, ob ihr dort noch verfügbar seid.',
      wa_label: 'Einsatzgebiet & Termin prüfen'
    },
    {
      keywords: ['rückruf', 'anrufen', 'ruckruf', 'telefonieren', 'termin', 'sprechen'],
      antwort: 'Sehr gerne vereinbaren wir ein persönliches Telefongespräch, um den musikalischen Ablauf Ihrer Trauung in Ruhe zu besprechen. Senden Sie uns einfach kurz Ihren Namen und Ihre Rufnummer.',
      wa_text: 'Hallo Pentavox, ich hätte gerne einen kurzen Rückruf bezüglich unserer Hochzeit. Meine Nummer: ',
      wa_label: 'Rückruf anfordern'
    },
    {
      keywords: ['leistung', 'service', 'was macht ihr', 'anlass', 'anlaesse', 'kirche', 'standesamt', 'freie trauung'],
      antwort: 'Wir gestalten kirchliche und freie Trauungen mit Gänsehaut-Satzgesang, begleiten standesamtliche Zeremonien, sorgen beim Sektempfang für ein beschwingtes A-cappella-Set und schaffen beim Festdinner einen edlen Akustik-Klangteppich.',
      wa_text: null
    }
  ]
};

function findIntent(input) {
  const text = input.toLowerCase().normalize('NFC');
  const normalized = text
    .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/ß/g, 'ss');

  for (const intent of CHAT_KB.intents) {
    for (const kw of intent.keywords) {
      const kwNorm = kw.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss');
      if (normalized.includes(kwNorm)) return intent;
    }
  }
  return null;
}

function buildWaUrl(waText) {
  const base = 'https://wa.me/' + CHAT_KB.wa + '?text=';
  return base + encodeURIComponent(waText);
}

function addBubble(container, text, sender, waBtn) {
  const div = document.createElement('div');
  div.className = 'chat-bubble ' + sender;
  div.textContent = text;
  if (waBtn) {
    const a = document.createElement('a');
    a.href = buildWaUrl(waBtn.text);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'chat-wa-btn';
    a.setAttribute('aria-label', waBtn.label + ' via WhatsApp');
    a.textContent = '💬 ' + waBtn.label;
    div.appendChild(document.createElement('br'));
    div.appendChild(a);
  }
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function handleMessage(input, messagesEl) {
  const trimmed = input.trim();
  if (!trimmed) return;

  addBubble(messagesEl, trimmed, 'user');

  setTimeout(() => {
    const intent = findIntent(trimmed);
    if (intent) {
      const waBtn = intent.wa_text
        ? { text: intent.wa_text, label: intent.wa_label || 'Via WhatsApp senden' }
        : null;
      addBubble(messagesEl, intent.antwort, 'bot', waBtn);
    } else {
      addBubble(
        messagesEl,
        'Eine wunderbare Frage zu unserer Musik! Gerne klären wir die Details zu Ihrem Anlass ganz persönlich. Schreiben Sie uns direkt über WhatsApp oder nutzen Sie unseren 3-Schritte-Assistenten auf der Seite.',
        'bot',
        { text: 'Hallo ' + CHAT_KB.firma + ', ich habe eine Frage: ' + trimmed, label: 'Direkt via WhatsApp fragen' }
      );
    }
  }, 220);
}

function handleQuickAction(intentKey, messagesEl) {
  const mapping = {
    preis: 'preis',
    oeffnungszeiten: 'öffnung',
    einsatzgebiet: 'einsatzgebiet',
    kontakt: 'rückruf'
  };
  const kw = mapping[intentKey] || intentKey;
  const intent = CHAT_KB.intents.find(i => i.keywords.includes(kw));
  if (intent) {
    const waBtn = intent.wa_text
      ? { text: intent.wa_text, label: intent.wa_label || 'Via WhatsApp' }
      : null;
    addBubble(messagesEl, intent.antwort, 'bot', waBtn);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('chatToggle');
  const closeBtn = document.getElementById('chatClose');
  const panel = document.getElementById('chatPanel');
  const messagesEl = document.getElementById('chatMessages');
  const form = document.getElementById('chatInputForm');
  const input = document.getElementById('chatInput');
  const quickBtns = document.querySelectorAll('.chat-quick-btn');

  if (!toggle || !panel || !messagesEl) return;

  setTimeout(() => {
    addBubble(
      messagesEl,
      'Grüß Gott! Ich bin der digitale Assistent von Pentavox Regensburg. Haben Sie Fragen zu unseren 5 Gesangsstimmen, Preisen oder Wunschliedern?',
      'bot'
    );
  }, 600);

  toggle.addEventListener('click', () => {
    const isOpen = !panel.hidden;
    panel.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));
    if (!isOpen) {
      setTimeout(() => input && input.focus(), 80);
    }
  });

  closeBtn && closeBtn.addEventListener('click', () => {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  form && form.addEventListener('submit', e => {
    e.preventDefault();
    if (!input) return;
    handleMessage(input.value, messagesEl);
    input.value = '';
  });

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const intent = btn.dataset.intent;
      handleQuickAction(intent, messagesEl);
    });
  });
});
