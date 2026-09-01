document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const applyParam = (name, selector) => {
    const value = params.get(name);
    if (!value) return;
    const input = document.getElementById(name);
    if (input) input.value = value;
    const card = document.querySelector(`${selector}[data-value="${CSS.escape(value)}"]`);
    if (card) {
      document.querySelectorAll(selector).forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    }
  };
  applyParam('occasion', '.occasion-selection .selection-card');
  applyParam('package', '.package-option');

  const form = document.getElementById('celebrationForm');
  const next = document.getElementById('nextBtn');
  const prev = document.getElementById('prevBtn');
  const submit = document.getElementById('submitBtn');
  if (!form || !next || !prev || !submit) return;

  let step = 1;
  const total = 5;
  const show = n => {
    step = Math.max(1, Math.min(total, n));
    document.querySelectorAll('.form-step').forEach(el => el.classList.toggle('active', Number(el.dataset.step) === step));
    document.querySelectorAll('.progress-step').forEach(el => el.classList.toggle('active', Number(el.dataset.step) <= step));
    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = `${((step - 1) / (total - 1)) * 100}%`;
    prev.style.display = step === 1 ? 'none' : 'inline-flex';
    next.style.display = step === total ? 'none' : 'inline-flex';
    submit.style.display = step === total ? 'inline-flex' : 'none';
  };
  const requiredFor = n => {
    if (n === 1) return document.getElementById('occasion')?.value;
    if (n === 2) return document.getElementById('relationship')?.value;
    if (n === 3) return document.getElementById('theme')?.value;
    if (n === 4) return ['personName','customerName','specialDate','email'].every(id => document.getElementById(id)?.value.trim());
    return document.getElementById('package')?.value;
  };
  next.addEventListener('click', e => {
    e.preventDefault();
    if (!requiredFor(step)) { alert('Please complete this step before continuing.'); return; }
    show(step + 1);
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
  prev.addEventListener('click', e => { e.preventDefault(); show(step - 1); window.scrollTo({top: 0, behavior: 'smooth'}); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!requiredFor(5)) { alert('Please choose a package.'); return; }
    const ids = ['occasion','relationship','theme','package','personName','customerName','specialDate','email','message'];
    const order = Object.fromEntries(ids.map(id => [id, document.getElementById(id)?.value || '']));
    localStorage.setItem('celebrateVerseOrder', JSON.stringify(order));
    window.location.href = 'payment.html';
  });
  show(1);
});