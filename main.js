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

  // 2) Inline errors on empty required fields
  const form = document.querySelector('form[action^="https://formspree"]');
  console.log('form element →', form);
  if (!form) return;

  form.addEventListener('submit', e => {
    console.log('Submit handler triggered');
    // remove old error messages
    form.querySelectorAll('.field-error').forEach(el => el.remove());

    let firstError = null;

    // validate each required field
    form.querySelectorAll('[required]').forEach(el => {
      console.log('  checking required field:', el);
      if (!el.value.trim()) {
        console.log('    → empty! marking error on', el);
        el.classList.add('error');
        if (!firstError) firstError = el;

        // inject inline message
        const msg = document.createElement('span');
        msg.className = 'text-sm text-red-600 field-error';
        msg.textContent = `${el.previousElementSibling.textContent.replace(':','')} is required`;
        el.after(msg);
      } else {
        el.classList.remove('error');
      }
    });

    if (firstError) {
      console.log('  firstError found, preventing submit and focusing:', firstError);
      e.preventDefault();
      firstError.focus();
      return;
    }

    // 3) On successful validation, show toast
    console.log('No validation errors—showing toast now');
    showToast();
    // then let the browser perform the normal POST+redirect
  });
});
