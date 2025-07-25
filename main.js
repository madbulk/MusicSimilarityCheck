document.addEventListener('DOMContentLoaded', () => {
  console.log('main.js loaded');

  // 0) Toast helper
  function showToast() {
    const toast = document.getElementById('toast');
    console.log('showToast() → toast element:', toast);
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
      console.log('scroll link clicked:', link);
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      console.log('  → scrolling to:', target);
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

  // 2) Inline errors on empty required fields, including checkbox
  const form = document.querySelector('form[action^="https://formspree"]');
  console.log('form element →', form);
  if (!form) return;

  form.setAttribute('novalidate', '');

  form.addEventListener('submit', e => {
    console.log('Submit handler triggered');
    e.preventDefault();

    // remove old error messages
    form.querySelectorAll('.field-error').forEach(el => el.remove());

    let firstError = null;

    // validate each required field or checkbox
    form.querySelectorAll('[required]').forEach(el => {
      let hasError = false;

      if (el.type === 'checkbox') {
        if (!el.checked) hasError = true;
      } else if (!el.value.trim()) {
        hasError = true;
      }

      if (hasError) {
        console.log('    → validation error on', el);
        el.classList.add('error');
        if (!firstError) firstError = el;

        // determine label text
        let labelText;
        if (el.type === 'checkbox') {
          const wrapper = el.closest('label');
          labelText = wrapper ? wrapper.textContent.trim() : 'This field';
        } else {
          labelText = el.previousElementSibling.textContent.trim();
        }
        labelText = labelText.replace(/:$/, '');

        // inject inline message
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
      console.log('  firstError found, focusing:', firstError);
      firstError.focus();
      return;
    }

    // 3) On successful validation: track, then show toast
    console.log('No validation errors—tracking & showing toast now');
    gtag('event', 'form_submit', {
      event_category: 'Form Interaction',
      event_label: 'msc-quote'
    });

    showToast();
    // allow the browser to perform the normal POST+redirect
    setTimeout(() => form.submit(), 800);
  });
});
