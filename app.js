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

// ---------- Reviews ----------
let chosenRating = 5;
const starInput = document.getElementById('star-input');
function paintStars(n){ starInput.querySelectorAll('span').forEach(s => s.classList.toggle('lit', +s.dataset.v <= n)); }
starInput.querySelectorAll('span').forEach(s => s.addEventListener('click', () => { chosenRating = +s.dataset.v; paintStars(chosenRating); }));
paintStars(5);

function starStr(n){ return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); }

async function loadReviews(){
  const list = document.getElementById('reviews-list');
  if (!BACKEND_URL) { list.innerHTML = '<p class="muted">Reviews load once the backend is connected.</p>'; return; }
  try {
    const res = await fetch(BACKEND_URL + '/api/reviews');
    const reviews = await res.json();
    if (!reviews.length) { list.innerHTML = '<p class="muted">No reviews yet — be the first!</p>'; }
    else {
      list.innerHTML = reviews.map(r =>
        '<div class="card review-card"><div class="stars">' + starStr(r.rating) + '</div><p>' +
        r.comment.replace(/</g,'&lt;') + '</p><div class="r-name">' + r.name.replace(/</g,'&lt;') +
        '</div><div class="r-date">' + new Date(r.createdAt).toLocaleDateString() + '</div></div>'
      ).join('');
    }
    const avg = reviews.reduce((a,r)=>a+r.rating,0) / (reviews.length || 1);
    document.getElementById('avg-rating').textContent = reviews.length ? avg.toFixed(1) : '–';
    document.getElementById('avg-stars').textContent = reviews.length ? starStr(Math.round(avg)) : '';
    document.getElementById('rating-count').textContent = reviews.length ? 'based on ' + reviews.length + ' review' + (reviews.length>1?'s':'') : '';
  } catch(e){ list.innerHTML = '<p class="muted">Could not load reviews.</p>'; }
}
loadReviews();

document.getElementById('review-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = document.getElementById('review-status');
  const form = e.target;
  if (!BACKEND_URL) {
    status.className = 'form-status err';
    status.textContent = 'Reviews backend is not connected yet.';
    return;
  }
  status.className = 'form-status'; status.textContent = 'Submitting...';
  try {
    const res = await fetch(BACKEND_URL + '/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name.value.trim(), rating: chosenRating, comment: form.comment.value.trim() })
    });
    const out = await res.json();
    if (res.ok) {
      status.className = 'form-status ok'; status.textContent = 'Thanks for your review! ✓';
      form.reset(); chosenRating = 5; paintStars(5); loadReviews();
    } else { status.className = 'form-status err'; status.textContent = out.error || 'Something went wrong.'; }
  } catch(e){ status.className = 'form-status err'; status.textContent = 'Could not reach the server.'; }
});
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
