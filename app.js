// Backend API base URL — set after deploying the backend (e.g. on Render).
// Leave empty to run frontend-only (contact form will show a notice).
const BACKEND_URL = "https://portfolio-nu8s.onrender.com"; // e.g. "https://usman-portfolio-api.onrender.com"


// Count-up animation for hero stats
document.querySelectorAll('[data-count]').forEach(el => {
  const target = +el.dataset.count;
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = cur;
  }, 40);
});


// Contact form → backend API
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = document.getElementById('form-status');
  const form = e.target;
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim()
  };
  if (!BACKEND_URL) {
    status.className = 'form-status err';
    status.textContent = 'Contact backend is not connected yet — email me directly at su92-bsaim-f25-025@superior.edu.pk';
    return;
  }
  status.className = 'form-status';
  status.textContent = 'Sending...';
  try {
    const res = await fetch(BACKEND_URL + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const out = await res.json();
    if (res.ok) {
      status.className = 'form-status ok';
      status.textContent = 'Message sent! I will get back to you soon. ✓';
      form.reset();
    } else {
      status.className = 'form-status err';
      status.textContent = out.error || 'Something went wrong. Please email me directly.';
    }
  } catch (err) {
    status.className = 'form-status err';
    status.textContent = 'Could not reach the server. Please email me directly.';
  }
});
