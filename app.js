'use strict';

/**
 * ==========================================================================
 * PENTAVOX REGENSBURG - APP ENGINE (v8.0 Bespoke Unikat-Engine)
 * Polyphonie-Pult (Web Audio API), Emil Kowalski Motion Craft & Lenis
 * ==========================================================================
 */

// === 1. LENIS SMOOTH SCROLL ===
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 0.9,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    smoothTouch: false, /* WICHTIG: natives Smartphone-Scrollen */
    autoResize: true,
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* Lenis interne Anker-Links */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id && id !== '#') {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -70, duration: 1.1 });
        }
      }
    });
  });
}

// === 2. MOTION-PRIMITIVE 1: HERO KINETIC TYPOGRAPHY ===
function initKineticTypography() {
  if (typeof SplitType === 'undefined' || typeof gsap === 'undefined') return;

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const split = new SplitType(heroTitle, { types: 'words,chars' });
    gsap.from(split.chars, {
      opacity: 0,
      y: 70,
      rotateX: -25,
      stagger: 0.025,
      duration: 0.95,
      ease: 'power3.out',
      delay: 0.15,
      clearProps: 'transform,opacity'
    });
  }

  document.querySelectorAll('.section-title').forEach(title => {
    const split = new SplitType(title, { types: 'words' });
    gsap.from(split.words, {
      opacity: 0,
      y: 35,
      duration: 0.8,
      stagger: 0.04,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      clearProps: 'transform,opacity'
    });
  });
}

// === 3. MOTION-PRIMITIVE 6: NATIVE CSS-3D PERSPECTIVE TILT ===
function init3DTilt() {
  if (typeof gsap === 'undefined') return;
  const isTouch = window.matchMedia('(hover: none)').matches;

  document.querySelectorAll('.card-3d, [data-tilt-3d]').forEach(card => {
    if (!isTouch) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / (rect.height / 2)) * 6;
        const rotateY = (x / (rect.width / 2)) * 6;
        gsap.to(card, {
          transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
          duration: 0.6,
          ease: 'elastic.out(1, 0.6)'
        });
      });
    } else {
      gsap.fromTo(card,
        { transform: 'perspective(1000px) rotateX(5deg) translateY(20px)' },
        {
          transform: 'perspective(1000px) rotateX(0deg) translateY(0px)',
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  });
}

// === 4. MOTION-PRIMITIVE 7: TEXT SCRUBBING (DIM-TO-REVEAL) ===
function initTextScrub() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  document.querySelectorAll('[data-text-scrub]').forEach(container => {
    const raw = container.textContent.trim();
    container.innerHTML = raw.split(' ').map(w => `<span class="quote-word">${w}</span> `).join('');
    const words = container.querySelectorAll('.quote-word');

    gsap.to(words, {
      opacity: 1.0,
      stagger: 0.05,
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        end: 'bottom 45%',
        scrub: 0.6
      }
    });
  });
}

// === 5. MOTION-PRIMITIVE 4: DYNAMIC STAT COUNTERS ===
function initCounters() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  document.querySelectorAll('.stat-counter').forEach(el => {
    const target = parseFloat(el.dataset.target || '0');
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const isDecimal = String(el.dataset.target || '').includes('.');
    const duration = parseFloat(el.dataset.duration || '2.2');

    gsap.fromTo({ val: 0 }, { val: target }, {
      duration: duration,
      ease: 'power2.out',
      onUpdate: function() {
        const current = this.targets()[0].val;
        const formatted = isDecimal ? current.toFixed(1).replace('.', ',') : Math.round(current).toLocaleString('de-DE');
        el.textContent = prefix + formatted + suffix;
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });
}

// === 6. MOTION-PRIMITIVE 5: MAGNETIC BUTTONS (DESKTOP) ===
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches || typeof gsap === 'undefined') return;

  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width / 2) * 0.28,
        y: (e.clientY - r.top - r.height / 2) * 0.28,
        duration: 0.35,
        ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

