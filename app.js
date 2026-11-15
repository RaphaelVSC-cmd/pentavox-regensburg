'use strict';

/**
 * five elements – A-cappella Quintett App Engine
 * Matte Pastel-Blue & Silver Metallic Craft · GSAP + Lenis + Web Audio API
 */

const ENSEMBLE_CONFIG = {
  // [MANUELL PRUEFEN: Offizielle WhatsApp-Nummer im Format 4917... eintragen, sonst öffnet WhatsApp den Vorlagen-Text zum Selbst-Auswählen]
  whatsappNumber: '',
  formspreeEndpoint: 'https://formspree.io/f/xbjnqkyv',
};

let lenisInstance = null;

function showToast(text) {
  const el = document.getElementById('toastNotice');
  if (!el) return;
  el.textContent = text;
  el.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    el.hidden = true;
  }, 3200);
}

// === 0. VERPFLICHTENDER VORSCHAU- & HAFTUNGSHINWEIS BEIM SEITENAUFRUF ===
function initWipWarningModal() {
  const modal = document.getElementById('wipWarningModal');
  const acceptBtn = document.getElementById('wipWarningAccept');
  if (!modal || !acceptBtn) return;

  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('fe-wip-open');
  document.body.style.overflow = 'hidden';

  if (lenisInstance) lenisInstance.stop();
  setTimeout(() => acceptBtn.focus({ preventScroll: true }), 60);

  acceptBtn.addEventListener('click', () => {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('fe-wip-open');
    document.body.style.overflow = '';
    if (lenisInstance) lenisInstance.start();
  });
}

// === 1. TAGESZEIT-BEGRÜSSUNG ===
function initTimeGreeting() {
  const pill = document.getElementById('timeGreeting');
  if (!pill) return;
  const span = pill.querySelector('span:last-child');
  if (!span) return;
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) {
    span.textContent = 'Guten Morgen! Lust auf fünf echte Stimmen?';
  } else if (hour >= 11 && hour < 17) {
    span.textContent = 'Hallo! Schön, dass ihr bei uns vorbeischaut';
  } else if (hour >= 17 && hour < 22) {
    span.textContent = 'Guten Abend! Perfekte Zeit für A-cappella-Klang';
  } else {
    span.textContent = 'Nachteulen willkommen – hört jederzeit rein!';
  }
}

// === 2. STICKY HEADER & MOBILE DRAWER ===
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const drawer = document.getElementById('mobileDrawer');
  const openBtn = document.getElementById('mobileMenuOpen');
  const closeBtn = document.getElementById('mobileMenuClose');
  if (!header || !drawer || !openBtn || !closeBtn) return;

  const updateScrollState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 36);
    document.body.classList.toggle('has-scrolled', window.scrollY > 320);
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  const openDrawer = () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (lenisInstance) lenisInstance.stop();
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lenisInstance) lenisInstance.start();
  };

  openBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Smooth anchor scrolling (closes drawer first so body never stays locked)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      if (drawer.classList.contains('is-open')) {
        closeDrawer();
      }
      if (lenisInstance) {
        lenisInstance.scrollTo(targetEl, { offset: -84, duration: 0.9 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// === 3. IDIOTENSICHERE SCHNELLSUCHE (#schnellsuche) ===
function initQuickFinder() {
  const input = document.getElementById('siteFinderInput');
  const chips = document.querySelectorAll('.finder-chip');
  const items = document.querySelectorAll('.finder-result-item');
  if (!input || !items.length) return;

  let activeFilter = 'all';

  const applyFilter = () => {
    const query = input.value.trim().toLowerCase();
    items.forEach((item) => {
      const tags = (item.dataset.tags || '').toLowerCase();
      const text = item.textContent.toLowerCase();
      const matchesChip = activeFilter === 'all' || tags.includes(activeFilter);
      const matchesText = !query || tags.includes(query) || text.includes(query);
      item.hidden = !(matchesChip && matchesText);
    });
  };

  input.addEventListener('input', applyFilter);

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      activeFilter = chip.dataset.filter || 'all';
      applyFilter();
    });
  });
}

