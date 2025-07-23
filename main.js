// main.js

document.addEventListener('DOMContentLoaded', () => {

  // 1) Smooth-scroll for “Start Your Review”
  document.querySelectorAll('a.scroll').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 2) Inline-error messages on empty required fields
  const form = document.querySelector('form[action^="https://formspree"]');
  if (!form) return;

  form.addEventListener('submit', e => {
    // remove old messages
    form.querySelectorAll('.field-error').forEach(el => el.remove());

    let firstError = null;

    form.querySelectorAll('[required]').forEach(el => {
      if (!el.value.trim()) {
        el.classList.add('error');
        if (!firstError) firstError = el;

        // inject inline message
        const msg = document.createElement('span');
        msg.textContent = el.previousElementSibling.textContent.replace(':','') + ' is required';
        msg.className = 'text-sm text-red-600 field-error';
        el.after(msg);
      } else {
        el.classList.remove('error');
      }
    });

    if (firstError) {
      e.preventDefault();
      firstError.focus();
    }
  });

});
