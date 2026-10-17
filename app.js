// Backend API base URL — set after deploying the backend (e.g. on Render).
// Leave empty to run frontend-only (contact form will show a notice).
const BACKEND_URL = "https://portfolio-nu8s.onrender.com"; // e.g. "https://usman-portfolio-api.onrender.com"
const BOOKING_URL = ""; // Cal.com booking link — filled after account setup

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
nav_blog:"Blog",nav_services:"Services",nav_faq:"FAQ",h_blog:"Blog & Articles",blog_lead:"My published articles on history, AI research and digital marketing.",
h_faq:"FAQ",
fq1:"What services do you offer?",fa1:"AI video advertisements and reels, Urdu/English TTS voiceovers, web prototyping, and WordPress business websites.",
fq2:"How much do you charge?",fa2:"Video projects start at $5 — see the Services & Pricing section. Custom quotes for bigger work.",
fq3:"How do we start a project?",fa3:"Send a message through the contact form or tap the WhatsApp button — I usually reply within a day.",
fq4:"Do you work with Pakistani clients?",fa4:"Yes — most of my video-ad work is for Pakistani small businesses selling on WhatsApp and social media.",
fq5:"Are you open to research collaboration?",fa5:"Absolutely. My publications are open-access — reach out if you want to build on them.",
fq6:"What is your typical delivery time?",fa6:"2–5 days for standard video projects; faster on the Premium package.",
h_book:"Book a Meeting",book_lead:"Pick a time that suits you — let's discuss your project face to face.",book_btn:"Open Calendar",
h_services:"Services & Pricing",services_lead:"AI video ads and reels — order directly or via Fiverr.",order_now:"Order Now",visitors:"visitors",verified_label:"Verified on",whatsapp_chat:"Chat on WhatsApp",vcard_dl:"Save My Contact (vCard)",avail_badge:"Available for freelance projects",h_process:"How It Works",process_lead:"A simple 3-step process — no confusion, no delays.",step1t:"Contact",step1d:"Tell me about your project — WhatsApp, live chat, or the form below.",step2t:"Discuss & Plan",step2d:"We agree on scope, timeline, and price before work starts.",step3t:"Deliver",step3d:"You get the finished work, with revisions included.",skip:"Skip to content",last_upd:"Last updated",
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
nav_blog:"بلاگ",nav_services:"سروسز",nav_faq:"سوالات",h_blog:"بلاگ اور مضامین",blog_lead:"تاریخ، اے آئی تحقیق اور ڈیجیٹل مارکیٹنگ پر میرے شائع شدہ مضامین۔",
h_faq:"اکثر پوچھے گئے سوالات",
fq1:"آپ کون سی سروسز دیتے ہیں؟",fa1:"اے آئی ویڈیو اشتہارات اور ریلز، اردو/انگریزی ٹی ٹی ایس وائس اوورز، ویب پروٹوٹائپنگ، اور ورڈپریس بزنس ویب سائٹس۔",
fq2:"آپ کی فیس کیا ہے؟",fa2:"ویڈیو پراجیکٹس $5 سے شروع — سروسز اور قیمتیں والا سیکشن دیکھیں۔ بڑے کام کے لیے کسٹم کوٹ۔",
fq3:"پراجیکٹ کیسے شروع کریں؟",fa3:"رابطہ فارم سے پیغام بھیجیں یا واٹس ایپ بٹن دبائیں — میں عام طور پر ایک دن میں جواب دیتا ہوں۔",
fq4:"کیا آپ پاکستانی کلائنٹس کے ساتھ کام کرتے ہیں؟",fa4:"جی ہاں — میرا زیادہ تر ویڈیو ایڈ کا کام پاکستانی چھوٹے کاروباروں کے لیے ہے جو واٹس ایپ اور سوشل میڈیا پر بیچتے ہیں۔",
fq5:"کیا تحقیقی تعاون کے لیے تیار ہیں؟",fa5:"بالکل۔ میری اشاعتیں اوپن ایکسیس ہیں — اگر آپ ان پر کام بڑھانا چاہیں تو رابطہ کریں۔",
fq6:"ڈیلیوری میں کتنا وقت لگتا ہے؟",fa6:"معیاری ویڈیو پراجیکٹس کے لیے 2 سے 5 دن؛ پریمیم پیکج پر تیز۔",
h_book:"میٹنگ بک کریں",book_lead:"اپنے لیے مناسب وقت چنیں — آئیے آپ کے پراجیکٹ پر بات کریں۔",book_btn:"کیلنڈر کھولیں",
h_services:"سروسز اور قیمتیں",services_lead:"اے آئی ویڈیو اشتہارات اور ریلز — براہ راست یا فائیور کے ذریعے آرڈر کریں۔",order_now:"آرڈر کریں",visitors:"وزٹرز",verified_label:"تصدیق شدہ",whatsapp_chat:"واٹس ایپ پر چیٹ کریں",vcard_dl:"میرا نمبر سیو کریں (vCard)",avail_badge:"فری لانس پراجیکٹس کے لیے دستیاب",h_process:"کام کیسے ہوتا ہے",process_lead:"آسان 3 مرحلہ عمل — نہ الجھن، نہ تاخیر۔",step1t:"رابطہ کریں",step1d:"اپنے پراجیکٹ کے بارے میں بتائیں — واٹس ایپ، لائیو چیٹ یا نیچے فارم۔",step2t:"بات چیت اور منصوبہ",step2d:"کام شروع ہونے سے پہلے دائرہ، وقت اور قیمت طے کرتے ہیں۔",step3t:"ڈیلیوری",step3d:"آپ کو مکمل کام ملتا ہے، نظرثانی سمیت۔",skip:"مواد پر جائیں",last_upd:"آخری اپڈیٹ",
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