// === 4. DAS „FIVE ELEMENTS“ KLANGPULT (WEB AUDIO API + 60FPS CANVAS) ===
function initKlangpult() {
  const canvas = document.getElementById('resonanceCanvas');
  const playAllBtn = document.getElementById('playAllBtn');
  const playBtnText = document.getElementById('playBtnText');
  const heroChordBtn = document.getElementById('heroQuickChordBtn');
  const trackBtns = document.querySelectorAll('.track-btn');
  const trackInfo = document.getElementById('currentTrackInfo');
  const statusLabel = document.getElementById('canvasStatusLabel');
  const steleToggles = document.querySelectorAll('.stele-toggle');
  const steles = document.querySelectorAll('.voice-stele');
  if (!canvas || !playAllBtn) return;

  const ctx = canvas.getContext('2d');
  const tracks = {
    earth: {
      title: 'Earth Song · Frank Ticheli (Zeitgenössisch)',
      freqs: [523.25, 440.0, 349.23, 261.63, 174.61],
    },
    becker: {
      title: 'Ich gedenke der alten Zeit · Albert Becker (Romantik)',
      freqs: [587.33, 440.0, 329.63, 246.94, 146.83],
    },
    hassler: {
      title: 'Nun fanget an · Hans Leo Hassler (Renaissance)',
      freqs: [659.25, 493.88, 392.0, 293.66, 196.0],
    },
    holst: {
      title: 'In the Bleak Midwinter · Gustav Holst (Chorklassik)',
      freqs: [493.88, 392.0, 329.63, 246.94, 164.81],
    },
  };

  let currentTrack = 'earth';
  let isPlaying = false;
  let audioCtx = null;
  let voices = [];
  const soloState = [false, false, false, false, false];
  const muteState = [false, false, false, false, false];
  let animPhase = 0;

  const stopAudio = () => {
    voices.forEach((v) => {
      try {
        v.gain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.06);
        setTimeout(() => {
          try {
            v.osc.stop();
            v.osc2.stop();
          } catch (_) { }
        }, 120);
      } catch (_) { }
    });
    voices = [];
    isPlaying = false;
    playAllBtn.setAttribute('aria-pressed', 'false');
    if (playBtnText) playBtnText.textContent = 'Klangpult starten';
    if (statusLabel) statusLabel.textContent = 'Pausiert · Alle 5 Stimmen bereit';
  };

  const updateGains = () => {
    const anySolo = soloState.some(Boolean);
    steles.forEach((stele, idx) => {
      const active = anySolo ? soloState[idx] : !muteState[idx];
      stele.classList.toggle('is-muted', !active);
      stele.classList.toggle('is-solo', soloState[idx]);
      if (voices[idx] && audioCtx) {
        voices[idx].gain.gain.setTargetAtTime(active ? 0.055 : 0.0001, audioCtx.currentTime, 0.08);
      }
    });
  };

  const startAudio = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      showToast('Euer Browser unterstützt leider kein Web Audio.');
      return;
    }
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (voices.length) stopAudio();

    const freqs = tracks[currentTrack].freqs;
    voices = freqs.map((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const gain = audioCtx.createGain();

      osc.type = idx < 2 ? 'sine' : 'triangle';
      osc2.type = 'sine';
      osc.frequency.value = freq;
      osc2.frequency.value = freq * 1.003; // leichte natürliche Chor-Schwebung

      filter.type = 'lowpass';
      filter.frequency.value = idx < 2 ? 1600 : 950;
      gain.gain.value = 0.0001;

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc2.start();
      return { osc, osc2, gain };
    });

    isPlaying = true;
    playAllBtn.setAttribute('aria-pressed', 'true');
    if (playBtnText) playBtnText.textContent = 'Klangpult stoppen';
    if (statusLabel) statusLabel.textContent = `Aktiv: ${tracks[currentTrack].title}`;
    updateGains();
  };

  playAllBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  });

  if (heroChordBtn) {
    heroChordBtn.addEventListener('click', () => {
      const section = document.getElementById('klangpult');
      if (lenisInstance && section) {
        lenisInstance.scrollTo(section, { offset: -70, duration: 0.9 });
      }
      if (!isPlaying) startAudio();
    });
  }

  trackBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.track;
      if (!tracks[key]) return;
      trackBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentTrack = key;
      if (trackInfo) trackInfo.textContent = tracks[key].title;
      if (isPlaying) startAudio();
    });
  });

  steleToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.voice);
      const action = btn.dataset.action;
      if (Number.isNaN(idx)) return;

      if (action === 'solo') {
        soloState[idx] = !soloState[idx];
        btn.setAttribute('aria-pressed', String(soloState[idx]));
      } else if (action === 'mute') {
        muteState[idx] = !muteState[idx];
        btn.setAttribute('aria-pressed', String(muteState[idx]));
      }
      updateGains();
    });
  });

  // Quick Wunschsong transfer into Formular
  const quickWishInput = document.getElementById('quickWishSongInput');
  const applyWishBtn = document.getElementById('applyWishSongBtn');
  if (quickWishInput && applyWishBtn) {
    applyWishBtn.addEventListener('click', () => {
      const val = quickWishInput.value.trim();
      const targetField = document.getElementById('wishSongsInput');
      if (targetField && val) {
        targetField.value = targetField.value ? `${targetField.value}, ${val}` : val;
        showToast(`Wunschsong „${val}“ für eure Anfrage gemerkt!`);
      } else {
        showToast('Tragt zuerst einen Wunschsong ein.');
        quickWishInput.focus();
        return;
      }
      const contactSec = document.getElementById('kontakt');
      if (contactSec) {
        if (lenisInstance) lenisInstance.scrollTo(contactSec, { offset: -80, duration: 0.8 });
        else contactSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 60fps Canvas Resonance Waves (Pastel Sky Blue + Brushed Silver)
  const waveColors = [
    'rgba(237, 244, 252, 0.92)',
    'rgba(196, 218, 240, 0.85)',
    'rgba(173, 200, 230, 0.78)',
    'rgba(130, 167, 209, 0.72)',
    'rgba(180, 196, 216, 0.65)',
  ];

  const renderWave = () => {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const anySolo = soloState.some(Boolean);
    const baseAmp = isPlaying ? 26 : 9;
    animPhase += isPlaying ? 0.045 : 0.015;

    for (let v = 0; v < 5; v += 1) {
      const active = anySolo ? soloState[v] : !muteState[v];
      ctx.beginPath();
      ctx.strokeStyle = active ? waveColors[v] : 'rgba(180, 196, 216, 0.16)';
      ctx.lineWidth = active ? 2.6 : 1.2;

      const freqScale = 0.008 + v * 0.0025;
      const yOffset = h / 2 + (v - 2) * 14;
      const amp = active ? baseAmp * (1 - v * 0.08) : 3;

      for (let x = 0; x <= w; x += 10) {
        const envelope = Math.sin((x / w) * Math.PI);
        const y =
          yOffset +
          Math.sin(x * freqScale + animPhase + v * 0.9) * amp * envelope +
          Math.cos(x * freqScale * 0.5 - animPhase * 0.6) * (amp * 0.35) * envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    requestAnimationFrame(renderWave);
  };
  renderWave();
}

// === 5. PERSÖNLICHKEITS- & STIMMUNGS-KOMPASS ===
function initPersonalityCompass() {
  const btns = document.querySelectorAll('.vibe-btn');
  const output = document.getElementById('vibeOutput');
  if (!btns.length || !output) return;

  const answers = {
    deep: '<strong>Unser Tipp bei Gänsehaut &amp; Tiefe:</strong> Wir starten am liebsten mit <em>„Earth Song“</em> (Frank Ticheli) oder <em>„In the Bleak Midwinter“</em>. In der Probe arbeiten wir da minutenlang an einem einzigen Schlussakkord, bis der ganze Raum schwingt. Passt perfekt zur <strong>Trauung (150&nbsp;€)</strong> oder zum <strong>Vokalkonzert</strong>.',
    joy: '<strong>Unser Tipp für lockere Stimmung:</strong> Zwischen den Gesprächen auf dem <strong>Sektempfang (100&nbsp;€)</strong> tauchen wir plötzlich mitten unter den Gästen auf – keine Bühne, kein Kabel. Mit flotten Arrangements &amp; Volksmusik-Twists zaubern wir sofort Lächeln ins Gesicht.',
    classic: '<strong>Unser Tipp für zeitlose Eleganz:</strong> Mit <em>„Nun fanget an“</em> (Hassler) und <em>„Ich gedenke der alten Zeit“</em> (Becker) bringen wir echte Polyphonie von früher Notenschrift bis in die Romantik – perfekt für Hochzeiten, Taufen &amp; feierliche Konzerte.',
    wild: '<strong>Unser Tipp für verrückte Ideen:</strong> Ihr plant ein <strong>Richtfest</strong>, eine Scheunen-Überraschung oder eine unkonventionelle Location? Wir brauchen nur unsere Stimmen und freuen uns riesig über ungewöhnliche Anlässe!',
  };

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const key = btn.dataset.vibe || 'deep';
      output.innerHTML = answers[key] || answers.deep;
    });
  });
}

// === 6. MAXIMALBUDGET-RECHNER & GEMA-SYNC ===
function initBudgetAndChecklist() {
  const slider = document.getElementById('maxBudgetRange');
  const display = document.getElementById('budgetDisplayValue');
  const proposal = document.getElementById('budgetProposalText');
  const applyBudgetBtn = document.getElementById('applyBudgetBtn');
  const wizardBudget = document.getElementById('wizardBudgetInput');

  if (slider && display && proposal) {
    const updateProposal = () => {
      const val = Number(slider.value);
      display.textContent = String(val);

      if (val < 100) {
        proposal.innerHTML = `<strong>Passend zu ${val}&nbsp;€ (Verhandlungsbasis):</strong> Ein kurzes, persönliches <strong>1–2-Stücke-Ständchen</strong> in der Nähe oder eine flexible Lösung nach Absprache – fragt uns einfach an!`;
      } else if (val < 150) {
        proposal.innerHTML = `<strong>Passend zu ${val}&nbsp;€ (Verhandlungsbasis):</strong> Unser <strong>Sektempfang-Paket (100&nbsp;€, 3 Stücke / 30 Min.)</strong> passt direkt rein – mit kleinem Puffer Richtung Zusatzlied.`;
      } else if (val < 375) {
        proposal.innerHTML = `<strong>Passend zu ${val}&nbsp;€ (Verhandlungsbasis):</strong> Komplettes <strong>Trauungs-Paket (150&nbsp;€, 5 Lieder / 1 Std. Daseinszeit)</strong> oder ein individuell angepasstes Eventprogramm.`;
      } else {
        proposal.innerHTML = `<strong>Passend zu ${val}&nbsp;€ (Verhandlungsbasis):</strong> Genug Raum für unser <strong>Eigenes Vokalkonzert (~12 Stücke / 1 Std. reine Singzeit)</strong> oder Kombi-Begleitung!`;
      }
    };

    slider.addEventListener('input', updateProposal);
    updateProposal();

    if (applyBudgetBtn && wizardBudget) {
      applyBudgetBtn.addEventListener('click', () => {
        wizardBudget.value = slider.value;
        showToast(`Maximalbudget (${slider.value} €) in die Anfrage übernommen!`);
        const contactSec = document.getElementById('kontakt');
        if (lenisInstance && contactSec) {
          lenisInstance.scrollTo(contactSec, { offset: -80, duration: 0.85 });
        } else {
          contactSec?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  // GEMA Switch sync with Step 2 Select
  const gemaBtns = document.querySelectorAll('.gema-opt');
  const gemaSelect = document.getElementById('gemaSelectInput');
  if (gemaBtns.length && gemaSelect) {
    gemaBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        gemaBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        gemaSelect.value = btn.dataset.gema;
        showToast('GEMA-Auswahl aktualisiert.');
      });
    });

    gemaSelect.addEventListener('change', () => {
      gemaBtns.forEach((b) => {
        b.classList.toggle('is-active', b.dataset.gema === gemaSelect.value);
      });
    });
  }

  // Package quick select buttons -> jump to Step 1 / preselect
  document.querySelectorAll('.select-package-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pkg = btn.dataset.package;
      const hiddenPkg = document.getElementById('selectedPackageInput');
      if (hiddenPkg && pkg) hiddenPkg.value = pkg;
      document.querySelectorAll('#packageChoices .option-choice').forEach((choice) => {
        choice.classList.toggle('is-selected', choice.dataset.value === pkg);
      });
      const contactSec = document.getElementById('kontakt');
      if (lenisInstance && contactSec) {
        lenisInstance.scrollTo(contactSec, { offset: -80, duration: 0.85 });
      } else {
        contactSec?.scrollIntoView({ behavior: 'smooth' });
      }
      showToast('Paket vorausgewählt!');
    });
  });

  // IBAN Copy-to-Clipboard
  const copyIbanBtn = document.getElementById('copyIbanBtn');
  const ibanValue = document.getElementById('ibanValue');
  if (copyIbanBtn && ibanValue) {
    copyIbanBtn.addEventListener('click', async () => {
      const raw = ibanValue.textContent.trim();
      try {
        await navigator.clipboard.writeText(raw);
        showToast('IBAN-Feld in die Zwischenablage kopiert!');
      } catch (_) {
        showToast('IBAN markieren & kopieren: ' + raw);
      }
    });
  }
}