// === 7. MOTION-PRIMITIVE 12: CONTINUOUS ROTATING SEAL ===
function initRotatingSeal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  document.querySelectorAll('[data-rotating-seal]').forEach(seal => {
    gsap.to(seal, {
      rotation: 360,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.0
      }
    });
  });
}

// === 8. SIGNATURE FEATURE: DAS PENTAVOX POLYPHONIE-PULT ===
/**
 * 5-Kanal Vokal-Synthesizer mit Web Audio API & 60fps Canvas Wellenform.
 * Ermöglicht individuelles Stummschalten (Mute) und Solieren (Solo) von:
 * Sopran, Alt, Tenor, Bariton, Bass.
 */
class PolyphonyAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentSong = 'mendelssohn';
    this.voices = ['sopran', 'alt', 'tenor', 'bariton', 'bass'];
    this.voiceNodes = {};
    this.voiceStates = {
      sopran:  { muted: false, solo: false, gain: 0.2 },
      alt:     { muted: false, solo: false, gain: 0.2 },
      tenor:   { muted: false, solo: false, gain: 0.2 },
      bariton: { muted: false, solo: false, gain: 0.2 },
      bass:    { muted: false, solo: false, gain: 0.2 },
    };
    this.masterGain = null;
    this.analyser = null;
    this.stepIndex = 0;
    this.timerId = null;

    // Harmonische Chorsätze (Frequenzen in Hz für 4 Akkord-Stufen je Lied)
    this.chordBooks = {
      mendelssohn: [
        // "Denn er hat seinen Engeln befohlen" (Sakrale Polyphonie)
        { sopran: 587.33, alt: 440.00, tenor: 370.00, bariton: 293.66, bass: 146.83 }, // D-Dur
        { sopran: 659.25, alt: 493.88, tenor: 392.00, bariton: 329.63, bass: 164.81 }, // e-Moll
        { sopran: 554.37, alt: 440.00, tenor: 329.63, bariton: 277.18, bass: 146.83 }, // A-Dur/C#
        { sopran: 587.33, alt: 440.00, tenor: 370.00, bariton: 293.66, bass: 146.83 }, // D-Dur Resolv
      ],
      hallelujah: [
        // "Hallelujah" (Cohen / Pentatonix Satz)
        { sopran: 523.25, alt: 392.00, tenor: 329.63, bariton: 261.63, bass: 130.81 }, // C-Dur
        { sopran: 440.00, alt: 349.23, tenor: 261.63, bariton: 220.00, bass: 110.00 }, // a-Moll
        { sopran: 523.25, alt: 392.00, tenor: 349.23, bariton: 261.63, bass: 130.81 }, // C-Dur
        { sopran: 440.00, alt: 349.23, tenor: 261.63, bariton: 220.00, bass: 110.00 }, // a-Moll
      ],
      perfect: [
        // "Perfect" (Ed Sheeran Pop-Chorsatz)
        { sopran: 622.25, alt: 466.16, tenor: 392.00, bariton: 311.13, bass: 155.56 }, // Es-Dur
        { sopran: 554.37, alt: 415.30, tenor: 349.23, bariton: 277.18, bass: 138.59 }, // c-Moll
        { sopran: 622.25, alt: 466.16, tenor: 369.99, bariton: 311.13, bass: 155.56 }, // As-Dur
        { sopran: 587.33, alt: 466.16, tenor: 349.23, bariton: 293.66, bass: 146.83 }, // B-Dur
      ],
      canthelp: [
        // "Can't Help Falling in Love" (A-cappella Romantik)
        { sopran: 523.25, alt: 392.00, tenor: 329.63, bariton: 261.63, bass: 130.81 }, // C-Dur
        { sopran: 493.88, alt: 392.00, tenor: 329.63, bariton: 246.94, bass: 123.47 }, // e-Moll
        { sopran: 440.00, alt: 349.23, tenor: 261.63, bariton: 220.00, bass: 110.00 }, // a-Moll
        { sopran: 523.25, alt: 349.23, tenor: 261.63, bariton: 261.63, bass: 130.81 }, // F-Dur
      ]
    };
  }

  initContext() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    // Analyser für 60fps Canvas Visualizer
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.85;

    // Vokal-Formantfilter (simuliert Kathedralen-Resonanz)
    const cathedralReverb = this.ctx.createBiquadFilter();
    cathedralReverb.type = 'lowpass';
    cathedralReverb.frequency.value = 3200;
    cathedralReverb.Q.value = 1.2;

    this.masterGain.connect(cathedralReverb);
    cathedralReverb.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Initialisiere die 5 Stimm-Kanäle mit subtilen Formanten
    const formants = {
      sopran:  { freq1: 850,  freq2: 1250 },
      alt:     { freq1: 650,  freq2: 1050 },
      tenor:   { freq1: 520,  freq2: 880 },
      bariton: { freq1: 380,  freq2: 720 },
      bass:    { freq1: 260,  freq2: 540 }
    };

    this.voices.forEach(v => {
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      const f1 = this.ctx.createBiquadFilter();
      f1.type = 'peaking';
      f1.frequency.value = formants[v].freq1;
      f1.gain.value = 4.0;
      f1.Q.value = 1.5;

      const f2 = this.ctx.createBiquadFilter();
      f2.type = 'peaking';
      f2.frequency.value = formants[v].freq2;
      f2.gain.value = 2.5;
      f2.Q.value = 2.0;

      gainNode.connect(f1);
      f1.connect(f2);
      f2.connect(this.masterGain);

      this.voiceNodes[v] = {
        gainNode: gainNode,
        osc1: null,
        osc2: null,
        vibrato: null
      };
    });
  }

  start() {
    this.initContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.stepIndex = 0;
    this.playNextChord();
    this.timerId = setInterval(() => {
      if (this.isPlaying) {
        this.stepIndex = (this.stepIndex + 1) % 4;
        this.playNextChord();
      }
    }, 2800);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) clearInterval(this.timerId);
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    this.voices.forEach(v => {
      const vObj = this.voiceNodes[v];
      if (vObj && vObj.gainNode) {
        vObj.gainNode.gain.cancelScheduledValues(now);
        vObj.gainNode.gain.setTargetAtTime(0.0001, now, 0.08);
      }
    });
  }

  playNextChord() {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    const book = this.chordBooks[this.currentSong] || this.chordBooks.mendelssohn;
    const chord = book[this.stepIndex];

    const hasSolo = this.voices.some(v => this.voiceStates[v].solo);

    this.voices.forEach(v => {
      const vObj = this.voiceNodes[v];
      if (!vObj) return;

      const baseFreq = chord[v] || 440;

      // Stoppe alte Oszillatoren weich
      if (vObj.osc1) {
        try { vObj.osc1.stop(now + 0.05); } catch (_) {}
      }
      if (vObj.osc2) {
        try { vObj.osc2.stop(now + 0.05); } catch (_) {}
      }

      // Erzeuge warme Dual-Oszillatoren (Sinus + feine Sägezahn-Obertonschwingung)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFreq * 1.002, now); // Leichtes Detuning für natürlichen Chorklang

      // Sanftes Vokal-Vibrato (5.5 Hz)
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.value = 5.2;
      vibratoGain.gain.value = baseFreq * 0.012; // ca. 1.2% Frequenzmodulation
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc1.frequency);
      vibratoGain.connect(osc2.frequency);
      vibrato.start(now);

      osc1.connect(vObj.gainNode);
      osc2.connect(vObj.gainNode);

      osc1.start(now);
      osc2.start(now);

      vObj.osc1 = osc1;
      vObj.osc2 = osc2;
      vObj.vibrato = vibrato;

      // Lautstärke-Target basierend auf Mute/Solo ermitteln
      let targetGain = 0.22;
      if (this.voiceStates[v].muted) {
        targetGain = 0.0001;
      } else if (hasSolo) {
        targetGain = this.voiceStates[v].solo ? 0.32 : 0.0001;
      }

      vObj.gainNode.gain.cancelScheduledValues(now);
      vObj.gainNode.gain.setTargetAtTime(targetGain, now, 0.12);
    });
  }

  setMute(voice, isMuted) {
    this.voiceStates[voice].muted = isMuted;
    this.updateGains();
  }

  setSolo(voice, isSolo) {
    this.voiceStates[voice].solo = isSolo;
    this.updateGains();
  }

  updateGains() {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    const hasSolo = this.voices.some(v => this.voiceStates[v].solo);

    this.voices.forEach(v => {
      const vObj = this.voiceNodes[v];
      if (!vObj) return;

      let target = 0.22;
      if (this.voiceStates[v].muted) {
        target = 0.0001;
      } else if (hasSolo) {
        target = this.voiceStates[v].solo ? 0.32 : 0.0001;
      }

      vObj.gainNode.gain.cancelScheduledValues(now);
      vObj.gainNode.gain.setTargetAtTime(target, now, 0.08);
    });
  }

  setSong(songKey) {
    this.currentSong = songKey;
    this.stepIndex = 0;
    if (this.isPlaying) {
      this.playNextChord();
    }
  }

  reset() {
    this.voices.forEach(v => {
      this.voiceStates[v].muted = false;
      this.voiceStates[v].solo = false;
    });
    this.updateGains();
  }
}

