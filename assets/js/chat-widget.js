'use strict';

/**
 * Baustein A: Lokaler Info- & Vokal-Assistent für „five elements“
 * 100 % lokal im Browser (null externe API-Calls) mit ausdrücklichem rechtlichem Haftungsausschluss.
 */
(function initFiveElementsChat() {
  const root = document.getElementById('feChatRoot');
  if (!root) return;

  const CHAT_KB = [
    {
      keywords: ['preis', 'kosten', 'budget', 'teuer', 'euro', '€', 'verhand'],
      answer:
        'Unsere unverbindlichen Richtwerte: Sektempfang 100 € (+ Fahrtkosten, 30 Min. Daseinszeit, 3 Stücke), Trauung 150 € (+ Fahrtkosten, 1 Std. Daseinszeit, 5 Lieder) und Eigenkonzept / Vokalkonzert 375 € oder Spendenbasis (ca. 1 Std. reine Singzeit, ~12 Stücke). Über unseren Maximalbudget-Rechner könnt ihr auch ein eigenes Budget angeben.',
    },
    {
      keywords: ['gema', 'recht', 'lizenz'],
      answer:
        'GEMA fällt bei Auftritten grundsätzlich immer an. Im Anfrage-Assistenten und in der Checkliste wählt ihr einfach aus, ob ihr die GEMA selbst meldet/zahlt oder ob wir sie in euer Angebot mit einkalkulieren sollen.',
    },
    {
      keywords: ['domspatz', 'regensburg', 'unabhängig', 'wer'],
      answer:
        'Wir sind five elements – fünf junge Stimmen, die sich bei einem Projektsingen kennengelernt haben. Wir sind Schüler der Regensburger Domspatzen bis Ende 2027 und werden dort ausgebildet, treten aber zu 100 % eigenständig auf.',
    },
    {
      keywords: ['spende', 'iban', 'konto', 'bank', 'unterstütz'],
      answer:
        'Danke für euer Interesse! In unserer Spenden-Sektion findet ihr die Bankverbindung / IBAN (aktuell mit Prüfmarker zum Bestätigen) inkl. Kopier-Button für eigene Vokalkonzerte & Notenarbeit.',
    },
    {
      keywords: ['song', 'lied', 'repertoire', 'wunsch', 'earth', 'volksmusik', 'technik', 'strom'],
      answer:
        'Wir singen rein a-cappella und komplett stromlos – von frühen Notenschriften über Renaissance/Romantik (z. B. Becker, Hassler) bis zu „Earth Song“ (Ticheli), Holst & Volksmusik. Euren Wunschsong könnt ihr direkt im Klangpult vormerken!',
    },
    {
      keywords: ['pflicht', 'raum', 'essen', 'trinken', 'verpfleg', 'vertrag', 'zahlung', 'fahrt'],
      answer:
        'Vor Ort brauchen wir: (1) geklärte GEMA, (2) unterschriebenen Vertrag + Kilometerpauschale, (3) einen separaten Raum zum Umziehen/Herrichten, (4) Verpflegung (mind. Wasser für 5 Personen) und (5) Bar- oder Überweisungszahlung.',
    },
  ];

  root.innerHTML = `
    <div class="chat-panel" id="feChatPanel" role="dialog" aria-label="five elements Info-Assistent" hidden>
      <div class="chat-panel-head">
        <div>
          <strong style="display:block; font-size:0.92rem;">five elements · Frage-Hilfe</strong>
          <span style="font-size:0.74rem; color:var(--fe-ink-muted-dark);">Lokal · Direkte „Wir“-Antworten</span>
        </div>
        <button type="button" class="drawer-close-btn" id="feChatClose" aria-label="Chat schließen" style="width:32px; height:32px; font-size:1.1rem;">&times;</button>
      </div>
      <div class="chat-disclaimer-strip">
        <strong>Rechtlicher Hinweis:</strong> Lokaler Info-Bot. Alle Antworten sind unverbindlich &amp; ohne Gewähr (keine Rechts-/Vertragsbindung).
      </div>
      <div class="chat-messages" id="feChatMessages">
        <div class="chat-bubble is-bot">
          Hey! Wir sind <strong>five elements</strong>. Was möchtet ihr wissen – Preise, Maximalbudget, GEMA, Wunschsongs oder unsere Checkliste?
        </div>
      </div>
      <div class="chat-quick-row">
        <button type="button" class="chat-quick-chip" data-q="Was kostet ein Auftritt?">Preise?</button>
        <button type="button" class="chat-quick-chip" data-q="Wie läuft die GEMA?">GEMA?</button>
        <button type="button" class="chat-quick-chip" data-q="Was braucht ihr vor Ort?">Pflichten?</button>
        <button type="button" class="chat-quick-chip" data-q="Spenden & IBAN?">Spenden?</button>
      </div>
      <form class="chat-input-form" id="feChatForm">
        <label for="feChatInput" class="sr-only">Frage eintippen</label>
        <input type="text" id="feChatInput" placeholder="Frage stellen…" autocomplete="off" />
        <button type="submit" class="btn btn-primary btn-sm">OK</button>
      </form>
    </div>
    <button type="button" class="fe-chat-toggle" id="feChatToggle" aria-expanded="false" aria-controls="feChatPanel">
      Fragen? Wir helfen!
    </button>
  `;

  const panel = document.getElementById('feChatPanel');
  const toggleBtn = document.getElementById('feChatToggle');
  const closeBtn = document.getElementById('feChatClose');
  const form = document.getElementById('feChatForm');
  const input = document.getElementById('feChatInput');
  const messagesEl = document.getElementById('feChatMessages');

  const togglePanel = (force) => {
    const open = typeof force === 'boolean' ? force : panel.hidden;
    panel.hidden = !open;
    toggleBtn.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  };

  toggleBtn.addEventListener('click', () => togglePanel());
  closeBtn.addEventListener('click', () => togglePanel(false));

  const appendMsg = (text, who) => {
    const div = document.createElement('div');
    div.className = `chat-bubble ${who === 'user' ? 'is-user' : 'is-bot'}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const replyTo = (q) => {
    const low = q.toLowerCase();
    const match = CHAT_KB.find((item) => item.keywords.some((k) => low.includes(k)));
    if (match) {
      appendMsg(match.answer, 'bot');
    } else {
      appendMsg(
        'Dazu beraten wir euch am besten direkt im 3-Schritte-Anfrage-Assistenten weiter unten – nennt uns dort gerne euer Wunschdatum, den Ort und euer Maximalbudget (alles unverbindlich).',
        'bot'
      );
    }
  };

  root.querySelectorAll('.chat-quick-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.q || chip.textContent;
      appendMsg(q, 'user');
      replyTo(q);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    appendMsg(q, 'user');
    replyTo(q);
  });
})();
