(function () {
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const scriptURL   = 'https://script.google.com/macros/s/AKfycbwphBFlodQ8soQbIW31UbzxVeFQuyCEtOiOrBINRrao603w0QnM1vgEodhtr8jla40zXg/exec';
    const form        = document.forms['contact-form'];
    if (!form) return console.warn('contact-form not found');

    const messageDiv  = document.getElementById('form-message') || addMsg(form);
    // prefer the form's submit control; fallback to #submit for your current markup
    const submitBtn   = form.querySelector('[type="submit"]') || document.getElementById('submit');

    function show(text, ok = true) {
      messageDiv.style.display = 'block';
      messageDiv.style.color   = ok ? '#d9cfb0' : '#ffb3b3';  // subtle gold / soft red
      messageDiv.textContent   = text;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      messageDiv.style.display = 'none';
      if (submitBtn) { submitBtn.disabled = true; setBtnText('Submitting…'); }

      const data = new FormData(form);

      try {
        // Try normal CORS first
        const res = await fetch(scriptURL, { method: 'POST', body: data });

        // Opaque => request sent; treat as success
        if (res.type === 'opaque') return onSuccess();

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (ct.includes('application/json')) {
          const json = await res.json();
          if (json.ok || json.result === 'success') onSuccess();
          else throw new Error(json.error || 'Server error');
        } else {
          // text/html/plain – count any 2xx as success
          onSuccess();
        }
      } catch (err) {
        // Fallback: no-cors (can’t read response, assume success if no network error)
        try {
          await fetch(scriptURL, { method: 'POST', body: data, mode: 'no-cors' });
          onSuccess();
        } catch (err2) {
          console.error('Submit failed:', err2);
          show('Oops! Something went wrong. Please try again.', false);
        }
      } finally {
        if (submitBtn) { submitBtn.disabled = false; setBtnText('Submit'); }
      }
    });

    function onSuccess() {
      show('Thank you! Your query has been submitted successfully.');
      form.reset();
    }

    function setBtnText(txt) {
      // Works for <input type="submit"> or <button type="submit">
      if (!submitBtn) return;
      if ('value' in submitBtn) submitBtn.value = txt;
      else submitBtn.textContent = txt;
    }

    function addMsg(formEl) {
      const div = document.createElement('div');
      div.id = 'form-message';
      div.style.display = 'none';
      div.style.marginTop = '10px';
      div.style.fontSize = '0.95rem';
      div.style.textAlign = 'center';
      formEl.appendChild(div);
      return div;
    }
  }
})();