let audioEngine = null;

function initPolyphonyMixer() {
  const playBtn = document.getElementById('btnMixerPlay');
  const resetBtn = document.getElementById('btnMixerReset');
  const songChips = document.querySelectorAll('.song-chip');
  const voiceStelae = document.querySelectorAll('.voice-stele');
  const canvas = document.getElementById('resonanceCanvas');
  const heroPlayTrigger = document.getElementById('heroPlayTrigger');

  if (!playBtn) return;
  audioEngine = new PolyphonyAudioEngine();

  // Play / Pause Toggle
  function togglePlay() {
    if (!audioEngine.isPlaying) {
      audioEngine.start();
      playBtn.innerHTML = `
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        <span>Chor pausieren</span>
      `;
      playBtn.classList.add('is-active');
    } else {
      audioEngine.stop();
      playBtn.innerHTML = `
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span>5 Stimmen abspielen</span>
      `;
      playBtn.classList.remove('is-active');
    }
  }

  playBtn.addEventListener('click', togglePlay);

  if (heroPlayTrigger) {
    heroPlayTrigger.addEventListener('click', () => {
      const mixerSection = document.getElementById('stimmen');
      if (mixerSection && lenis) {
        lenis.scrollTo(mixerSection, { offset: -60, duration: 1.0 });
      }
      if (!audioEngine.isPlaying) {
        setTimeout(togglePlay, 400);
      }
    });
  }

  // Song Selector
  songChips.forEach(chip => {
    chip.addEventListener('click', () => {
      songChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const song = chip.dataset.song;
      audioEngine.setSong(song);
    });
  });

  // Track Play Buttons im Repertoire
  document.querySelectorAll('.btn-play-track').forEach(btn => {
    btn.addEventListener('click', () => {
      const songKey = btn.dataset.songKey;
      if (songKey) {
        const matchingChip = document.querySelector(`.song-chip[data-song="${songKey}"]`);
        if (matchingChip) matchingChip.click();

        const mixerSection = document.getElementById('stimmen');
        if (mixerSection && lenis) {
          lenis.scrollTo(mixerSection, { offset: -60, duration: 1.0 });
        }
        if (!audioEngine.isPlaying) {
          setTimeout(togglePlay, 350);
        }
      }
    });
  });

  // Voice Controls (Mute / Solo)
  voiceStelae.forEach(stele => {
    const voice = stele.dataset.voice;
    const muteBtn = stele.querySelector('.btn-mute');
    const soloBtn = stele.querySelector('.btn-solo');

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const willMute = !muteBtn.classList.contains('active');
        muteBtn.classList.toggle('active', willMute);
        stele.classList.toggle('is-muted', willMute);
        audioEngine.setMute(voice, willMute);
        refreshSteleDimming();
      });
    }

    if (soloBtn) {
      soloBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const willSolo = !soloBtn.classList.contains('active');
        soloBtn.classList.toggle('active', willSolo);
        stele.classList.toggle('is-soloed', willSolo);
        audioEngine.setSolo(voice, willSolo);
        refreshSteleDimming();
      });
    }
  });

  function refreshSteleDimming() {
    const hasSolo = Array.from(voiceStelae).some(s => s.querySelector('.btn-solo.active'));
    voiceStelae.forEach(s => {
      const isSolo = s.querySelector('.btn-solo.active');
      s.classList.toggle('is-dimmed', hasSolo && !isSolo);
    });
  }

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      audioEngine.reset();
      voiceStelae.forEach(s => {
        s.classList.remove('is-soloed', 'is-dimmed', 'is-muted');
        s.querySelector('.btn-solo')?.classList.remove('active');
        s.querySelector('.btn-mute')?.classList.remove('active');
      });
    });
  }

  // 60fps HTML5 Canvas Resonance Visualizer
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    }
    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    function drawWave() {
      animationFrameId = requestAnimationFrame(drawWave);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const mid = h / 2;

      ctx.lineWidth = 2.5 * window.devicePixelRatio;
      ctx.strokeStyle = '#d8c292';

      if (audioEngine && audioEngine.isPlaying && audioEngine.analyser) {
        const bufferLength = audioEngine.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        audioEngine.analyser.getByteTimeDomainData(dataArray);

        ctx.beginPath();
        const sliceWidth = w / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * h) / 2;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);

          x += sliceWidth;
        }
        ctx.stroke();

        // Zweite feine Obertonglanz-Welle
        ctx.beginPath();
        ctx.lineWidth = 1 * window.devicePixelRatio;
        ctx.strokeStyle = 'rgba(216, 194, 146, 0.4)';
        x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * h * 0.8) / 2 + mid * 0.2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();

        // EQ Bars modulieren
        document.querySelectorAll('.eq-bar').forEach((bar, idx) => {
          const val = dataArray[(idx * 8) % bufferLength] || 128;
          const normalized = Math.max(15, Math.min(100, Math.abs(val - 128) * 2.5 + 20));
          bar.style.height = normalized + '%';
        });
      } else {
        // Ruhende Sinuslinie
        const time = Date.now() * 0.002;
        ctx.beginPath();
        for (let x = 0; x < w; x += 4) {
          const y = mid + Math.sin(x * 0.015 + time) * 6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        document.querySelectorAll('.eq-bar').forEach(bar => {
          bar.style.height = '18%';
        });
      }
    }

    drawWave();
  }
}

