// Backend API base URL — set after deploying the backend (e.g. on Render).
// Leave empty to run frontend-only (contact form will show a notice).
const BACKEND_URL = "https://portfolio-nu8s.onrender.com"; // e.g. "https://usman-portfolio-api.onrender.com"

// ---------- Urdu / English toggle ----------
const I18N = {
en: {nav_about:"About",nav_skills:"Skills",nav_exp:"Experience",nav_projects:"Projects",nav_videos:"Videos",nav_research:"Research",nav_reviews:"Reviews",nav_hire:"Hire Me",
kicker:"AI ENGINEER & CREATOR",tagline:"BS Artificial Intelligence · Generative AI Practitioner · Published Researcher",
stat_papers:"Research Papers",stat_dois:"DOIs",stat_certs:"Certifications",stat_repos:"GitHub Repos",
cta_touch:"Get In Touch",cta_research:"View Research",cta_cv:"Download CV",
h_about:"About",about_lead:"BS Artificial Intelligence student at Superior University Lahore (CGPA 3.3) with 1.5 years of hands-on generative AI practice: AI video advertisement production, prompt engineering, and Urdu/English text-to-speech voiceover pipelines. Published 4 research papers with 8 DOIs (Zenodo & Figshare), archived on the Internet Archive, with reproducible code on GitHub. Shipped a WordPress business website for a Lahore client and produced AI video ads used as commercial portfolio pieces. Marketing Lead (SE), IEEE Computer Society.",
info_phone:"Phone",info_loc:"Location",info_edu:"Education",
h_skills:"Technical Skills",sk1t:"AI Expertise",sk2t:"Development",sk3t:"Content & Design",
h_exp:"Experience",ex1t:"Generative AI Practitioner",ex1d:"Produced AI video advertisements with consistent character rendering and Urdu/English voiceovers. Built and delivered Digital Growth Hub, a 7-page WordPress business website for a Lahore client. Created a multi-part Lahore vlog series with English narration and Urdu subtitles.",
h_projects:"Featured Projects",h_videos:"Video Showcase",videos_lead:"AI-generated video advertisements and portfolio showreels — produced end-to-end with generative AI pipelines.",
h_pubs:"Publications",h_edu:"Education & Certifications",
h_reviews:"Reviews",reviews_lead:"What clients and collaborators say about working with me.",review_form:"Leave a review",btn_review:"Submit Review",
h_contact:"Get In Touch",contact_lead:"Have a project, a role, or a research collaboration in mind? Send a message — it lands straight in my inbox dashboard.",btn_send:"Send Message",
ph_name:"Your name",ph_email:"Your email",ph_subject:"Subject",ph_review:"Your review...",ph_message:"Your message..."},
ur: {nav_about:"میرے بارے میں",nav_skills:"مہارتیں",nav_exp:"تجربہ",nav_projects:"پراجیکٹس",nav_videos:"ویڈیوز",nav_research:"تحقیق",nav_reviews:"تبصرے",nav_hire:"رابطہ کریں",
kicker:"اے آئی انجینئر اور کریئیٹر",tagline:"بی ایس آرٹیفیشل انٹیلیجنس · جنریٹو اے آئی پریکٹیشنر · شائع شدہ محقق",
stat_papers:"تحقیقی مقالات",stat_dois:"ڈی او آئی",stat_certs:"سرٹیفیکیشنز",stat_repos:"گٹ ہب ریپوز",
cta_touch:"رابطہ کریں",cta_research:"تحقیق دیکھیں",cta_cv:"سی وی ڈاؤن لوڈ کریں",
h_about:"میرے بارے میں",about_lead:"سپیریئر یونیورسٹی لاہور میں بی ایس آرٹیفیشل انٹیلیجنس کا طالب علم (سی جی پی اے 3.3) — ڈیڑھ سال کا جنریٹو اے آئی کا عملی تجربہ: اے آئی ویڈیو اشتہارات، پرامپٹ انجینئرنگ، اور اردو/انگریزی ٹیکسٹ ٹو اسپیچ پائپ لائنز۔ 4 تحقیقی مقالات 8 ڈی او آئی کے ساتھ شائع (زینوڈو اور فگ شیئر)، انٹرنیٹ آرکائیو پر محفوظ، اور گٹ ہب پر قابلِ تکرار کوڈ۔ لاہور کے کلائنٹ کے لیے 7 صفحات کی ورڈپریس ویب سائٹ بنائی اور کمرشل پورٹ فولیو کے لیے اے آئی ویڈیو اشتہارات تیار کیے۔ مارکیٹنگ لیڈ (ایس ای)، آئی ٹرپل ای کمپیوٹر سوسائٹی۔",
info_phone:"فون",info_loc:"مقام",info_edu:"تعلیم",
h_skills:"تکنیکی مہارتیں",sk1t:"اے آئی مہارت",sk2t:"ڈیویلپمنٹ",sk3t:"کنٹینٹ اور ڈیزائن",
h_exp:"تجربہ",ex1t:"جنریٹو اے آئی پریکٹیشنر",ex1d:"مستقل کریکٹر رینڈرنگ اور اردو/انگریزی وائس اوورز کے ساتھ اے آئی ویڈیو اشتہارات بنائے۔ لاہور کے کلائنٹ کے لیے ڈیجیٹل گروتھ ہب — 7 صفحات کی ورڈپریس بزنس ویب سائٹ بنائی اور ڈیلیور کی۔ انگریزی نیریشن اور اردو سب ٹائٹلز کے ساتھ لاہور ولاگ سیریز بنائی۔",
h_projects:"نمایاں پراجیکٹس",h_videos:"ویڈیو شوکیس",videos_lead:"اے آئی سے تیار کردہ ویڈیو اشتہارات اور پورٹ فولیو شو ریلز — مکمل جنریٹو اے آئی پائپ لائنز سے تیار شدہ۔",
h_pubs:"اشاعتیں",h_edu:"تعلیم اور سرٹیفیکیشنز",
h_reviews:"تبصرے",reviews_lead:"کلائنٹس اور ساتھی میرے ساتھ کام کے بارے میں کیا کہتے ہیں۔",review_form:"اپنا تبصرہ لکھیں",btn_review:"تبصرہ بھیجیں",
h_contact:"رابطہ کریں",contact_lead:"کوئی پراجیکٹ، نوکری، یا تحقیقی تعاون ذہن میں ہے؟ پیغام بھیجیں — یہ سیدھا میرے ان باکس میں آئے گا۔",btn_send:"پیغام بھیجیں",
ph_name:"آپ کا نام",ph_email:"آپ کا ای میل",ph_subject:"موضوع",ph_review:"آپ کا تبصرہ...",ph_message:"آپ کا پیغام..."}};

