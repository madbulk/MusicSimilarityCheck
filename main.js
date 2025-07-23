document.addEventListener('DOMContentLoaded', () => {

  // 1) Smooth-scroll for any link with class "scroll"
  document.querySelectorAll('a.scroll').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 2) Inline errors on empty required fields
  const form = document.querySelector('form[action^="https://formspree"]');
  if (!form) return;

  form.addEventListener('submit', e => {
    // Remove old error messages
    form.querySelectorAll('.field-error').forEach(el => el.remove());

    let firstError = null;

    // Check each required field
    form.querySelectorAll('[required]').forEach(el => {
      if (!el.value.trim()) {
        el.classList.add('error');
        if (!firstError) firstError = el;

        // Inject inline message
        const msg = document.createElement('span');
        msg.className = 'text-sm text-red-600 field-error';
        msg.textContent = `${el.previousElementSibling.textContent.replace(':','')} is required`;
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
