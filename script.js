document.getElementById('bubbles').classList.add('js-animated');
document.querySelectorAll('.bubble').forEach((b, i) => {
  b.style.transitionDelay = `${i * 0.06}s`;
  requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('visible')));
});

const orb = document.getElementById('orb');
document.addEventListener('mousemove', e => { orb.style.left = e.clientX + 'px'; orb.style.top = e.clientY + 'px'; });

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.bubble').forEach(b => {
      if (f === 'all' || b.dataset.cat === f) {
        b.classList.remove('hidden');
        b.classList.add('visible');
      } else {
        b.classList.remove('visible');
        b.classList.add('hidden');
      }
    });
  });
});

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
document.getElementById('modalClose').addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });

document.querySelectorAll('.bubble').forEach(b => {
  b.addEventListener('click', () => {
    const title = b.querySelector('.bubble-title').textContent;
    const tagline = b.querySelector('.bubble-tagline').textContent;
    const icon = b.querySelector('.bubble-icon').innerHTML;
    const iconStyle = b.querySelector('.bubble-icon').getAttribute('style');
    const detail = b.dataset.detail || b.querySelector('.bubble-desc').textContent;
    const url = b.dataset.url;
    const tech = (b.dataset.alltech || '').split(',').filter(Boolean);
    const statusEl = b.querySelector('.status');
    const statusClass = [...statusEl.classList].find(c => c.startsWith('status-') && c !== 'status');
    const statusText = statusEl.textContent.trim();

    modalContent.innerHTML = `
      <div class="modal-icon" style="${iconStyle}">${icon}</div>
      <div class="modal-title">${title}</div>
      <div class="modal-subtitle">${tagline}</div>
      <div class="modal-body">
        <p>${detail}</p>
        ${url ? `<p><a href="${url}" target="_blank" rel="noopener" class="modal-url">${url}</a></p>` : ''}
        <div class="modal-section"><h3>Tech Stack</h3><div class="modal-tech">${tech.map(t => `<span class="tag">${t}</span>`).join('')}</div></div>
        <div class="modal-section"><h3>Status</h3><div class="status ${statusClass}" style="font-size:0.9rem;"><span class="status-dot"></span> ${statusText}</div></div>
      </div>
    `;
    modal.classList.add('open');
  });
});

document.querySelectorAll('.stat-number').forEach(el => {
  const target = parseInt(el.textContent);
  el.textContent = '0';
  setTimeout(() => {
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / 1500, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }, 1200);
});
