/* =========================================================
   SCHEDULE A CALL — Calendly embed
   ---------------------------------------------------------
   1. Create a free account at https://calendly.com
   2. Set up an event type (e.g. "30 Min Call") and connect
      your Google/Outlook calendar so real availability shows.
   3. Copy your scheduling link (e.g. https://calendly.com/your-name/30min)
   4. Paste it below, replacing CALENDLY_URL.
   That's it — this file auto-detects the change and swaps the
   placeholder for the live embedded calendar.
========================================================= */
const CALENDLY_URL = 'https://calendly.com/cody-davis5614/30min';

(function scheduleWidget() {
  const mount = document.getElementById('scheduleWidget');
  if (!mount) return;

  const isConfigured = CALENDLY_URL && !CALENDLY_URL.includes('YOUR-USERNAME');

  if (!isConfigured) {
    mount.innerHTML = `
      <div class="schedule-placeholder">
        <div class="sp-icon">📅</div>
        <h3>Calendar not connected yet</h3>
        <p>
          This slot is wired up and ready — it just needs a real Calendly link.
          Create a free account, connect your Google/Outlook calendar, then
          drop your scheduling link into <code>js/schedule.js</code>
          (<code>CALENDLY_URL</code> at the top of the file).
        </p>
        <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" class="btn btn-primary" data-cursor-hover>
          <span>Set Up Calendly →</span>
        </a>
      </div>`;
    return;
  }

  mount.innerHTML = `<div class="schedule-loading">Loading calendar…</div>`;

  const params = new URLSearchParams({
    background_color: '05050a',
    text_color: 'e7f6ff',
    primary_color: '00f6ff',
    hide_gdpr_banner: '1',
  });
  const separator = CALENDLY_URL.includes('?') ? '&' : '?';
  const fullUrl = `${CALENDLY_URL}${separator}${params.toString()}`;

  const script = document.createElement('script');
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  script.async = true;

  script.onload = () => {
    mount.innerHTML = '';
    const widget = document.createElement('div');
    widget.className = 'calendly-inline-widget';
    widget.setAttribute('data-url', fullUrl);
    widget.style.minWidth = '280px';
    widget.style.height = '680px';
    mount.appendChild(widget);
    if (window.Calendly) {
      window.Calendly.initInlineWidget({ url: fullUrl, parentElement: widget });
    }
  };

  script.onerror = () => {
    mount.innerHTML = `
      <div class="schedule-placeholder">
        <div class="sp-icon">⚠</div>
        <h3>Calendar failed to load</h3>
        <p>Couldn't reach Calendly — check your connection, or book directly:</p>
        <a href="${CALENDLY_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" data-cursor-hover>
          <span>Open Scheduling Page →</span>
        </a>
      </div>`;
  };

  document.body.appendChild(script);
})();