let lang = localStorage.getItem('uk-lang') || 'en';
function applyLang(l){
  lang = l; localStorage.setItem('uk-lang', l);
  document.documentElement.lang = l; document.documentElement.dir = l === 'ur' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (I18N[l][k]) el.innerHTML = I18N[l][k]; });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { const k = el.dataset.i18nPh; if (I18N[l][k]) el.placeholder = I18N[l][k]; });
  document.getElementById('lang-toggle').textContent = l === 'ur' ? 'EN' : 'اردو';
}
document.getElementById('lang-toggle').addEventListener('click', () => applyLang(lang === 'ur' ? 'en' : 'ur'));
applyLang(lang);
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
  const fd = new FormData(form);
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
      body: JSON.stringify({ name: String(fd.get('name') || '').trim(), rating: chosenRating, comment: String(fd.get('comment') || '').trim() })
    });
    const out = await res.json();
    if (res.ok) {
      status.className = 'form-status ok'; status.textContent = 'Thanks for your review! ✓';
      form.reset(); chosenRating = 5; paintStars(5); loadReviews();    } else { status.className = 'form-status err'; status.textContent = out.error || 'Something went wrong.'; }
  } catch(e){ status.className = 'form-status err'; status.textContent = 'Could not reach the server.'; }
});
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = document.getElementById('form-status');
  const form = e.target;
  const fd = new FormData(form);
  const data = {
    name: String(fd.get('name') || '').trim(),
    email: String(fd.get('email') || '').trim(),
    subject: String(fd.get('subject') || '').trim(),
    message: String(fd.get('message') || '').trim()
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
