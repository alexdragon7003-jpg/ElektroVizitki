/**
 * admin.js — Полная логика панели управления admin.html
 * Включает выбор темы по умолчанию («Кибер-Вольт», «Индустриальный Fluke», «На объекте — Антиблик»),
 * управление Инженерными паспортами объектов и синхронизацию с GitHub Gist.
 */

(function () {
  'use strict';

  const SESSION_KEY = 'electro_admin_logged_in';
  let workingConfig = null;

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(showToast._tm);
    showToast._tm = setTimeout(function () { t.classList.remove('is-visible'); }, 2800);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setVal(id, v) {
    const el = document.getElementById(id);
    if (el) el.value = v !== undefined && v !== null ? v : '';
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function syncAdminThemeButtons() {
    const active = window.Store.getActiveTheme();
    document.documentElement.setAttribute('data-theme', active);
    document.querySelectorAll('.js-admin-theme-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-set-theme') === active);
    });
  }

  function checkAuth() {
    syncAdminThemeButtons();
    const isLogged = sessionStorage.getItem(SESSION_KEY) === '1';
    document.getElementById('login-screen').classList.toggle('is-hidden', isLogged);
    document.getElementById('admin-app').classList.toggle('is-hidden', !isLogged);
    document.getElementById('admin-logout-btn').classList.toggle('is-hidden', !isLogged);
    if (isLogged) {
      loadConfigToForm();
    }
  }

  function updateHeroPhotoStatus() {
    const statusEl = document.getElementById('b-hero-photo-status');
    if (!statusEl || !workingConfig) return;
    if (workingConfig.brand && workingConfig.brand.heroCustomPhoto) {
      statusEl.textContent = '✓ Прикреплено собственное фото мастера';
      statusEl.style.color = 'var(--success)';
    } else {
      statusEl.textContent = 'Фото не прикреплено (отображается только Технический регламент)';
      statusEl.style.color = 'var(--text-muted)';
    }
  }

  function renderHeroStandardsEditor() {
    const box = document.getElementById('admin-hero-standards');
    if (!box || !workingConfig) return;
    const list = workingConfig.brand.heroStandards || [];
    box.innerHTML = list.map(function (st, idx) {
      return `
        <div style="display:grid;grid-template-columns:1fr 2fr;gap:8px;align-items:center;">
          <input type="text" class="input js-hstd-title" data-idx="${idx}" value="${escapeHtml(st.title)}" placeholder="Пункт регламента">
          <input type="text" class="input js-hstd-desc" data-idx="${idx}" value="${escapeHtml(st.desc)}" placeholder="Техническое пояснение (ПУЭ / ГОСТ)">
        </div>
      `;
    }).join('');
  }

  function loadConfigToForm() {
    workingConfig = window.Store.getConfig();
    const b = workingConfig.brand;
    const c = workingConfig.contacts;

    setVal('b-theme', b.defaultTheme || 'cyber');
    setVal('b-name', b.name);
    setVal('b-master', b.masterName);
    setVal('b-city', b.city);
    setVal('b-region', b.region);
    setVal('b-tagline', b.tagline);
    setVal('b-herolead', b.heroLead || '');
    setVal('b-herobadge', b.heroVisualBadge || '⚡ ТЕХНИЧЕСКИЙ РЕГЛАМЕНТ МОНТАЖА');
    setVal('b-herostatus', b.heroVisualStatus || '● Допуск IV группы до 1000В');
    setVal('b-herocaption', b.heroVisualCaption || '');
    setVal('b-districts', b.districts);
    setVal('b-schedule', b.schedule);
    setVal('b-exp', b.experienceYears);
    setVal('b-war', b.warrantyYears);
    setVal('b-arr', b.arrivalTime);
    setVal('b-norm', b.normative);
    setVal('b-minorder', b.minOrder);
    setVal('b-urgent', b.urgentMultiplier !== undefined ? b.urgentMultiplier : 30);

    renderHeroStandardsEditor();
    updateHeroPhotoStatus();

    setVal('c-phone', c.phone);
    setVal('c-email', c.email);
    setVal('c-tg', c.telegram);
    setVal('c-wa', c.whatsapp);
    setVal('c-max', c.max);
    setVal('c-vk', c.vk);
    setVal('c-bot-token', c.tgBotToken || '');
    setVal('c-chat-id', c.tgChatId || '');

    setVal('set-new-pass', workingConfig.adminPassword || 'admin');
    setVal('cloud-api-key', window.Store.decodeToken((workingConfig.cloud && workingConfig.cloud.apiKey) || ''));
    setVal('cloud-bin-id', (workingConfig.cloud && workingConfig.cloud.binId) || '');

    renderServicesEditor();
    renderMaterialsEditor();
    renderCasesEditor();
    renderStepsEditor();
    renderFaqsEditor();
    renderReviewsEditor();
    renderRequestsTable();
  }

  function renderServicesEditor() {
    const box = document.getElementById('admin-services-list');
    const icons = [
      { v: 'cable', l: 'Кабель / Проводка' },
      { v: 'socket', l: 'Розетка' },
      { v: 'switch', l: 'Выключатель' },
      { v: 'lamp', l: 'Светильник / Люстра' },
      { v: 'shield', l: 'Электрощит' },
      { v: 'drill', l: 'Штробление' },
      { v: 'search', l: 'Диагностика / КЗ' },
      { v: 'stove', l: 'Силовая техника' }
    ];

    box.innerHTML = (workingConfig.services || []).map(function (s, idx) {
      const opts = icons.map(function (ic) {
        return `<option value="${ic.v}" ${s.icon === ic.v ? 'selected' : ''}>${ic.l}</option>`;
      }).join('');
      return `
        <div class="card-box" style="background:var(--input-bg);padding:14px;">
          <div style="display:grid;grid-template-columns:2fr 90px 120px 170px auto;gap:8px;align-items:center;margin-bottom:8px;">
            <input type="text" class="input js-srv-name" data-idx="${idx}" value="${escapeHtml(s.name)}" placeholder="Название услуги">
            <input type="text" class="input js-srv-unit" data-idx="${idx}" value="${escapeHtml(s.unit)}" placeholder="Ед.">
            <input type="number" class="input js-srv-price" data-idx="${idx}" value="${Number(s.price) || 0}" placeholder="Цена ₽">
            <select class="input js-srv-icon" data-idx="${idx}">${opts}</select>
            <button type="button" class="btn btn-outline js-del-srv" data-idx="${idx}" style="padding:8px 12px;color:var(--danger);">✕</button>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
            <input type="text" class="input js-srv-desc" data-idx="${idx}" value="${escapeHtml(s.desc || '')}" placeholder="Короткое описание услуги внутри карточки" style="flex:1 1 260px;">
            <label style="display:inline-flex;align-items:center;gap:6px;font-size:0.84rem;color:var(--text-muted);cursor:pointer;">
              <input type="checkbox" class="js-srv-active" data-idx="${idx}" ${s.active !== false ? 'checked' : ''} style="accent-color:var(--accent);width:16px;height:16px;">
              Показывать
            </label>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderMaterialsEditor() {
    const box = document.getElementById('admin-materials-list');
    box.innerHTML = (workingConfig.materials || []).map(function (m, idx) {
      return `
        <div style="display:grid;grid-template-columns:2fr 90px 110px auto;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid var(--border-subtle);">
          <input type="text" class="input js-mat-name" data-idx="${idx}" value="${escapeHtml(m.name)}" placeholder="Материал">
          <input type="text" class="input js-mat-unit" data-idx="${idx}" value="${escapeHtml(m.unit)}" placeholder="Ед.">
          <input type="number" class="input js-mat-price" data-idx="${idx}" value="${Number(m.price) || 0}" placeholder="Цена ₽">
          <button type="button" class="btn btn-outline js-del-mat" data-idx="${idx}" style="padding:8px 12px;color:var(--danger);">✕</button>
        </div>
      `;
    }).join('');
  }

  function renderCasesEditor() {
    const box = document.getElementById('admin-cases-list');
    box.innerHTML = (workingConfig.cases || []).map(function (c, idx) {
      return `
        <div class="card-box" style="background:var(--input-bg);padding:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px;">
            <strong style="color:var(--accent);">Инженерный паспорт объекта #${idx + 1}</strong>
            <button type="button" class="btn btn-outline js-del-case" data-idx="${idx}" style="min-height:32px;padding:4px 10px;font-size:0.78rem;color:var(--danger);">Удалить объект</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;margin-bottom:10px;">
            <div>
              <label style="font-size:0.76rem;color:var(--text-muted);">Заголовок задачи</label>
              <input type="text" class="input js-case-title" data-idx="${idx}" value="${escapeHtml(c.title)}" placeholder="Заголовок кейса">
            </div>
            <div>
              <label style="font-size:0.76rem;color:var(--text-muted);">Бейдж объекта (в шапке карточки)</label>
              <input type="text" class="input js-case-tag" data-idx="${idx}" value="${escapeHtml(c.tag || '')}" placeholder="Напр. Коттедж • 380В / 15 кВт">
            </div>
            <div>
              <label style="font-size:0.76rem;color:var(--text-muted);">Плашка комплектации / защиты</label>
              <input type="text" class="input js-case-spec" data-idx="${idx}" value="${escapeHtml(c.spec || '')}" placeholder="Напр. Ввод 3P • 3×РКН 63А • ВДТ тип А">
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-bottom:10px;">
            <div>
              <label style="font-size:0.76rem;color:var(--text-muted);">Срок выполнения</label>
              <input type="text" class="input js-case-dur" data-idx="${idx}" value="${escapeHtml(c.duration)}" placeholder="Срок (напр. 2 рабочих дня)">
            </div>
            <div>
              <label style="font-size:0.76rem;color:var(--text-muted);">Итоговая стоимость работ</label>
              <input type="text" class="input js-case-cost" data-idx="${idx}" value="${escapeHtml(c.cost)}" placeholder="Стоимость (напр. 38 500 ₽)">
            </div>
          </div>
          <div>
            <label style="font-size:0.76rem;color:var(--text-muted);">Пункты выполненных работ (разделяйте точкой с запятой «;» для красивого списка с галочками ✓)</label>
            <textarea class="textarea js-case-done" data-idx="${idx}" rows="3" placeholder="Пункт 1; Пункт 2; Пункт 3">${escapeHtml(c.done)}</textarea>
          </div>
          <div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:12px;">
            <label class="btn btn-outline" style="min-height:36px;padding:6px 12px;font-size:0.82rem;cursor:pointer;">
              📷 Прикрепить реальное фото объекта (необязательно)
              <input type="file" accept="image/*" class="js-case-photo" data-idx="${idx}" style="display:none;">
            </label>
            ${c.customPhoto
              ? `<button type="button" class="btn btn-outline js-clear-photo" data-idx="${idx}" style="min-height:36px;padding:6px 12px;font-size:0.82rem;">Убрать фото</button><span style="color:var(--success);font-size:0.8rem;">✓ Прикреплено реальное фото</span>`
              : `<span style="color:var(--text-muted);font-size:0.8rem;">Отображается как строгий инженерный паспорт без картинки</span>`}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderStepsEditor() {
    const box = document.getElementById('admin-steps-list');
    if (!box) return;
    box.innerHTML = (workingConfig.steps || []).map(function (st, idx) {
      return `
        <div style="display:grid;grid-template-columns:60px 1fr 2fr auto;gap:8px;align-items:center;background:var(--input-bg);padding:10px;border-radius:10px;border:1px solid var(--border-subtle);">
          <input type="text" class="input js-step-num" data-idx="${idx}" value="${escapeHtml(st.num || (idx + 1))}" placeholder="№">
          <input type="text" class="input js-step-title" data-idx="${idx}" value="${escapeHtml(st.title)}" placeholder="Заголовок шага">
          <input type="text" class="input js-step-desc" data-idx="${idx}" value="${escapeHtml(st.desc)}" placeholder="Описание этапа">
          <button type="button" class="btn btn-outline js-del-step" data-idx="${idx}" style="padding:8px 12px;color:var(--danger);">✕</button>
        </div>
      `;
    }).join('');
  }

  function renderFaqsEditor() {
    const box = document.getElementById('admin-faqs-list');
    if (!box) return;
    box.innerHTML = (workingConfig.faqs || []).map(function (f, idx) {
      return `
        <div class="card-box" style="background:var(--input-bg);padding:14px;">
          <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:8px;">
            <input type="text" class="input js-faq-q" data-idx="${idx}" value="${escapeHtml(f.q)}" placeholder="Вопрос клиента">
            <button type="button" class="btn btn-outline js-del-faq" data-idx="${idx}" style="padding:8px 12px;color:var(--danger);">✕</button>
          </div>
          <textarea class="textarea js-faq-a" data-idx="${idx}" rows="2" placeholder="Ответ мастера">${escapeHtml(f.a)}</textarea>
        </div>
      `;
    }).join('');
  }

  function renderReviewsEditor() {
    const box = document.getElementById('admin-reviews-list');
    const reviews = workingConfig.reviews || [];
    box.innerHTML = reviews.map(function (r) {
      return `
        <div class="card-box" style="background:var(--input-bg);padding:14px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
          <div>
            <strong>${escapeHtml(r.name)}</strong> (${escapeHtml(r.district)} • ${escapeHtml(r.service || 'Электромонтаж')}) — <span style="color:var(--accent);">★ ${r.rating}</span>
            <span style="font-size:0.76rem;color:var(--text-muted);margin-left:6px;">${escapeHtml(r.date || '')}</span>
            <span style="font-size:0.78rem;margin-left:8px;padding:2px 8px;border-radius:99px;background:${r.approved ? 'rgba(16,185,129,0.2)' : 'rgba(255,197,61,0.2)'};">
              ${r.approved ? 'Опубликован' : 'На модерации'}
            </span>
            <p style="font-size:0.88rem;color:var(--text-muted);margin-top:6px;">${escapeHtml(r.text)}</p>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0;">
            ${!r.approved ? `<button type="button" class="btn btn-primary js-rev-approve" data-id="${escapeHtml(r.id)}" style="min-height:34px;padding:4px 10px;font-size:0.8rem;">Одобрить</button>` : ''}
            <button type="button" class="btn btn-outline js-rev-del" data-id="${escapeHtml(r.id)}" style="min-height:34px;padding:4px 10px;font-size:0.8rem;color:var(--danger);">Удалить</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderRequestsTable() {
    const box = document.getElementById('admin-requests-list');
    const list = window.Store.getRequests();
    if (list.length === 0) {
      box.innerHTML = `<p style="color:var(--text-muted);">Заявок пока нет.</p>`;
      return;
    }
    box.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr><th>Дата</th><th>Клиент</th><th>Телефон</th><th>Канал</th><th>Комментарий / Смета</th></tr>
        </thead>
        <tbody>
          ${list.map(function (r) {
            return `
              <tr>
                <td>${escapeHtml(r.createdAt)}</td>
                <td><strong>${escapeHtml(r.name)}</strong></td>
                <td><a href="tel:${escapeHtml(r.phone)}" style="color:var(--accent);">${escapeHtml(r.phone)}</a></td>
                <td>${escapeHtml(r.channel)}</td>
                <td style="white-space:pre-wrap;font-size:0.82rem;">${escapeHtml(r.comment)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  function collectAndSave() {
    const chosenDefaultTheme = getVal('b-theme') || 'cyber';
    workingConfig.brand.defaultTheme = chosenDefaultTheme;
    window.Store.setActiveTheme(chosenDefaultTheme);
    syncAdminThemeButtons();

    workingConfig.brand.name = getVal('b-name') || 'ЭлектроПрофи';
    workingConfig.brand.masterName = getVal('b-master');
    workingConfig.brand.city = getVal('b-city');
    workingConfig.brand.region = getVal('b-region');
    workingConfig.brand.tagline = getVal('b-tagline');
    workingConfig.brand.heroLead = getVal('b-herolead');
    workingConfig.brand.heroVisualBadge = getVal('b-herobadge');
    workingConfig.brand.heroVisualStatus = getVal('b-herostatus');
    workingConfig.brand.heroVisualCaption = getVal('b-herocaption');
    workingConfig.brand.districts = getVal('b-districts');
    workingConfig.brand.schedule = getVal('b-schedule');
    workingConfig.brand.experienceYears = getVal('b-exp');
    workingConfig.brand.warrantyYears = getVal('b-war');
    workingConfig.brand.arrivalTime = getVal('b-arr');
    workingConfig.brand.normative = getVal('b-norm');
    workingConfig.brand.minOrder = Number(getVal('b-minorder')) || 2500;
    workingConfig.brand.urgentMultiplier = Number(getVal('b-urgent')) || 30;

    document.querySelectorAll('.js-hstd-title').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.brand.heroStandards[i]) workingConfig.brand.heroStandards[i].title = el.value.trim();
    });
    document.querySelectorAll('.js-hstd-desc').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.brand.heroStandards[i]) workingConfig.brand.heroStandards[i].desc = el.value.trim();
    });

    workingConfig.contacts.phone = getVal('c-phone');
    workingConfig.contacts.phoneClean = '+' + getVal('c-phone').replace(/\D/g, '');
    workingConfig.contacts.email = getVal('c-email');
    workingConfig.contacts.telegram = getVal('c-tg');
    workingConfig.contacts.whatsapp = getVal('c-wa');
    workingConfig.contacts.max = getVal('c-max');
    workingConfig.contacts.vk = getVal('c-vk');
    workingConfig.contacts.tgBotToken = getVal('c-bot-token');
    workingConfig.contacts.tgChatId = getVal('c-chat-id');

    const newPass = getVal('set-new-pass');
    if (newPass) workingConfig.adminPassword = newPass;

    workingConfig.cloud = {
      provider: 'gist',
      apiKey: getVal('cloud-api-key'),
      binId: getVal('cloud-bin-id')
    };

    document.querySelectorAll('.js-srv-name').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.services[i]) workingConfig.services[i].name = el.value.trim();
    });
    document.querySelectorAll('.js-srv-unit').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.services[i]) workingConfig.services[i].unit = el.value.trim();
    });
    document.querySelectorAll('.js-srv-price').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.services[i]) workingConfig.services[i].price = Number(el.value) || 0;
    });
    document.querySelectorAll('.js-srv-icon').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.services[i]) workingConfig.services[i].icon = el.value;
    });
    document.querySelectorAll('.js-srv-desc').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.services[i]) workingConfig.services[i].desc = el.value.trim();
    });
    document.querySelectorAll('.js-srv-active').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.services[i]) workingConfig.services[i].active = el.checked;
    });

    document.querySelectorAll('.js-mat-name').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.materials[i]) workingConfig.materials[i].name = el.value.trim();
    });
    document.querySelectorAll('.js-mat-unit').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.materials[i]) workingConfig.materials[i].unit = el.value.trim();
    });
    document.querySelectorAll('.js-mat-price').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.materials[i]) workingConfig.materials[i].price = Number(el.value) || 0;
    });

    document.querySelectorAll('.js-case-title').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.cases[i]) workingConfig.cases[i].title = el.value.trim();
    });
    document.querySelectorAll('.js-case-tag').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.cases[i]) workingConfig.cases[i].tag = el.value.trim();
    });
    document.querySelectorAll('.js-case-spec').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.cases[i]) workingConfig.cases[i].spec = el.value.trim();
    });
    document.querySelectorAll('.js-case-dur').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.cases[i]) workingConfig.cases[i].duration = el.value.trim();
    });
    document.querySelectorAll('.js-case-cost').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.cases[i]) workingConfig.cases[i].cost = el.value.trim();
    });
    document.querySelectorAll('.js-case-done').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.cases[i]) workingConfig.cases[i].done = el.value.trim();
    });

    document.querySelectorAll('.js-step-num').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.steps[i]) workingConfig.steps[i].num = el.value.trim();
    });
    document.querySelectorAll('.js-step-title').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.steps[i]) workingConfig.steps[i].title = el.value.trim();
    });
    document.querySelectorAll('.js-step-desc').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.steps[i]) workingConfig.steps[i].desc = el.value.trim();
    });

    document.querySelectorAll('.js-faq-q').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.faqs[i]) workingConfig.faqs[i].q = el.value.trim();
    });
    document.querySelectorAll('.js-faq-a').forEach(function (el) {
      const i = Number(el.getAttribute('data-idx'));
      if (workingConfig.faqs[i]) workingConfig.faqs[i].a = el.value.trim();
    });

    window.Store.saveConfig(workingConfig);
    showToast('✓ Все изменения и тема сохранены в облаке!');
  }

  function compressImageFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = new Image();
      img.onload = function () {
        const maxSide = 1200;
        let w = img.width;
        let h = img.height;
        if (w > maxSide || h > maxSide) {
          if (w > h) { h = Math.round((h * maxSide) / w); w = maxSide; }
          else { w = Math.round((w * maxSide) / h); h = maxSide; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL('image/jpeg', 0.76));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function downloadReadyStoreJs() {
    collectAndSave();
    const jsContent = window.Store.generateReadyStoreJsContent();
    const blob = new Blob([jsContent], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'store.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Файл store.js скачан! Замените им старый файл в VS Code.');
  }

  document.addEventListener('DOMContentLoaded', function () {
    checkAuth();

    // Быстрое переключение темы в шапке админки и селекте
    document.addEventListener('click', function (e) {
      const tBtn = e.target.closest('.js-admin-theme-btn');
      if (tBtn) {
        const chosen = tBtn.getAttribute('data-set-theme');
        window.Store.setActiveTheme(chosen);
        setVal('b-theme', chosen);
        syncAdminThemeButtons();
        showToast('Включён предпросмотр темы: ' + chosen);
      }
    });

    const themeSelect = document.getElementById('b-theme');
    if (themeSelect) {
      themeSelect.addEventListener('change', function () {
        window.Store.setActiveTheme(themeSelect.value);
        syncAdminThemeButtons();
      });
    }

    document.getElementById('login-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const pass = document.getElementById('admin-pass-input').value;
      const actualPass = window.Store.getConfig().adminPassword || 'admin';
      if (pass === actualPass) {
        sessionStorage.setItem(SESSION_KEY, '1');
        document.getElementById('login-error').textContent = '';
        checkAuth();
      } else {
        document.getElementById('login-error').textContent = 'Неверный пароль';
      }
    });

    document.getElementById('admin-logout-btn').addEventListener('click', function () {
      sessionStorage.removeItem(SESSION_KEY);
      checkAuth();
    });

    document.querySelectorAll('.admin-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.admin-tab-btn').forEach(function (b) { b.classList.remove('active'); });
        document.querySelectorAll('.admin-tab-pane').forEach(function (p) { p.classList.add('is-hidden'); });
        btn.classList.add('active');
        document.getElementById(btn.getAttribute('data-tab')).classList.remove('is-hidden');
      });
    });

    document.querySelectorAll('.js-save-all').forEach(function (btn) {
      btn.addEventListener('click', collectAndSave);
    });

    const heroPhotoInput = document.getElementById('b-hero-photo-input');
    if (heroPhotoInput) {
      heroPhotoInput.addEventListener('change', function (e) {
        if (!e.target.files || !e.target.files[0]) return;
        compressImageFile(e.target.files[0], function (base64) {
          workingConfig.brand.heroCustomPhoto = base64;
          window.Store.saveConfig(workingConfig);
          updateHeroPhotoStatus();
          showToast('Фото первого экрана добавлено!');
        });
      });
    }

    const heroPhotoReset = document.getElementById('b-hero-photo-reset');
    if (heroPhotoReset) {
      heroPhotoReset.addEventListener('click', function () {
        workingConfig.brand.heroCustomPhoto = '';
        window.Store.saveConfig(workingConfig);
        updateHeroPhotoStatus();
        showToast('Фото убрано, отображается только Технический регламент');
      });
    }

    document.getElementById('add-service-btn').addEventListener('click', function () {
      workingConfig.services.push({
        id: 's_' + Date.now(),
        name: 'Новая услуга',
        unit: 'шт.',
        price: 700,
        icon: 'shield',
        active: true,
        desc: 'Профессиональное выполнение работ по стандарту ПУЭ-7.'
      });
      renderServicesEditor();
    });

    document.getElementById('add-material-btn').addEventListener('click', function () {
      workingConfig.materials.push({
        id: 'm_' + Date.now(),
        name: 'Новый материал',
        unit: 'шт.',
        price: 250,
        active: true
      });
      renderMaterialsEditor();
    });

    document.getElementById('add-case-btn').addEventListener('click', function () {
      workingConfig.cases.push({
        id: 'c_' + Date.now(),
        title: 'Новый выполненный объект',
        tag: 'Квартира • Электромонтаж',
        spec: 'ВВГнг(А)-LS ГОСТ • Опрессовка ГМЛ',
        done: 'Прокладка кабеля по потолку; Бурение подрозетников с пылесосом; Сборка щита с защитой',
        duration: '2 дня',
        cost: '25 000 ₽',
        customPhoto: ''
      });
      renderCasesEditor();
    });

    document.getElementById('add-step-btn').addEventListener('click', function () {
      const nextNum = String((workingConfig.steps || []).length + 1);
      workingConfig.steps.push({
        num: nextNum,
        title: 'Новый этап',
        desc: 'Описание действий мастера на этом этапе.'
      });
      renderStepsEditor();
    });

    document.getElementById('add-faq-btn').addEventListener('click', function () {
      workingConfig.faqs.push({
        q: 'Новый частый вопрос клиента?',
        a: 'Подробный и понятный ответ мастера.'
      });
      renderFaqsEditor();
    });

    document.getElementById('admin-add-review-btn').addEventListener('click', function () {
      const name = getVal('new-rev-name');
      const district = getVal('new-rev-district') || 'Город';
      const service = getVal('new-rev-service') || 'Электромонтаж';
      const date = getVal('new-rev-date');
      const rating = Number(getVal('new-rev-rating')) || 5;
      const text = getVal('new-rev-text');

      if (name.length < 2 || text.length < 5) {
        alert('Укажите имя клиента и текст отзыва');
        return;
      }

      window.Store.addReview({
        name: name,
        district: district,
        service: service,
        date: date,
        rating: rating,
        text: text,
        approved: true
      });

      setVal('new-rev-name', '');
      setVal('new-rev-district', '');
      setVal('new-rev-service', '');
      setVal('new-rev-date', '');
      setVal('new-rev-text', '');

      workingConfig = window.Store.getConfig();
      renderReviewsEditor();
      showToast('✓ Отзыв добавлен и опубликован!');
    });

    document.addEventListener('click', function (e) {
      const delSrv = e.target.closest('.js-del-srv');
      if (delSrv) {
        workingConfig.services.splice(Number(delSrv.getAttribute('data-idx')), 1);
        renderServicesEditor();
        return;
      }
      const delMat = e.target.closest('.js-del-mat');
      if (delMat) {
        workingConfig.materials.splice(Number(delMat.getAttribute('data-idx')), 1);
        renderMaterialsEditor();
        return;
      }
      const delCase = e.target.closest('.js-del-case');
      if (delCase) {
        workingConfig.cases.splice(Number(delCase.getAttribute('data-idx')), 1);
        renderCasesEditor();
        return;
      }
      const clearPhoto = e.target.closest('.js-clear-photo');
      if (clearPhoto) {
        workingConfig.cases[Number(clearPhoto.getAttribute('data-idx'))].customPhoto = '';
        window.Store.saveConfig(workingConfig);
        renderCasesEditor();
        return;
      }
      const delStep = e.target.closest('.js-del-step');
      if (delStep) {
        workingConfig.steps.splice(Number(delStep.getAttribute('data-idx')), 1);
        renderStepsEditor();
        return;
      }
      const delFaq = e.target.closest('.js-del-faq');
      if (delFaq) {
        workingConfig.faqs.splice(Number(delFaq.getAttribute('data-idx')), 1);
        renderFaqsEditor();
        return;
      }
      const revApp = e.target.closest('.js-rev-approve');
      if (revApp) {
        window.Store.approveReview(revApp.getAttribute('data-id'));
        workingConfig = window.Store.getConfig();
        renderReviewsEditor();
        showToast('Отзыв опубликован');
        return;
      }
      const revDel = e.target.closest('.js-rev-del');
      if (revDel) {
        window.Store.deleteReview(revDel.getAttribute('data-id'));
        workingConfig = window.Store.getConfig();
        renderReviewsEditor();
        showToast('Отзыв удалён');
      }
    });

    document.addEventListener('change', function (e) {
      if (e.target.classList.contains('js-case-photo') && e.target.files[0]) {
        const idx = Number(e.target.getAttribute('data-idx'));
        compressImageFile(e.target.files[0], function (base64) {
          workingConfig.cases[idx].customPhoto = base64;
          window.Store.saveConfig(workingConfig);
          renderCasesEditor();
          showToast('Реальное фото объекта сжато и сохранено');
        });
      }
    });

    document.getElementById('download-store-js-btn').addEventListener('click', downloadReadyStoreJs);
    document.getElementById('download-store-js-top').addEventListener('click', downloadReadyStoreJs);

    document.getElementById('export-json-btn').addEventListener('click', function () {
      collectAndSave();
      const blob = new Blob([window.Store.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'electro-config.json';
      a.click();
    });

    document.getElementById('import-json-input').addEventListener('change', function (e) {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = function (ev) {
        try {
          window.Store.importJSON(ev.target.result);
          loadConfigToForm();
          showToast('Конфигурация успешно загружена!');
        } catch (err) {
          alert('Ошибка в файле JSON');
        }
      };
      r.readAsText(f);
    });

    document.getElementById('refresh-cloud-requests-btn').addEventListener('click', function () {
      window.Store.pullFromCloud().then(function (ok) {
        loadConfigToForm();
        showToast(ok ? '✓ Данные синхронизированы из облака' : 'Локальные данные актуальны');
      });
    });

    document.getElementById('clear-requests-btn').addEventListener('click', function () {
      window.Store.clearRequests();
      renderRequestsTable();
      showToast('Список заявок очищен');
    });

    document.getElementById('reset-factory-btn').addEventListener('click', function () {
      if (confirm('Сбросить все настройки к заводским значениям по умолчанию?')) {
        window.Store.resetConfig();
        loadConfigToForm();
        showToast('Настройки сброшены к заводским');
      }
    });

    const createBinBtn = document.getElementById('create-cloud-bin-btn');
    if (createBinBtn) {
      createBinBtn.addEventListener('click', function () {
        const token = getVal('cloud-api-key');
        if (!token) {
          alert('Сначала вставьте GitHub Token (ghp_...) в первое поле');
          return;
        }
        createBinBtn.textContent = 'Создание базы на GitHub...';
        collectAndSave();

        const copyForCloud = JSON.parse(JSON.stringify(workingConfig));
        if (copyForCloud.cloud) copyForCloud.cloud.apiKey = '';

        fetch('https://api.github.com/gists', {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            description: 'ElectroProfi Cloud Config (' + (workingConfig.brand.name || '') + ')',
            public: false,
            files: {
              'electro_config.json': {
                content: JSON.stringify({
                  config: copyForCloud,
                  requests: window.Store.getRequests()
                }, null, 2)
              }
            }
          })
        })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            createBinBtn.textContent = '☁ Создать новую облачную базу в 1 клик';
            if (data && data.id) {
              setVal('cloud-bin-id', data.id);
              collectAndSave();
              showToast('✓ Облачная база GitHub создана! ID: ' + data.id);
            } else {
              alert('Ошибка создания Gist. Проверьте правильность токена ghp_ и наличие галочки gist.');
            }
          })
          .catch(function () {
            createBinBtn.textContent = '☁ Создать новую облачную базу в 1 клик';
            alert('Ошибка соединения с api.github.com');
          });
      });
    }
  });
})();