// ---------- Light / dark theme (respects system preference on first visit) ----------
let theme = localStorage.getItem('uk-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
function applyTheme(t){
  theme = t; localStorage.setItem('uk-theme', t);
  document.documentElement.dataset.theme = t === 'light' ? 'light' : '';
  document.getElementById('theme-toggle').textContent = t === 'light' ? '🌙' : '☀️';
}
document.getElementById('theme-toggle').addEventListener('click', () => applyTheme(theme === 'light' ? 'dark' : 'light'));
applyTheme(theme);

// ---------- Booking link ----------
(function(){
  const b = document.getElementById('book-btn');
  b.href = BOOKING_URL || 'https://wa.me/923187579301?text=Assalam-o-Alaikum!%20I%20want%20to%20book%20a%20meeting.';
})();

// ---------- Visitor counter ----------
async function trackVisit(){
  const el = document.getElementById('visitor-count');
  if (!BACKEND_URL) { el.textContent = '–'; return; }
  try {
    let res;
    if (!sessionStorage.getItem('uk-visited')) {
      res = await fetch(BACKEND_URL + '/api/visits', { method: 'POST' });
      sessionStorage.setItem('uk-visited', '1');
    } else {
      res = await fetch(BACKEND_URL + '/api/visits');
    }
    const d = await res.json();
    el.textContent = d.count.toLocaleString();
  } catch(e){ el.textContent = '–'; }
}
trackVisit();
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

// Mobile hamburger menu
(function(){
  var nav=document.querySelector('.nav'),btn=document.getElementById('menu-toggle');
  if(!nav||!btn)return;
  btn.addEventListener('click',function(e){e.stopPropagation();nav.classList.toggle('open');});
  nav.querySelectorAll('.nav-links a').forEach(function(a){
    a.addEventListener('click',function(){nav.classList.remove('open');});
  });
  document.addEventListener('click',function(e){
    if(nav.classList.contains('open')&&!nav.contains(e.target))nav.classList.remove('open');
  });
})();

// Back-to-top button
(function(){
  var b=document.getElementById('to-top');
  if(!b)return;
  window.addEventListener('scroll',function(){
    b.classList.toggle('show',window.scrollY>600);
  },{passive:true});
  b.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
})();

// Scrollspy: highlight the nav link of the section in view
(function(){
  document.body.classList.add('js');
  var links=Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var secs=links.map(function(a){return document.querySelector(a.getAttribute('href'));}).filter(Boolean);
  if(!('IntersectionObserver' in window)||!secs.length)return;
  var spy=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id);});
      }
    });
  },{rootMargin:'-35% 0px -60% 0px'});
  secs.forEach(function(s){spy.observe(s);});
  // Reveal-on-scroll
  var rev=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');rev.unobserve(e.target);}});
  },{threshold:0.08});
  document.querySelectorAll('.section').forEach(function(s){rev.observe(s);});
})();

// Footer "last updated" from the page's own modification date
(function(){
  var el=document.getElementById('last-upd');
  if(!el||!document.lastModified)return;
  try{el.textContent=new Date(document.lastModified).toLocaleDateString('en-GB',{month:'short',year:'numeric'});}catch(e){el.textContent=document.lastModified;}
})();

// Reading progress bar
(function(){
  var bar=document.getElementById('progress');
  if(!bar)return;
  window.addEventListener('scroll',function(){
    var h=document.documentElement;
    var max=h.scrollHeight-h.clientHeight;
    bar.style.width=(max>0?(h.scrollTop/max)*100:0)+'%';
  },{passive:true});
})();
