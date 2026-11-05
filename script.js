/**
 * script.js — Полная логика клиентской страницы index.html
 * Включает: переключение 3 тем («Кибер-Вольт», «Индустриальный Fluke», «На объекте — Антиблик»),
 * виджет «Совет дня», Инженерные паспорта объектов и онлайн-калькулятор.
 */

(function () {
  'use strict';

  const calcState = {
    works: {},
    materials: {},
    matMode: 'own',
    urgent: false,
    selectedRating: 5
  };

  const SERVICE_ICONS = {
    cable: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9h16M4 15h16M8 5v4M16 15v4"/></svg>',
    socket: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="9.5" cy="12" r="1.5" fill="currentColor"/><circle cx="14.5" cy="12" r="1.5" fill="currentColor"/></svg>',
    switch: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="3"/><line x1="12" y1="7" x2="12" y2="17"/></svg>',
    lamp: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>',
    shield: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M13 8l-3 5h4l-3 5"/></svg>',
    drill: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4l6 6-8 8-6-6 8-8zM4 20l4-4"/></svg>',
    search: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 7l-2 4h4l-2 4"/></svg>',
    stove: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="2"/><circle cx="15.5" cy="8.5" r="2"/><rect x="6" y="14" width="12" height="4" rx="1"/></svg>'
  };

  function formatRub(num) {
    return Math.round(Number(num) || 0).toLocaleString('ru-RU') + ' ₽';
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      t.classList.remove('is-visible');
    }, 2800);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildMessengerButtons(contacts) {
    const items = [];
    if (contacts.telegram && contacts.telegram.trim()) {
      items.push(`<a href="${escapeHtml(contacts.telegram)}" target="_blank" rel="noopener" class="btn-msg btn-tg"><svg><use href="#i-tg"/></svg><span>Telegram</span></a>`);
    }
    if (contacts.whatsapp && contacts.whatsapp.trim()) {
      items.push(`<a href="${escapeHtml(contacts.whatsapp)}" target="_blank" rel="noopener" class="btn-msg btn-wa"><svg><use href="#i-wa"/></svg><span>WhatsApp</span></a>`);
    }
    if (contacts.max && contacts.max.trim()) {
      items.push(`<a href="${escapeHtml(contacts.max)}" target="_blank" rel="noopener" class="btn-msg btn-max"><svg><use href="#i-max"/></svg><span>MAX</span></a>`);
    }
    if (contacts.vk && contacts.vk.trim()) {
      items.push(`<a href="${escapeHtml(contacts.vk)}" target="_blank" rel="noopener" class="btn-msg btn-vk"><svg><use href="#i-vk"/></svg><span>ВКонтакте</span></a>`);
    }
    return items.join('');
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '';
  }

  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html || '';
  }

  // Синхронизация переключателей темы и виджета «Совет дня»
  function syncThemeUI() {
    const activeTheme = window.Store.getActiveTheme();
    document.documentElement.setAttribute('data-theme', activeTheme);

    document.querySelectorAll('.js-theme-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-set-theme') === activeTheme);
    });

    const tipToggle = document.getElementById('outdoor-tip-toggle');
    const tipDesc = document.getElementById('outdoor-tip-desc');
    if (tipToggle && tipDesc) {
      if (activeTheme === 'outdoor') {
        tipDesc.textContent = 'Включён сверхконтрастный антибликовый режим «На объекте» для работы на солнце.';
        tipToggle.textContent = '⚡ Вернуть тёмную тему';
      } else {
        tipDesc.textContent = 'Используйте контрастную тему на солнце для лучшей читаемости цен и сечений.';
        tipToggle.textContent = '☀️ Включить антиблик «На объекте»';
      }
    }
  }

  function renderSite() {
    const cfg = window.Store.getConfig();
    const b = cfg.brand;
    const c = cfg.contacts;

    syncThemeUI();

    const pageTitle = (cfg.seo.titleTemplate || 'Электромонтаж в г. {city} — {brandName}')
      .replace('{city}', b.city)
      .replace('{brandName}', b.name);
    document.title = pageTitle;
    const descEl = document.getElementById('page-desc');
    if (descEl) descEl.setAttribute('content', cfg.seo.description || '');

    setText('hdr-brand', b.name);
    setText('mob-brand', b.name);
    setText('ftr-brand', b.name);
    setText('hdr-city', b.city);
    setText('ftr-city', b.city);
    setText('hero-region', b.region);
    setText('hero-tagline', b.tagline);
    setText('hero-master', b.masterName);
    setText('hero-lead-text', b.heroLead || 'Работаю без посредников и накруток диспетчеров: от срочного поиска короткого замыкания до полной сборки щитов и разводки в новостройках.');
    setText('hero-visual-badge', b.heroVisualBadge || '⚡ ТЕХНИЧЕСКИЙ РЕГЛАМЕНТ МОНТАЖА');
    setText('hero-visual-status', b.heroVisualStatus || '● Допуск IV группы до 1000В');
    setText('hero-visual-caption', b.heroVisualCaption || 'Никаких скруток и дешёвого кабеля ТУ — монтаж строго по ПУЭ-7, ГОСТ Р 50571 и проекту.');

    setText('trust-exp', b.experienceYears);
    setText('trust-war', b.warrantyYears);
    setText('trust-arr', b.arrivalTime);
    setText('trust-norm', b.normative);

    const urgentPct = Math.max(0, Number(b.urgentMultiplier) || 30);
    setText('urg-fast', `Срочно сегодня (+${urgentPct}%)`);
    setText('sum-urgent-lbl', `Срочность (+${urgentPct}%):`);

    const cleanTel = 'tel:' + (c.phoneClean || c.phone.replace(/[^\d+]/g, ''));
    const hdrPhoneBtn = document.getElementById('hdr-phone-btn');
    if (hdrPhoneBtn) hdrPhoneBtn.setAttribute('href', cleanTel);
    setText('hdr-phone-txt', c.phone);

    const cntPhoneLink = document.getElementById('cnt-phone-link');
    if (cntPhoneLink) {
      cntPhoneLink.setAttribute('href', cleanTel);
      cntPhoneLink.textContent = c.phone;
    }

    setText('cnt-schedule', b.schedule);
    setText('cnt-region', b.region);
    setText('cnt-districts', b.districts);

    const emailEl = document.getElementById('cnt-email');
    if (emailEl) {
      emailEl.textContent = c.email;
      emailEl.setAttribute('href', 'mailto:' + c.email);
    }

    const heroSvgBox = document.getElementById('hero-svg-box');
    if (heroSvgBox) {
      const standards = Array.isArray(b.heroStandards) ? b.heroStandards : [];
      const customPhotoHtml = (b.heroCustomPhoto && b.heroCustomPhoto.trim())
        ? `<div class="hero-custom-photo-box"><img src="${escapeHtml(b.heroCustomPhoto)}" alt="${escapeHtml(b.name)}"></div>`
        : '';
      const stdHtml = standards.map(function (st) {
        return `
          <div class="hero-std-item">
            <div class="hero-std-title"><span>✓</span> ${escapeHtml(st.title)}</div>
            <div class="hero-std-desc">${escapeHtml(st.desc)}</div>
          </div>
        `;
      }).join('');
      heroSvgBox.innerHTML = customPhotoHtml + `<div class="hero-standards-list">${stdHtml}</div>`;
    }

    const msgHtml = buildMessengerButtons(c);
    setHtml('hero-messengers', msgHtml);
    setHtml('mob-messengers', msgHtml);
    setHtml('contacts-messengers', msgHtml);
    setHtml('fab-menu', msgHtml + `<a href="${escapeHtml(cleanTel)}" class="btn-msg" style="background:var(--accent);color:var(--accent-contrast);"><svg><use href="#i-phone"/></svg><span>Позвонить</span></a>`);

    renderServices(cfg.services || []);
    renderCalculatorInputs(cfg);
    recalcEstimate();
    renderCases(cfg.cases || []);
    renderSteps(cfg.steps || []);
    renderReviews();
    renderFaq(cfg.faqs || []);
  }

  function renderServices(services) {
    const grid = document.getElementById('services-grid');
    if (!grid) return;
    const activeList = services.filter(function (s) { return s.active !== false; });

    grid.innerHTML = activeList.map(function (s) {
      const iconSvg = SERVICE_ICONS[s.icon] || SERVICE_ICONS.shield;
      return `
        <article class="service-card reveal is-visible">
          <div>
            <div class="service-icon" aria-hidden="true">${iconSvg}</div>
            <h3 class="service-title">${escapeHtml(s.name)}</h3>
            <p class="service-desc">${escapeHtml(s.desc || '')}</p>
          </div>
          <div class="service-footer">
            <div>
              <div style="font-size:0.75rem;color:var(--text-muted);">Стоимость за ${escapeHtml(s.unit)}</div>
              <div class="service-price">от ${formatRub(s.price)}</div>
            </div>
            <button type="button" class="btn btn-outline js-pick-service" data-id="${escapeHtml(s.id)}" style="min-height:38px;padding:6px 14px;font-size:0.84rem;">
              Рассчитать
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderCalculatorInputs(cfg) {
    const worksBox = document.getElementById('calc-works-list');
    const matsBox = document.getElementById('calc-materials-box');
    if (!worksBox || !matsBox) return;

    const activeWorks = (cfg.services || []).filter(function (s) { return s.active !== false; });
    worksBox.innerHTML = activeWorks.map(function (s) {
      const qty = calcState.works[s.id] || 0;
      return `
        <div class="calc-row">
          <div class="calc-row-info">
            <div class="calc-row-title">${escapeHtml(s.name)}</div>
            <div class="calc-row-meta">${formatRub(s.price)} / ${escapeHtml(s.unit)}</div>
          </div>
          <div class="stepper">
            <button type="button" class="js-step" data-type="work" data-id="${escapeHtml(s.id)}" data-delta="-1" aria-label="Уменьшить">−</button>
            <input type="number" min="0" max="9999" value="${qty}" class="js-qty-input" data-type="work" data-id="${escapeHtml(s.id)}" aria-label="${escapeHtml(s.name)}">
            <button type="button" class="js-step" data-type="work" data-id="${escapeHtml(s.id)}" data-delta="1" aria-label="Увеличить">+</button>
          </div>
        </div>
      `;
    }).join('');

    const activeMats = (cfg.materials || []).filter(function (m) { return m.active !== false; });
    matsBox.innerHTML = activeMats.map(function (m) {
      const qty = calcState.materials[m.id] || 0;
      return `
        <div class="calc-row">
          <div class="calc-row-info">
            <div class="calc-row-title">${escapeHtml(m.name)}</div>
            <div class="calc-row-meta">${formatRub(m.price)} / ${escapeHtml(m.unit)}</div>
          </div>
          <div class="stepper">
            <button type="button" class="js-step" data-type="mat" data-id="${escapeHtml(m.id)}" data-delta="-1" aria-label="Уменьшить">−</button>
            <input type="number" min="0" max="9999" value="${qty}" class="js-qty-input" data-type="mat" data-id="${escapeHtml(m.id)}" aria-label="${escapeHtml(m.name)}">
            <button type="button" class="js-step" data-type="mat" data-id="${escapeHtml(m.id)}" data-delta="1" aria-label="Увеличить">+</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function recalcEstimate() {
    const cfg = window.Store.getConfig();
    const minOrder = Math.max(0, Number(cfg.brand.minOrder) || 2500);
    const urgentPct = Math.max(0, Number(cfg.brand.urgentMultiplier) || 30);

    let worksSum = 0;
    let matsSum = 0;
    const summaryLines = [];

    (cfg.services || []).forEach(function (s) {
      if (s.active === false) return;
      const q = Math.max(0, Number(calcState.works[s.id]) || 0);
      if (q > 0) {
        const lineTotal = q * Number(s.price);
        worksSum += lineTotal;
        summaryLines.push({ title: `${s.name} (${q} ${s.unit})`, cost: lineTotal });
      }
    });

    if (calcState.matMode === 'calc') {
      (cfg.materials || []).forEach(function (m) {
        if (m.active === false) return;
        const q = Math.max(0, Number(calcState.materials[m.id]) || 0);
        if (q > 0) {
          const lineTotal = q * Number(m.price);
          matsSum += lineTotal;
          summaryLines.push({ title: `[Мат.] ${m.name} (${q} ${m.unit})`, cost: lineTotal });
        }
      });
    }

    const urgentAdd = calcState.urgent ? Math.round(worksSum * (urgentPct / 100)) : 0;
    let rawTotal = worksSum + matsSum + urgentAdd;
    let appliedMinOrder = false;

    if (rawTotal > 0 && rawTotal < minOrder) {
      rawTotal = minOrder;
      appliedMinOrder = true;
    }

    const round50 = function (v) { return Math.round(v / 50) * 50; };
    const lowRange = rawTotal > 0 ? round50(rawTotal * 0.85) : 0;
    const highRange = rawTotal > 0 ? round50(rawTotal * 1.15) : 0;

    const linesEl = document.getElementById('calc-summary-lines');
    if (linesEl) {
      if (summaryLines.length === 0) {
        linesEl.innerHTML = `<div style="color:var(--text-muted);padding:8px 0;">Позиции пока не выбраны. Добавьте нужные работы слева.</div>`;
      } else {
        linesEl.innerHTML = summaryLines.map(function (ln) {
          return `<div class="summary-line"><span>${escapeHtml(ln.title)}</span><strong>${formatRub(ln.cost)}</strong></div>`;
        }).join('');
      }
    }

    setText('sum-works', formatRub(worksSum));
    setText('sum-materials', calcState.matMode === 'calc' ? formatRub(matsSum) : 'Свои (0 ₽)');

    const urgRow = document.getElementById('sum-urgent-row');
    if (urgRow) {
      urgRow.classList.toggle('is-hidden', !calcState.urgent);
      setText('sum-urgent', '+' + formatRub(urgentAdd));
    }

    const minRow = document.getElementById('sum-min-note');
    if (minRow) {
      minRow.classList.toggle('is-hidden', !appliedMinOrder);
      setText('sum-min-val', formatRub(minOrder) + ' (применён порог)');
    }

    const rangeEl = document.getElementById('sum-total-range');
    if (rangeEl) {
      rangeEl.textContent = rawTotal > 0 ? `от ${formatRub(lowRange)} до ${formatRub(highRange)}` : '0 ₽';
    }

    calcState._formattedText = summaryLines.length > 0
      ? [
          'Расчёт из калькулятора:',
          ...summaryLines.map(function (l) { return `• ${l.title} — ${formatRub(l.cost)}`; }),
          calcState.urgent ? `• Срочный выезд (+${urgentPct}%): +${formatRub(urgentAdd)}` : null,
          appliedMinOrder ? `• Учтён минимальный заказ: ${formatRub(minOrder)}` : null,
          `Итого ориентир: от ${formatRub(lowRange)} до ${formatRub(highRange)}`
        ].filter(Boolean).join('\n')
      : '';
  }

  function renderCases(cases) {
    const grid = document.getElementById('cases-grid');
    if (!grid) return;

    grid.innerHTML = cases.map(function (c) {
      const badgeTag = c.tag || 'Электромонтаж под ключ';
      const badgeSpec = c.spec || 'Работа по ПУЭ-7 и ГОСТ';

      const rawPoints = String(c.done || '').split(/[;\n]+/).map(function (s) { return s.trim(); }).filter(Boolean);
      const checklistHtml = rawPoints.map(function (pt) {
        return `<li><span>${escapeHtml(pt)}</span></li>`;
      }).join('');

      const customPhotoBlock = (c.customPhoto && c.customPhoto.trim())
        ? `<div class="case-custom-photo"><img src="${escapeHtml(c.customPhoto)}" alt="${escapeHtml(c.title)}" loading="lazy"></div>`
        : '';

      return `
        <article class="case-card reveal is-visible">
          ${customPhotoBlock}
          <div class="case-passport-header">
            <span class="case-badge-tag">⚡ ${escapeHtml(badgeTag)}</span>
            <span class="case-badge-time">⏱ Срок: ${escapeHtml(c.duration)}</span>
          </div>
          <div class="case-body">
            <div>
              <h3 style="font-size:1.16rem;margin-bottom:10px;">${escapeHtml(c.title)}</h3>
              <div class="case-spec-bar">🔧 ${escapeHtml(badgeSpec)}</div>
              <ul class="case-checklist">${checklistHtml}</ul>
            </div>
            <div class="case-meta">
              <div>
                <div style="font-size:0.76rem;color:var(--text-muted);">Стоимость работ по договору</div>
                <div style="font-size:1.24rem;font-weight:800;font-family:var(--font-num);color:var(--accent);">${escapeHtml(c.cost)}</div>
              </div>
              <button type="button" class="btn btn-outline js-want-same" data-title="${escapeHtml(c.title)}" style="min-height:40px;padding:8px 16px;font-size:0.86rem;">
                Хочу так же
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderSteps(steps) {
    const grid = document.getElementById('steps-grid');
    if (!grid) return;
    grid.innerHTML = steps.map(function (st, idx) {
      return `
        <div class="step-card">
          <div class="step-num">${escapeHtml(st.num || (idx + 1))}</div>
          <h4>${escapeHtml(st.title)}</h4>
          <p style="font-size:0.86rem;color:var(--text-muted);margin-top:6px;">${escapeHtml(st.desc)}</p>
        </div>
      `;
    }).join('');
  }

  function renderReviews() {
    const approved = window.Store.getReviews(true);
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;

    const total = approved.length;
    const avg = total > 0
      ? (approved.reduce(function (acc, r) { return acc + (Number(r.rating) || 5); }, 0) / total).toFixed(1)
      : '5.0';

    setText('rev-avg-score', `★ ${avg} / 5.0`);
    setText('rev-total-count', `На основе ${total} проверенных отзывов`);

    grid.innerHTML = approved.map(function (r) {
      const ratingNum = Math.min(5, Math.max(1, Number(r.rating) || 5));
      const starsStr = '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);
      return `
        <article class="review-card reveal is-visible">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
            <div>
              <strong>${escapeHtml(r.name)}</strong>
              <div style="font-size:0.8rem;color:var(--text-muted);">${escapeHtml(r.district)} • ${escapeHtml(r.service)}</div>
            </div>
            <div style="text-align:right;">
              <div class="stars" aria-label="Рейтинг ${ratingNum} из 5">${starsStr}</div>
              <div style="font-size:0.75rem;color:var(--text-muted);">${escapeHtml(r.date)}</div>
            </div>
          </div>
          <p style="font-size:0.92rem;color:var(--text-main);">${escapeHtml(r.text)}</p>
        </article>
      `;
    }).join('');
  }

  function renderFaq(faqs) {
    const box = document.getElementById('faq-list');
    if (!box) return;

    box.innerHTML = faqs.map(function (f, idx) {
      return `
        <div class="faq-item ${idx === 0 ? 'is-open' : ''}">
          <button type="button" class="faq-question" aria-expanded="${idx === 0 ? 'true' : 'false'}">
            <span>${escapeHtml(f.q)}</span>
            <span style="color:var(--accent);font-size:1.25rem;">+</span>
          </button>
          <div class="faq-answer">${escapeHtml(f.a)}</div>
        </div>
      `;
    }).join('');
  }

  function initPhoneMask() {
    const input = document.getElementById('lead-phone');
    if (!input) return;

    input.addEventListener('input', function (e) {
      let digits = e.target.value.replace(/\D/g, '');
      if (!digits) {
        e.target.value = '';
        return;
      }
      if (digits[0] === '8' || digits[0] === '7') {
        digits = digits.substring(1);
      }
      digits = digits.substring(0, 10);

      let formatted = '+7';
      if (digits.length > 0) formatted += ' (' + digits.substring(0, 3);
      if (digits.length >= 4) formatted += ') ' + digits.substring(3, 6);
      if (digits.length >= 7) formatted += '-' + digits.substring(6, 8);
      if (digits.length >= 9) formatted += '-' + digits.substring(8, 10);
      e.target.value = formatted;
    });
  }

  function initLedPerimeter() {
    const topBar = document.getElementById('led-top');
    const rightBar = document.getElementById('led-right');
    const bottomBar = document.getElementById('led-bottom');
    const leftBar = document.getElementById('led-left');
    const circuitBg = document.getElementById('bg-circuit');
    if (!topBar) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let targetProgress = 0.02;
    let currentProgress = 0.02;

    function computeScrollProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetProgress = Math.min(1, Math.max(0.02, scrollTop / maxScroll));
      if (circuitBg && !reducedMotion) {
        circuitBg.style.transform = `translateY(${-(scrollTop * 0.08)}px)`;
      }
    }

    function applyBars(p) {
      const sTop = Math.min(1, Math.max(0.03, p / 0.25));
      const sRight = Math.min(1, Math.max(0, (p - 0.25) / 0.25));
      const sBottom = Math.min(1, Math.max(0, (p - 0.5) / 0.25));
      const sLeft = Math.min(1, Math.max(0, (p - 0.75) / 0.25));

      topBar.style.transform = `scaleX(${sTop.toFixed(4)})`;
      rightBar.style.transform = `scaleY(${sRight.toFixed(4)})`;
      bottomBar.style.transform = `scaleX(${sBottom.toFixed(4)})`;
      leftBar.style.transform = `scaleY(${sLeft.toFixed(4)})`;
    }

    window.addEventListener('scroll', computeScrollProgress, { passive: true });
    window.addEventListener('resize', computeScrollProgress, { passive: true });
    computeScrollProgress();

    if (reducedMotion) {
      window.addEventListener('scroll', function () { applyBars(targetProgress); }, { passive: true });
      applyBars(targetProgress);
      return;
    }

    function rafLoop() {
      currentProgress += (targetProgress - currentProgress) * 0.12;
      applyBars(currentProgress);
      requestAnimationFrame(rafLoop);
    }
    requestAnimationFrame(rafLoop);
  }

  function initSparksCanvas() {
    const canvas = document.getElementById('sparks-canvas');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;
    const count = window.innerWidth < 768 ? 18 : 38;
    const particles = [];

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.15 - Math.random() * 0.35,
        alpha: 0.2 + Math.random() * 0.55
      });
    }

    function draw() {
      if (!document.hidden && document.documentElement.getAttribute('data-theme') !== 'outdoor') {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) p.y = height + 10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 197, 61, ${p.alpha})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  function bindEvents() {
    document.addEventListener('click', function (e) {
      // Переключение 3 тем
      const themeBtn = e.target.closest('.js-theme-btn');
      if (themeBtn) {
        const chosen = themeBtn.getAttribute('data-set-theme');
        window.Store.setActiveTheme(chosen);
        syncThemeUI();
        const names = {
          cyber: '⚡ Тема «Кибер-Вольт» (Ультра-Неон)',
          fluke: '🛠 Тема «Индустриальный Fluke»',
          outdoor: '☀️ Боевой режим «На объекте» (Антиблик)'
        };
        showToast(names[chosen] || 'Тема изменена');
        return;
      }

      const pickBtn = e.target.closest('.js-pick-service');
      if (pickBtn) {
        const id = pickBtn.getAttribute('data-id');
        calcState.works[id] = Math.max(1, (calcState.works[id] || 0));
        renderCalculatorInputs(window.Store.getConfig());
        recalcEstimate();
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
        showToast('Услуга добавлена в калькулятор');
        return;
      }

      const stepBtn = e.target.closest('.js-step');
      if (stepBtn) {
        const type = stepBtn.getAttribute('data-type');
        const id = stepBtn.getAttribute('data-id');
        const delta = Number(stepBtn.getAttribute('data-delta')) || 0;
        const dict = type === 'work' ? calcState.works : calcState.materials;
        dict[id] = Math.max(0, (Number(dict[id]) || 0) + delta);
        const inp = stepBtn.parentElement.querySelector('input');
        if (inp) inp.value = dict[id];
        recalcEstimate();
        return;
      }

      const sameBtn = e.target.closest('.js-want-same');
      if (sameBtn) {
        const title = sameBtn.getAttribute('data-title');
        const commentEl = document.getElementById('lead-comment');
        if (commentEl) {
          commentEl.value = `Здравствуйте! Интересует аналогичная работа: «${title}». Прошу сориентировать по стоимости и срокам.`;
        }
        document.getElementById('request-section').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('lead-name').focus();
        return;
      }

      const faqBtn = e.target.closest('.faq-question');
      if (faqBtn) {
        const item = faqBtn.parentElement;
        const isOpen = item.classList.toggle('is-open');
        faqBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        return;
      }
    });

    // Плашка «Совет дня: Контрастный режим на солнце»
    const tipToggle = document.getElementById('outdoor-tip-toggle');
    if (tipToggle) {
      tipToggle.addEventListener('click', function () {
        const current = window.Store.getActiveTheme();
        const next = current === 'outdoor'
          ? ((window.Store.getConfig().brand.defaultTheme === 'outdoor') ? 'cyber' : (window.Store.getConfig().brand.defaultTheme || 'cyber'))
          : 'outdoor';
        window.Store.setActiveTheme(next);
        syncThemeUI();
        showToast(next === 'outdoor' ? '☀️ Включён антибликовый режим «На объекте»' : '⚡ Возвращена тёмная тема');
      });
    }

    const tipClose = document.getElementById('outdoor-tip-close');
    if (tipClose) {
      tipClose.addEventListener('click', function () {
        document.getElementById('outdoor-tip-widget').classList.add('is-hidden');
      });
    }

    document.addEventListener('input', function (e) {
      if (e.target.classList.contains('js-qty-input')) {
        const type = e.target.getAttribute('data-type');
        const id = e.target.getAttribute('data-id');
        const val = Math.max(0, Math.min(9999, parseInt(e.target.value, 10) || 0));
        if (type === 'work') calcState.works[id] = val;
        else calcState.materials[id] = val;
        recalcEstimate();
      }
    });

    document.getElementById('mat-mode-own').addEventListener('click', function () {
      calcState.matMode = 'own';
      this.classList.add('active');
      document.getElementById('mat-mode-calc').classList.remove('active');
      document.getElementById('calc-materials-box').classList.add('is-hidden');
      recalcEstimate();
    });

    document.getElementById('mat-mode-calc').addEventListener('click', function () {
      calcState.matMode = 'calc';
      this.classList.add('active');
      document.getElementById('mat-mode-own').classList.remove('active');
      document.getElementById('calc-materials-box').classList.remove('is-hidden');
      recalcEstimate();
    });

    document.getElementById('urg-normal').addEventListener('click', function () {
      calcState.urgent = false;
      this.classList.add('active');
      document.getElementById('urg-fast').classList.remove('active');
      recalcEstimate();
    });

    document.getElementById('urg-fast').addEventListener('click', function () {
      calcState.urgent = true;
      this.classList.add('active');
      document.getElementById('urg-normal').classList.remove('active');
      recalcEstimate();
    });

    document.getElementById('calc-reset-btn').addEventListener('click', function () {
      calcState.works = {};
      calcState.materials = {};
      calcState.urgent = false;
      document.getElementById('urg-normal').click();
      renderCalculatorInputs(window.Store.getConfig());
      recalcEstimate();
      showToast('Калькулятор очищен');
    });

    document.getElementById('calc-to-order-btn').addEventListener('click', function () {
      const commentEl = document.getElementById('lead-comment');
      if (commentEl && calcState._formattedText) {
        commentEl.value = calcState._formattedText;
      }
      document.getElementById('request-section').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('lead-name').focus();
    });

    document.getElementById('copy-phone-btn').addEventListener('click', function () {
      const phone = window.Store.getConfig().contacts.phone;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(phone);
      }
      showToast('Телефон скопирован: ' + phone);
    });

    const mobMenu = document.getElementById('mobile-menu');
    document.getElementById('burger-open').addEventListener('click', function () {
      mobMenu.classList.add('is-open');
    });
    document.getElementById('burger-close').addEventListener('click', function () {
      mobMenu.classList.remove('is-open');
    });
    document.querySelectorAll('.mob-link').forEach(function (lnk) {
      lnk.addEventListener('click', function () { mobMenu.classList.remove('is-open'); });
    });

    const fabContainer = document.getElementById('fab-container');
    document.getElementById('fab-trigger').addEventListener('click', function () {
      fabContainer.classList.toggle('is-open');
    });

    document.getElementById('toggle-review-form-btn').addEventListener('click', function () {
      document.getElementById('review-form').classList.toggle('is-hidden');
    });

    document.getElementById('star-picker').addEventListener('click', function (e) {
      const btn = e.target.closest('.star-btn');
      if (!btn) return;
      const val = Number(btn.getAttribute('data-val')) || 5;
      calcState.selectedRating = val;
      document.querySelectorAll('#star-picker .star-btn').forEach(function (b) {
        b.classList.toggle('active', Number(b.getAttribute('data-val')) <= val);
      });
    });

    document.getElementById('review-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('rev-name').value.trim();
      const district = document.getElementById('rev-district').value.trim();
      const service = document.getElementById('rev-service').value.trim();
      const text = document.getElementById('rev-text').value.trim();
      const errEl = document.getElementById('rev-error');

      if (name.length < 2 || text.length < 10) {
        errEl.textContent = 'Пожалуйста, укажите имя и напишите отзыв (не менее 10 символов).';
        return;
      }
      errEl.textContent = '';

      window.Store.addReview({
        name: name,
        district: district || 'Город',
        service: service || 'Электромонтаж',
        rating: calcState.selectedRating,
        text: text,
        approved: false
      });

      const msgEl = document.getElementById('rev-pending-msg');
      msgEl.textContent = '✓ Спасибо! Ваш отзыв сохранён со статусом «На модерации» и появится после проверки в панели мастера.';
      msgEl.classList.remove('is-hidden');
      e.target.reset();
    });

    let clickedChannel = 'whatsapp';
    document.querySelectorAll('#lead-form button[type="submit"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        clickedChannel = btn.getAttribute('data-channel') || 'whatsapp';
      });
    });

    document.getElementById('lead-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (document.getElementById('lead-hp').value) return;

      const name = document.getElementById('lead-name').value.trim();
      const phone = document.getElementById('lead-phone').value.trim();
      const comment = document.getElementById('lead-comment').value.trim();
      const consent = document.getElementById('lead-consent').checked;

      setText('err-lead-name', name.length < 2 ? 'Введите ваше имя' : '');
      setText('err-lead-phone', phone.replace(/\D/g, '').length < 11 ? 'Введите полный номер телефона' : '');
      setText('err-lead-consent', !consent ? 'Необходимо согласие на обработку данных' : '');

      if (name.length < 2 || phone.replace(/\D/g, '').length < 11 || !consent) return;

      window.Store.addRequest({
        name: name,
        phone: phone,
        channel: clickedChannel,
        comment: comment
      });

      const cfg = window.Store.getConfig();
      const fullMessage = `⚡ Заявка с сайта (${cfg.brand.name})\nИмя: ${name}\nТелефон: ${phone}\n${comment ? '\n' + comment : ''}`;

      if (cfg.contacts.tgBotToken && cfg.contacts.tgChatId) {
        fetch(`https://api.telegram.org/bot${cfg.contacts.tgBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: cfg.contacts.tgChatId,
            text: fullMessage
          })
        }).catch(function () {});
      }

      if (navigator.clipboard) {
        navigator.clipboard.writeText(fullMessage).catch(function () {});
      }

      let targetUrl = cfg.contacts.whatsapp || '';
      const encoded = encodeURIComponent(fullMessage);

      if (clickedChannel === 'whatsapp') {
        const waDigits = (cfg.contacts.phoneClean || cfg.contacts.phone).replace(/\D/g, '');
        targetUrl = `https://wa.me/${waDigits}?text=${encoded}`;
      } else if (clickedChannel === 'telegram') {
        const tgBase = cfg.contacts.telegram || 'https://t.me/';
        targetUrl = tgBase.includes('?') ? `${tgBase}&text=${encoded}` : `${tgBase}?text=${encoded}`;
      } else if (clickedChannel === 'max') {
        targetUrl = cfg.contacts.max || '#';
      } else if (clickedChannel === 'vk') {
        targetUrl = cfg.contacts.vk || '#';
      }

      const okBox = document.getElementById('lead-success-box');
      okBox.textContent = '✓ Заявка сохранена, текст сметы скопирован в буфер обмена! Открываем выбранный мессенджер...';
      okBox.classList.remove('is-hidden');

      if (targetUrl && targetUrl !== '#') {
        setTimeout(function () {
          window.open(targetUrl, '_blank', 'noopener');
        }, 450);
      }
    });

    const modal = document.getElementById('privacy-modal');
    const openPrivacy = function () { modal.classList.add('is-open'); };
    const closePrivacy = function () { modal.classList.remove('is-open'); };

    document.getElementById('open-privacy-btn').addEventListener('click', openPrivacy);
    document.getElementById('open-privacy-inline').addEventListener('click', openPrivacy);
    document.getElementById('close-privacy-btn').addEventListener('click', closePrivacy);
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePrivacy();
    });
  }

  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    items.forEach(function (el) { observer.observe(el); });
  }

  window.addEventListener('store:updated', function () {
    renderSite();
    initScrollReveal();
  });

  document.addEventListener('DOMContentLoaded', function () {
    renderSite();
    initPhoneMask();
    initLedPerimeter();
    initSparksCanvas();
    bindEvents();
    initScrollReveal();
  });
})();