// === 9. ERLEBNIS-KONTAKTPUNKT: 3-SCHRITTE TRAUUNGS-ASSISTENT ===
function initExperienceContact() {
  const container = document.querySelector('[data-experience-contact]');
  const form = document.getElementById('contactForm');
  if (!container || !form) return;

  const fallback = document.getElementById('formFallback');
  const status = document.getElementById('formStatus');
  const badges = container.querySelectorAll('.step-badge');
  const panels = container.querySelectorAll('.step-panel');

  function goToStep(stepNum) {
    panels.forEach(p => {
      const isTarget = p.id === `stepPanel${stepNum}`;
      p.hidden = !isTarget;
      p.classList.toggle('active', isTarget);
    });
    badges.forEach(b => {
      const isActive = parseInt(b.dataset.step) === stepNum;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const activePanel = container.querySelector(`.step-panel#stepPanel${stepNum}`);
    if (activePanel) {
      const firstInput = activePanel.querySelector('input:not([type="hidden"]), select, textarea, button');
      if (firstInput) firstInput.focus();
    }
  }

  container.querySelectorAll('[data-goto-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.dataset.gotoStep);
      goToStep(targetStep);
    });
  });

  badges.forEach(b => {
    b.addEventListener('click', () => {
      const step = parseInt(b.dataset.step);
      goToStep(step);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitContact');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Terminanfrage wird übermittelt…';
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        if (status) {
          status.textContent = 'Vielen Dank! Ihre Anfrage ist direkt bei Maria & Raphael eingegangen. Wir prüfen den Wunschtermin und melden uns binnen 24 Stunden.';
          status.style.color = 'var(--sc-accent)';
        }
        form.reset();
        goToStep(1);
      } else {
        if (fallback) fallback.style.display = 'block';
        if (btn) { btn.disabled = false; btn.textContent = 'Wunschtermin jetzt anfragen'; }
      }
    } catch {
      if (fallback) fallback.style.display = 'block';
      if (btn) { btn.disabled = false; btn.textContent = 'Wunschtermin jetzt anfragen'; }
    }
  });
}

