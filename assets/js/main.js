(() => {
  const doc = document.documentElement;
  doc.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Nav: solid background once the page scrolls */
  const nav = document.querySelector('[data-nav]');
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 12);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById('mobile-menu');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.hidden = open;
  });
  menu.addEventListener('click', e => {
    if (e.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); menu.hidden = true; }
  });

  /* Reveal: one rise-in per element, staggered inside groups */
  const reveals = [...document.querySelectorAll('.reveal')];
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    reveals.forEach(el => {
      const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
      const i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty('--d', `${Math.min(i, 7) * 0.06}s`);
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* Reel: real footage, one scene at a time; videos load only when their scene comes up */
  const reel = document.querySelector('[data-reel]');
  if (reel) {
    const scenes = [...reel.querySelectorAll('.reel__scene')];
    const steps = [...reel.querySelectorAll('.reel__steps li')];
    const label = reel.querySelector('[data-reel-label]');
    const btn = reel.querySelector('[data-reel-toggle]');
    const btnLabel = reel.querySelector('[data-reel-toggle-label]');
    let idx = 0, playing = !reduced, inView = true, t0 = 0, elapsed = 0, raf = 0;
    const visible = () => inView && !document.hidden;
    const dur = i => (parseFloat(scenes[i].dataset.dur) || 6) * 1000;
    const pad = n => String(n).padStart(2, '0');

    const show = i => {
      scenes.forEach((s, k) => {
        s.classList.toggle('is-on', k === i);
        if (k !== i) s.querySelectorAll('video').forEach(v => v.pause());
      });
      const v = [...scenes[i].querySelectorAll('video')];
      v.forEach(el => { el.preload = 'auto'; try { el.currentTime = 0; } catch (e) {} if (playing && visible()) el.play().catch(() => {}); });
      // warm the next scene
      scenes[(i + 1) % scenes.length].querySelectorAll('video').forEach(el => { if (el.preload === 'none') el.preload = 'metadata'; });
      label.textContent = `Showreel ${pad(i + 1)}/${pad(scenes.length)}`;
      idx = i; elapsed = 0;
    };
    const paint = () => steps.forEach((s, k) => s.style.setProperty('--p', k < idx ? 1 : k === idx ? Math.min(elapsed / dur(idx), 1) : 0));
    const tick = now => {
      elapsed += now - t0; t0 = now;
      if (elapsed >= dur(idx)) show((idx + 1) % scenes.length);
      paint();
      raf = requestAnimationFrame(tick);
    };
    const run = () => {
      cancelAnimationFrame(raf); raf = 0;
      const on = playing && visible();
      scenes[idx].querySelectorAll('video').forEach(v => on ? v.play().catch(() => {}) : v.pause());
      if (on) { t0 = performance.now(); raf = requestAnimationFrame(tick); }
    };
    const setPlaying = v => {
      playing = v;
      reel.classList.toggle('is-paused', !v);
      btn.setAttribute('aria-pressed', String(!v));
      btnLabel.textContent = v ? 'Pause reel' : 'Play reel';
      run();
    };
    show(0); paint();
    setPlaying(playing);
    btn.addEventListener('click', () => setPlaying(!playing));
    new IntersectionObserver(([en]) => { inView = en.isIntersecting; run(); }).observe(reel);
    document.addEventListener('visibilitychange', run);
  }

  /* Work filter */
  const cards = document.querySelector('[data-cards]');
  if (cards) {
    const buttons = [...document.querySelectorAll('[data-filter]')];
    const empty = document.querySelector('[data-cards-empty]');
    buttons.forEach(b => b.addEventListener('click', () => {
      const f = b.dataset.filter;
      buttons.forEach(x => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
      let shown = 0;
      cards.querySelectorAll('.card').forEach((c, i) => {
        const ok = f === 'all' || c.dataset.disciplines.split('|').includes(f);
        c.hidden = !ok; if (ok) shown++;
        c.classList.toggle('card--wide', ok && f === 'all' && i === 0);
      });
      empty.hidden = shown > 0;
    }));
  }

  /* Start a project: validate, then confirm. Destination not wired yet — nothing leaves the page. */
  const form = document.querySelector('[data-start]');
  if (form) {
    const email = form.querySelector('#email');
    const field = email.closest('.field');
    const err = form.querySelector('#email-error');
    const done = form.querySelector('[data-start-done]');
    const showError = msg => { field.classList.add('has-error'); err.textContent = msg; err.hidden = false; email.setAttribute('aria-invalid', 'true'); };
    const clearError = () => { field.classList.remove('has-error'); err.hidden = true; email.removeAttribute('aria-invalid'); };
    email.addEventListener('input', clearError);
    form.addEventListener('submit', e => {
      e.preventDefault();
      const v = email.value.trim();
      if (!v) return showError('Add your email so we can reply.'), email.focus();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return showError('That email looks incomplete. Check it and try again.'), email.focus();
      clearError();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Sending…';
      // TODO: send to the chosen inquiry destination (form service, email or backend), then hand off to contact.html.
      setTimeout(() => { form.classList.add('is-done'); done.hidden = false; done.focus(); }, 500);
    });
  }
})();
