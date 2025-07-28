document.addEventListener('DOMContentLoaded', () => {
  console.log('main.js loaded');

  // 0) Toast helper
  function showToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.classList.add('hidden'), 400);
    }, 3000);
  }

  // 1) Smooth-scroll for any link with class "scroll"
  document.querySelectorAll('a.scroll').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 1.1) Track when users choose files
  ['audio-primary', 'audio-secondary'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('change', () => {
        gtag('event', 'file_upload', {
          event_category: 'Form Interaction',
          event_label: id
        });
      });
    }
  });

  // 2) Form reference
  const form = document.querySelector('form[action^="https://formspree"]');
  if (!form) return;

  // -----------------------------
  // 2.1 Persistent-draft helper
  // -----------------------------
  const FORM_STORAGE_KEY = 'msc_draft';

  function saveDraft() {
    const data = {};
    form.querySelectorAll('input, textarea').forEach(el => {
      if (el.type === 'file') return;                 // skip file inputs
      if (el.type === 'checkbox') {
        data[el.id] = el.checked;
      } else {
        data[el.id] = el.value;
      }
    });
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
  }

  function restoreDraft() {
    const raw = sessionStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      Object.entries(data).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.type === 'checkbox') {
          el.checked = val;
        } else {
          el.value = val;
        }
      });
    } catch { /* ignore corrupted JSON */ }
  }

  restoreDraft();                       // repopulate on load
  form.addEventListener('input', saveDraft);
  form.addEventListener('change', saveDraft);

  // 3) Validation + submit handler
  form.addEventListener('submit', e => {
    e.preventDefault();

    // remove old error messages
    form.querySelectorAll('.field-error').forEach(el => el.remove());

    let firstError = null;

    // validate required fields
    form.querySelectorAll('[required]').forEach(el => {
      let hasError = false;

      if (el.type === 'checkbox') {
        if (!el.checked) hasError = true;
      } else if (!el.value.trim()) {
        hasError = true;
      }

      if (hasError) {
        el.classList.add('error');
        if (!firstError) firstError = el;

        // label text
        let labelText;
        if (el.type === 'checkbox') {
          const wrapper = el.closest('label');
          labelText = wrapper ? wrapper.textContent.trim() : 'This field';
        } else {
          labelText = el.previousElementSibling.textContent.trim();
        }
        labelText = labelText.replace(/:$/, '');

        // inline message
        const msg = document.createElement('span');
        msg.className = 'text-sm text-red-600 field-error';
        msg.textContent = `${labelText} is required`;

        if (el.type === 'checkbox') {
          el.closest('.space-y-2').appendChild(msg);
        } else {
          el.after(msg);
        }
      } else {
        el.classList.remove('error');
      }
    });

    if (firstError) {
      firstError.focus();
      return;
    }

    // valid — clear draft, track, toast, then submit
    sessionStorage.removeItem(FORM_STORAGE_KEY);

    gtag('event', 'form_submit', {
      event_category: 'Form Interaction',
      event_label: 'msc-quote'
    });

    showToast();
    setTimeout(() => form.submit(), 800);
  });
});