// === 10. TAGESZEIT-PERSONALISIERUNG ===
function initTimeGreeting() {
  const el = document.querySelector('[data-time-greeting]');
  if (!el) return;
  const h = new Date().getHours();
  let msg;
  if (h >= 6 && h < 12) {
    msg = 'Guten Morgen — Willkommen bei Pentavox Regensburg';
  } else if (h >= 12 && h < 19) {
    msg = 'Guten Tag — Wir schenken Ihrem Anlass einen unvergesslichen Domklang';
  } else {
    msg = 'Guten Abend — Planen Sie Ihre Traumhochzeit für die Saison 2026/2027?';
  }
  el.textContent = msg;
}

// === 11. MOBILE NAVIGATION & ANCHOR SCROLL ===
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('mobileMenuClose');
  if (!hamburger || !menu) return;

  const open = () => {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    menu.removeAttribute('hidden');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  };

  const close = () => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  };

  hamburger.addEventListener('click', () => {
    hamburger.getAttribute('aria-expanded') === 'true' ? close() : open();
  });

  closeBtn && closeBtn.addEventListener('click', close);

  menu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      close();
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          setTimeout(() => {
            if (lenis) {
              lenis.scrollTo(target, { offset: -70, duration: 1.0 });
            } else {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 80);
        }
      }
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
  });
}