// === 7. 3-SCHRITTE ANFRAGE-ASSISTENT ===
function initBookingWizard() {
  const form = document.getElementById('bookingWizardForm');
  if (!form) return;

  const tabs = form.querySelectorAll('.wizard-step-tab');
  const panels = form.querySelectorAll('.wizard-panel');
  const choiceBtns = form.querySelectorAll('#packageChoices .option-choice');
  const pkgInput = document.getElementById('selectedPackageInput');
  const feedbackEl = document.getElementById('formFeedback');
  const fallbackEl = document.getElementById('formFallback');
  const waBtn = document.getElementById('whatsappSendBtn');

  const goStep = (stepNum) => {
    tabs.forEach((t) => t.classList.toggle('is-active', Number(t.dataset.step) === stepNum));
    panels.forEach((p) => p.classList.toggle('is-active', Number(p.dataset.panel) === stepNum));
  };

  tabs.forEach((t) => t.addEventListener('click', () => goStep(Number(t.dataset.step))));
  form.querySelectorAll('[data-next-step]').forEach((btn) => {
    btn.addEventListener('click', () => goStep(Number(btn.dataset.nextStep)));
  });
  form.querySelectorAll('[data-prev-step]').forEach((btn) => {
    btn.addEventListener('click', () => goStep(Number(btn.dataset.prevStep)));
  });

  choiceBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      choiceBtns.forEach((c) => c.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      if (pkgInput) pkgInput.value = btn.dataset.value || '';
    });
  });

  const buildSummaryText = () => {
    const pkg = pkgInput?.value || 'Individuell';
    const budget = document.getElementById('wizardBudgetInput')?.value || 'Nach Absprache';
    const date = document.getElementById('eventDateInput')?.value || 'Offen';
    const place = document.getElementById('eventPlaceInput')?.value || 'Nicht angegeben';
    const gema = document.getElementById('gemaSelectInput')?.value || 'Noch offen';
    const songs = document.getElementById('wishSongsInput')?.value || 'Noch offen';
    const name = document.getElementById('contactNameInput')?.value || '';
    return `Hallo five elements! Unverbindliche Anfrage:\n• Anlass/Paket: ${pkg}\n• Maximalbudget: ${budget} €\n• Datum: ${date}\n• Ort: ${place}\n• GEMA: ${gema}\n• Wunschsongs: ${songs}\n• Name: ${name}`;
  };

  if (waBtn) {
    waBtn.addEventListener('click', () => {
      const text = encodeURIComponent(buildSummaryText());
      const base = ENSEMBLE_CONFIG.whatsappNumber
        ? `https://wa.me/${ENSEMBLE_CONFIG.whatsappNumber}?text=${text}`
        : `https://wa.me/?text=${text}`;
      window.open(base, '_blank', 'noopener,noreferrer');
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('contactEmailInput')?.value.trim();
    const name = document.getElementById('contactNameInput')?.value.trim();
    const songs = document.getElementById('wishSongsInput')?.value.trim();
    const privacyOk = document.getElementById('privacyAcceptCheckbox')?.checked;

    if (!name || !email || !songs || !privacyOk) {
      if (feedbackEl) {
        feedbackEl.hidden = false;
        feedbackEl.innerHTML = '<strong>Bitte kurz prüfen:</strong> Name, E-Mail, Wunschsongs und das Datenschutz-Häkchen werden für eure Anfrage benötigt.';
      }
      goStep(3);
      return;
    }

    try {
      const formData = new FormData(form);
      const res = await fetch(ENSEMBLE_CONFIG.formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        if (feedbackEl) {
          feedbackEl.hidden = false;
          feedbackEl.innerHTML = '<strong>Danke für eure Anfrage!</strong> Wir haben eure Eckdaten erhalten und melden uns bald persönlich bei euch.';
        }
        if (fallbackEl) fallbackEl.hidden = true;
      } else {
        throw new Error('HTTP ' + res.status);
      }
    } catch (_) {
      if (fallbackEl) fallbackEl.hidden = false;
      if (feedbackEl) feedbackEl.hidden = true;
    }
  });
}

