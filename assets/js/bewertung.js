'use strict';

/**
 * Baustein B: WhatsApp Feedback-Generator für „five elements“
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reviewHelperForm');
  const statusBox = document.getElementById('reviewStatusBox');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('customerName')?.value.trim();
    const rawPhone = document.getElementById('customerPhone')?.value.trim() || '';
    const customUrl = document.getElementById('reviewLinkInput')?.value.trim();

    if (!name || !rawPhone) {
      if (statusBox) {
        statusBox.hidden = false;
        statusBox.textContent = 'Bitte Namen und Handynummer eintragen.';
      }
      return;
    }

    let phone = rawPhone.replace(/[^\d+]/g, '');
    if (phone.startsWith('00')) phone = phone.slice(2);
    else if (phone.startsWith('+')) phone = phone.slice(1);
    else if (phone.startsWith('0')) phone = '49' + phone.slice(1);

    const targetUrl = customUrl || 'https://fiveelements.vercel.app/';
    const msg = `Hallo ${name}, danke noch einmal für euren tollen Moment mit uns! Falls ihr Lust habt, freuen wir uns riesig über ein kurzes Feedback für five elements: ${targetUrl} – Viele Grüße, eure fünf Stimmen`;
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

    if (statusBox) {
      statusBox.hidden = false;
      statusBox.innerHTML = `Link erstellt für <strong>+${phone}</strong>. <a href="${waUrl}" target="_blank" rel="noopener noreferrer">Hier manuell öffnen</a>, falls sich WhatsApp nicht automatisch öffnet.`;
    }
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });
});