// === 12. HEADER SCROLL BEHAVIOR ===
function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 25);
  }, { passive: true });
}

// === 13. MODALS MANAGEMENT ===
function initModals() {
  document.querySelectorAll('[data-modal-open]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.dataset.modalOpen;
      const modal = document.getElementById(modalId);
      if (!modal) return;
      modal.removeAttribute('hidden');
      modal.setAttribute('aria-hidden', 'false');
      if (lenis) lenis.stop();
      const focusable = modal.querySelector('button, [href], input, select, textarea');
      if (focusable) focusable.focus();
    });
  });

  const closeAll = () => {
    document.querySelectorAll('.modal').forEach(m => {
      m.setAttribute('hidden', '');
      m.setAttribute('aria-hidden', 'true');
    });
    if (lenis) lenis.start();
  };

  document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', closeAll);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAll();
  });
}

// === 14. TWO-CLICK MAPS & DSGVO CONSENT ===
function initConsent() {
  const KEY = 'pentavox_consent_v1';
  const banner = document.getElementById('consentBanner');
  const stored = localStorage.getItem(KEY);

  function applyConsent(accepted) {
    if (accepted) {
      document.querySelectorAll('iframe[data-src]').forEach(f => {
        f.src = f.dataset.src;
      });
      const mapPlaceholder = document.getElementById('mapPlaceholder');
      if (mapPlaceholder) mapPlaceholder.style.display = 'none';
    }
    if (banner) banner.hidden = true;
  }

  if (stored === 'accepted') applyConsent(true);
  else if (stored === 'rejected') applyConsent(false);
  else if (banner) banner.hidden = false;

  document.getElementById('consentAccept')?.addEventListener('click', () => {
    localStorage.setItem(KEY, 'accepted');
    applyConsent(true);
  });
  document.getElementById('consentReject')?.addEventListener('click', () => {
    localStorage.setItem(KEY, 'rejected');
    applyConsent(false);
  });
  document.getElementById('btnLoadMapDirect')?.addEventListener('click', () => {
    localStorage.setItem(KEY, 'accepted');
    applyConsent(true);
  });
  document.getElementById('cookieSettingsLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem(KEY);
    if (banner) banner.hidden = false;
  });
}