// === 8. TWO-CLICK GOOGLE MAPS, COOKIE CONSENT & MODALS ===
function initPrivacyAndModals() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAcceptBtn');
  const necessaryBtn = document.getElementById('cookieNecessaryBtn');
  const reopenBtn = document.getElementById('openCookieSettingsBtn');

  const stored = localStorage.getItem('fe_consent_v1');
  if (banner && !stored) {
    banner.hidden = false;
    document.body.classList.add('fe-cookie-open');
  }

  const saveConsent = (mode) => {
    localStorage.setItem('fe_consent_v1', mode);
    if (banner) banner.hidden = true;
    document.body.classList.remove('fe-cookie-open');
    if (mode === 'all') loadMapFrame();
  };

  acceptBtn?.addEventListener('click', () => saveConsent('all'));
  necessaryBtn?.addEventListener('click', () => saveConsent('necessary'));
  reopenBtn?.addEventListener('click', () => {
    if (banner) {
      banner.hidden = false;
      document.body.classList.add('fe-cookie-open');
    }
  });

  // Two-Click Map
  const mapBtn = document.getElementById('loadMapBtn');
  const mapPlaceholder = document.getElementById('mapPlaceholder');
  const mapIframe = document.getElementById('googleMapIframe');

  function loadMapFrame() {
    if (!mapIframe || !mapIframe.dataset.src) return;
    mapIframe.src = mapIframe.dataset.src;
    mapIframe.hidden = false;
    if (mapPlaceholder) mapPlaceholder.hidden = true;
  }

  if (stored === 'all') {
    loadMapFrame();
  }
  mapBtn?.addEventListener('click', loadMapFrame);

  // Legal Modals
  const closeAllModals = () => {
    document.querySelectorAll('.legal-modal').forEach((m) => {
      m.hidden = true;
    });
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.modal;
      const modal = id ? document.getElementById(id) : null;
      if (!modal) return;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelectorAll('.close-modal-btn').forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.legal-modal').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

// === 9. MOTION SYSTEM (LENIS + GSAP PRIMITIVES) ===
function initMotionSystem() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  if (typeof Lenis !== 'undefined' && !reduced) {
    lenisInstance = new Lenis({
      duration: 0.85,
      smoothWheel: true,
      smoothTouch: false,
      autoResize: true,
    });
    if (document.body.classList.contains('fe-wip-open')) {
      lenisInstance.stop();
    }
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  if (reduced || typeof gsap === 'undefined') return;

  // Primitive 1: Subtle Hero Entrance
  gsap.from('.hero-h1, .hero-sub, .hero-cta-row', {
    y: 22,
    opacity: 0,
    duration: 0.65,
    stagger: 0.08,
    ease: 'power3.out',
    clearProps: 'transform,opacity',
  });

  // Primitive 2: Staggered Bento / Card Reveals
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ['.members-grid .member-card', '.occasions-grid .occasion-card', '.pricing-grid .price-card', '.checklist-grid .duty-card'].forEach(
      (selector) => {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;
        gsap.from(els, {
          y: 24,
          opacity: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: els[0],
            start: 'top 90%',
            once: true,
          },
        });
      }
    );
  }

  // Primitive 3: Dynamic Stat Counters
  document.querySelectorAll('.counter').forEach((el) => {
    const target = Number(el.dataset.target || el.textContent);
    if (!target || Number.isNaN(target)) return;
    const obj = { val: 1 };
    gsap.to(obj, {
      val: target,
      duration: 1.1,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = String(Math.round(obj.val));
      },
    });
  });

  // Primitive 4 & 5: Subtle Desktop 3D Tilt & Magnetic CTA
  if (!isTouch) {
    document.querySelectorAll('.card-3d').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const rx = -((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 3.5;
        const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 3.5;
        gsap.to(card, { transform: `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg)`, duration: 0.25, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { transform: 'perspective(1100px) rotateX(0deg) rotateY(0deg)', duration: 0.4, ease: 'power3.out', clearProps: 'transform' });
      });
    });

    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.14;
        const dy = (e.clientY - r.top - r.height / 2) * 0.14;
        gsap.to(btn, { x: dx, y: dy, duration: 0.2, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.35, ease: 'power3.out', clearProps: 'transform' });
      });
    });
  }
}

