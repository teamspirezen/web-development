
(function(){
  /** CONFIG **/
  const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxDV1-nRLg4_N8gTLkk4tGvHUtzcGcDgsjvDthbsZ6Xhmbug9oM2ppYwAiPG9kwW3P4uA/exec';
  const RZP_KEY_ID = 'rzp_live_RevIomkBaPi91z';

  /** ELEMENTS **/
  const form = document.getElementById('contact-form');
  const btn  = document.getElementById('pay-now-submit-button');
  const msg  = document.getElementById('form-message');

  function ui(state, text) {
    if (msg) {
      if (text) { msg.textContent = text; msg.style.display = 'block'; }
      else { msg.textContent = ''; msg.style.display = 'none'; }
    } else {
      if (text) console.log('UI:', text);
    }
    if (btn) btn.disabled = (state === 'busy');
    if (btn) btn.textContent = (state === 'busy') ? 'Please wait…' : 'Pay Now';
  }

  function withTimeout(promise, ms = 15000) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`Timeout after ${ms/1000}s`)), ms);
      promise.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
    });
  }

  /** Basic sanity checks */
  function sanityChecks() {
    const errors = [];
    if (!form) errors.push('Form element #contact-form not found.');
    if (!btn)  errors.push('Button element #pay-now-submit-button not found.');
    if (typeof Razorpay === 'undefined') errors.push('Razorpay SDK not loaded. Add <script src="https://checkout.razorpay.com/v1/checkout.js"></script>');
    // quick Apps Script ping check omitted here, use pingServer() later.
    return errors;
  }

  async function pingServer() {
    try {
      const fd = new FormData();
      fd.append('action','ping');
      const r = await withTimeout(fetch(WEBAPP_URL + '?t=' + Date.now(), { method:'POST', body:fd, cache:'no-store' }), 8000);
      const t = await r.text();
      let j;
      try { j = JSON.parse(t); } catch { throw new Error('Ping returned non-JSON: '+t.slice(0,200)); }
      if (j.result !== 'ok') throw new Error('Ping failed: ' + JSON.stringify(j).slice(0,200));
      return j;
    } catch (err) {
      throw new Error('Ping error: ' + (err && err.message ? err.message : err));
    }
  }

  /** Create order (uses mock mode if backend unreachable) */
  async function createOrder(payloadNotes = {}) {
    try {
      const fd = new FormData(form);
      fd.append('action','createOrder');

      // amount: check if you stored a total_paise or amount field in form; fallback to 50900
      const amountPaise = (fd.get('total_paise') || fd.get('amount') || '50900'); // default to 50900 paise
      fd.append('amount', String(amountPaise));
      fd.append('currency','INR');
      fd.append('receipt','mun-'+Date.now());

      // include notes that matter
      const noteKeys = ['your-name','your-email','your-number','your-city','your-school','session-date'];
      noteKeys.forEach(k => fd.append('notes['+k+']', fd.get(k) || payloadNotes[k] || ''));

      // include terms explicitly if present
      if (form.querySelector('input[name="agree-terms"]')) {
        const t = form.querySelector('input[name="agree-terms"]').checked ? 'Yes' : 'No';
        fd.append('notes[agree-terms]', t);
      }

      // attempt backend call
      const r = await withTimeout(fetch(WEBAPP_URL + '?t=' + Date.now(), { method:'POST', body:fd, cache:'no-store' }), 12000);
      const t = await r.text();
      let j;
      try { j = JSON.parse(t); } catch { throw new Error('createOrder: server returned non-JSON. First 200 chars: '+t.slice(0,200)); }
      if (j.result !== 'success') throw new Error('createOrder failed: ' + (j.error || JSON.stringify(j)));
      if (!j.order || !j.order.id) throw new Error('createOrder: response missing order.id');
      return j.order;
    } catch (err) {
      console.warn('createOrder failed, switching to mock order. Error:', err.message || err);
      // return a mock order so checkout can be tested without server
      return { id: 'order_mock_' + Date.now(), amount: Number(fd && fd.get ? fd.get('amount') : 50900), currency: 'INR' };
    }
  }

  /** Open Razorpay checkout with stronger error handling */
  function openCheckout(order) {
    try {
      if (typeof Razorpay === 'undefined') throw new Error('Razorpay SDK not loaded.');

      const fd = new FormData(form);
      const options = {
        key: RZP_KEY_ID,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: 'Spirezen Enterprises Pvt Ltd',
        description: 'Payment for Munterra Workshop',
        image: 'https://www.spirezenenterprises.com/logo.png',
        prefill: {
          name: fd.get('your-name') || '',
          email: fd.get('your-email') || '',
          contact: fd.get('your-number') || ''
        },
        theme: { color: '#1d1d1d5b' },
        handler: async function(resp) {
          ui('busy','Verifying payment…');
          try {
            const post = new FormData();
            post.append('action','verifyAndRegister');
            post.append('razorpay_payment_id', resp.razorpay_payment_id);
            post.append('razorpay_order_id',   resp.razorpay_order_id);
            post.append('razorpay_signature',  resp.razorpay_signature);
            for (const [k,v] of fd.entries()) post.append(k, v);

            const r = await withTimeout(fetch(WEBAPP_URL + '?t=' + Date.now(), { method:'POST', body:post, cache:'no-store' }), 12000);
            const t = await r.text();
            const j = JSON.parse(t);
            if (j.result !== 'success') throw new Error(j.error || 'Verification failed');
            ui('idle','Thank you! Your registration was successful.');
            setTimeout(()=>window.location.reload(), 2500);
          } catch (err) {
            console.error('verify failed:', err);
            ui('idle','Payment verification failed on server. Contact support.');
          }
        },
        modal: {
          ondismiss: function() { ui('idle','Payment was not completed.'); }
        }
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', function(resp) {
        const e = resp.error || {};
        console.error('Razorpay payment.failed', e);
        alert('Payment failed: ' + (e.description || e.reason || 'Unknown error'));
        ui('idle','Payment failed. Please try again.');
      });

      rzp.open();
    } catch (err) {
      console.error('openCheckout error:', err);
      ui('idle','Could not open payment window: ' + (err.message || err));
    }
  }

  /** Click handler */
  async function onPayClick(evt) {
    evt.preventDefault();

    const errors = sanityChecks();
    if (errors.length) {
      ui('idle', errors.join(' '));
      console.error('Sanity errors:', errors);
      return;
    }

    // Terms check (if present)
    const terms = form.querySelector('input[name="agree-terms"]');
    if (terms && !terms.checked) {
      ui('idle','Please accept the Terms & Conditions to proceed.');
      terms.focus();
      return;
    }

    ui('busy','Connecting to server…');

    try {
      const ping = await pingServer(); // throws on failure
      console.log('Ping response:', ping);

      ui('busy','Creating your order…');
      const order = await createOrder();
      console.log('Order created:', order);

      openCheckout(order);
    } catch (err) {
      console.error('Payment flow error:', err);
      ui('idle','Could not create order: ' + (err && err.message ? err.message : err));
    }
  }

  // attach after DOM ready
  if (!form || !btn) {
    // attempt to attach once DOM content loaded
    document.addEventListener('DOMContentLoaded', function(){
      const f = document.getElementById('contact-form');
      const b = document.getElementById('pay-now-submit-button');
      if (f && b) b.addEventListener('click', onPayClick);
    });
  } else {
    btn.addEventListener('click', onPayClick);
  }

  // helpful console hint
  console.log('Munterra payment script initialized. Button:', !!btn, 'Form:', !!form, 'Razorpay:', typeof Razorpay !== 'undefined');
})();
