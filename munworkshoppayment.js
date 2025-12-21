

(function () {
  console.log('SCRIPT STARTED: munworkshoppayment.js');
  const RZP_KEY_ID = 'rzp_live_RevIomkBaPi91z';

  // Helpers
  function ui(state, text) {
    const btn = document.getElementById('pay-now-submit-button');
    const msg = document.getElementById('form-message');
    if (msg) {
      if (text) { msg.textContent = text; msg.style.display = 'block'; }
      else { msg.textContent = ''; msg.style.display = 'none'; }
    } else if (text) {
      console.log('UI:', text);
    }
    if (btn) btn.disabled = (state === 'busy');
    if (btn) btn.textContent = (state === 'busy') ? 'Please wait…' : 'Pay Now';
  }

  function withTimeout(promise, ms = 15000) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`Timeout after ${ms / 1000}s`)), ms);
      promise.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
    });
  }

  async function pingServer(url) {
    const fd = new FormData();
    fd.append('action', 'ping');
    const r = await withTimeout(fetch(url + '?t=' + Date.now(), { method: 'POST', body: fd, cache: 'no-store', redirect: 'follow' }), 8000);
    const t = await r.text();
    let j;
    try { j = JSON.parse(t); } catch { throw new Error('Ping returned non-JSON'); }
    if (j.result !== 'ok') throw new Error('Ping failed');
    return j;
  }

  async function createOrder(form, url) {
    const fd = new FormData(form);
    fd.append('action', 'createOrder');

    // Amount fallback
    const amountPaise = (fd.get('total_paise') || fd.get('amount') || '50900');
    fd.append('amount', String(amountPaise));
    fd.append('currency', 'INR');
    fd.append('receipt', 'mun-' + Date.now());

    // Terms & Event Name
    const eventName = fd.get('event_name');
    if (eventName) fd.append('notes[event_name]', eventName);

    if (form.querySelector('input[name="agree-terms"]')) {
      const t = form.querySelector('input[name="agree-terms"]').checked ? 'Yes' : 'No';
      fd.append('notes[agree-terms]', t);
    }

    try {
      const r = await withTimeout(fetch(url + '?t=' + Date.now(), { method: 'POST', body: fd, cache: 'no-store', redirect: 'follow' }), 12000);
      const j = await r.json();
      console.log('Server Response:', j);
      if (j.result !== 'success') throw new Error(j.error || 'Order creation failed');
      if (!j.order) throw new Error('Server returned success but missing order ID');
      return j.order;
      if (!j.order) throw new Error('Server returned success but missing order ID');
      return j.order;
    } catch (err) {
      console.warn('Backend unavailable/failed, using client-side fallback:', err);
      // Fallback: Return object ensuring openCheckout can still proceed (Direct mode)
      return { id: null, amount: Number(amountPaise), currency: 'INR' };
    }
  }

  function openCheckout(order, form, url) {
    if (typeof Razorpay === 'undefined') {
      ui('idle', 'Razorpay SDK not loaded.');
      return;
    }

    const fd = new FormData(form);
    const options = {
      key: RZP_KEY_ID,
      ...(order.id && { order_id: order.id }),
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
      handler: async function (resp) {
        ui('busy', 'Verifying payment…');
        try {
          const post = new FormData();
          post.append('action', 'verifyAndRegister');
          post.append('razorpay_payment_id', resp.razorpay_payment_id);
          post.append('razorpay_order_id', resp.razorpay_order_id);
          post.append('razorpay_signature', resp.razorpay_signature);
          for (const [k, v] of fd.entries()) post.append(k, v);

          const r = await withTimeout(fetch(url + '?t=' + Date.now(), { method: 'POST', body: post, cache: 'no-store', redirect: 'follow' }), 12000);
          const j = await r.json();
          if (j.result !== 'success') throw new Error(j.error || 'Verification failed');

          ui('idle', 'Thank you! Your registration was successful.');
          setTimeout(() => window.location.reload(), 2500);
        } catch (err) {
          console.error('Verify error:', err);
          ui('idle', 'Payment verification failed. Please contact support.');
        }
      },
      modal: {
        ondismiss: function () { ui('idle', 'Payment cancelled.'); }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function (response) {
      ui('idle', 'Payment failed: ' + (response.error.description || 'Unknown error'));
    });
    rzp.open();
  }

  async function handlePayClick(e) {
    e.preventDefault();

    // Re-query elements at runtime to ensure they exist
    const form = document.getElementById('contact-form');
    // const btn = document.getElementById('pay-now-submit-button'); // handled in ui()

    if (!form) {
      console.error('Form #contact-form not found during click.');
      return;
    }

    // Validate
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Terms check
    const terms = form.querySelector('input[name="agree-terms"]');
    if (terms && !terms.checked) {
      ui('idle', 'Please accept the Terms & Conditions.');
      return;
    }

    const WEBAPP_URL = form.getAttribute('action');
    if (!WEBAPP_URL) {
      ui('idle', 'Error: Form action URL is missing.');
      return;
    }

    ui('busy', 'Connecting...');

    try {
      // await pingServer(WEBAPP_URL); // Removed blocking ping
      ui('busy', 'Creating order...');
      const order = await createOrder(form, WEBAPP_URL);
      openCheckout(order, form, WEBAPP_URL);
    } catch (err) {
      console.error(err);
      ui('idle', 'Error: ' + err.message);
    }
  }

  // Initialization: Wait for DOM, then attach listener
  function init() {
    const btn = document.getElementById('pay-now-submit-button');
    if (btn) {
      console.log('Payment script attached to button.');
      btn.addEventListener('click', handlePayClick);
    } else {
      console.warn('Payment script: Button #pay-now-submit-button not found. Retrying in 1s...');
      setTimeout(init, 1000); // Retry once if defer/async issues
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