// === 10. NEXBOT LIVE-ALARM DEMO RADAR (SKIP LOCALHOST TEST RUNS) ===
function initDemoTracker() {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || window.location.protocol === 'file:') return;

  const startTime = Date.now();
  const clicks = new Set();
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, a');
    if (t && clicks.size < 8) {
      clicks.add((t.innerText || t.getAttribute('aria-label') || 'Aktion').trim().slice(0, 32));
    }
  });

  let sentInitial = false;
  const sendPing = () => {
    const secs = Math.round((Date.now() - startTime) / 1000);
    const msg = `🔔 [NEXBOT RADAR] five elements besucht (${secs}s) · Klicks: ${Array.from(clicks).join(', ') || 'Scroll'}`;
    fetch('https://api.telegram.org/bot8932370815:AAEfF_FRLC12FTFwoa9uRrizlARluM8KYxE/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: '5942652345', text: msg }),
      keepalive: true,
    }).catch(() => { });
  };

  setTimeout(() => {
    if (!sentInitial) {
      sentInitial = true;
      sendPing();
    }
  }, 8000);
}

document.addEventListener('DOMContentLoaded', () => {
  initWipWarningModal();
  initTimeGreeting();
  initNavigation();
  initQuickFinder();
  initKlangpult();
  initPersonalityCompass();
  initBudgetAndChecklist();
  initBookingWizard();
  initPrivacyAndModals();
  initMotionSystem();
  initDemoTracker();
});