// === 15. LIVE-ALARM DEMO-TRACKER (NEU v6.2) ===
function initDemoTracker() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.search.includes('preview=true')) return;

  const startTime = Date.now();
  const company = 'Pentavox Regensburg';
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const deviceType = isMobile ? 'Smartphone (Mobil)' : 'Desktop-Computer';
  const referrer = document.referrer ? (document.referrer.includes('whatsapp') ? 'WhatsApp Direktlink' : document.referrer) : 'Direktaufruf';

  let pingSent = false;
  let exitSent = false;
  const clickedActions = new Set();

  document.querySelectorAll('[data-track]').forEach(el => {
    el.addEventListener('click', () => {
      const type = el.getAttribute('data-track');
      if (type === 'whatsapp') clickedActions.add('WhatsApp-Direktchat');
      else if (type === 'telefon') clickedActions.add('Telefonanruf');
      else if (type === 'hoerprobe') clickedActions.add('Hörprobe/Mixer');
      else if (type === 'anfrage') clickedActions.add('Trauungs-Assistent');
    });
  });

  async function sendAlert(stage) {
    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    const durationText = elapsedSeconds < 60 ? `${elapsedSeconds}s` : `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`;

    let statusText = '⚡ Reingeschaut';
    if (elapsedSeconds >= 45 || clickedActions.size > 0) {
      statusText = '🔥 HEISS! Hohes Interesse & Klicks!';
    } else if (elapsedSeconds >= 20) {
      statusText = '👍 WARM! Hat die Seite aufmerksam betrachtet.';
    }

    const clickedList = clickedActions.size > 0 ? Array.from(clickedActions).join(', ') : 'Nur gescrollt';
    const message = `🔔 [NEXBOT LIVE-ALARM] Brautpaar / Musiker prüft Pentavox!\n\n` +
      `🏢 Firma: ${company}\n` +
      `📱 Gerät: ${deviceType}\n` +
      `🔗 Quelle: ${referrer}\n` +
      `⏱️ Verweildauer: ${durationText}\n` +
      `🎯 Klicks: ${clickedList}\n` +
      `📊 Status: ${statusText}`;

    try {
      fetch('https://api.telegram.org/bot8932370815:AAEfF_FRLC12FTFwoa9uRrizlARluM8KYxE/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: '5942652345', text: message }),
        keepalive: true
      }).catch(() => {});
    } catch (_) {}

    try {
      fetch('https://formspree.io/f/xbjnqkyv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ subject: `🔥 [LIVE-ALARM] ${company} (${durationText})`, message: message }),
        keepalive: true
      }).catch(() => {});
    } catch (_) {}
  }

  setTimeout(() => {
    if (!pingSent) {
      pingSent = true;
      sendAlert('initial');
    }
  }, 5000);

  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && !exitSent) {
      exitSent = true;
      sendAlert('exit');
    }
  });
}

// === 16. INIT DOMContentLoaded ===
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initDemoTracker();
  initTimeGreeting();
  initConsent();
  initMobileNav();
  initHeader();
  initModals();
  initExperienceContact();
  initPolyphonyMixer();

  if (!prefersReducedMotion) {
    initKineticTypography();
    init3DTilt();
    initTextScrub();
    initCounters();
    initMagneticButtons();
    initRotatingSeal();
  }
});
