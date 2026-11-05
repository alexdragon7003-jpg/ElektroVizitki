/**
 * store.js — Сгенерировано в панели управления сайта "ЭлектроПрофи".
 * Дата: 05.11.2026, 20:17:52
 * Включает 3 темы оформления и облачную синхронизацию GitHub Gist.
 */
(function (window) {
  'use strict';
  const STORAGE_KEY = 'electro_pro_config_v1';
  const REQUESTS_KEY = 'electro_pro_requests_v1';
  const THEME_KEY = 'electro_pro_user_theme_v1';
  const CHANNEL_NAME = 'electro_pro_sync_channel';
  const DEFAULT_CONFIG = {
  "cloud": {
    "provider": "gist",
    "binId": "0ad0938b127beb5081fea3d7b1812fde",
    "apiKey": "b64:YWRtaW4="
  },
  "brand": {
    "name": "ЭлектроПрофи",
    "masterName": "Алексей Громов",
    "city": "Екатеринбург",
    "region": "Екатеринбург и пригород (до 30 км)",
    "districts": "Академический, ВИЗ, Центр, Ботаника, Уралмаш, Солнечный, Втузгородок",
    "tagline": "Инженерный электромонтаж без пыли с гарантией 5 лет по договору",
    "heroLead": "Работаю без посредников и накруток диспетчеров: от срочного поиска короткого замыкания до полной сборки щитов и разводки в новостройках.",
    "heroVisualBadge": "⚡ ТЕХНИЧЕСКИЙ РЕГЛАМЕНТ МОНТАЖА",
    "heroVisualStatus": "● Допуск IV группы до 1000В",
    "heroVisualCaption": "Никаких скруток и дешёвого кабеля ТУ — монтаж строго по ПУЭ-7, ГОСТ Р 50571 и проекту.",
    "heroCustomPhoto": "",
    "defaultTheme": "cyber",
    "heroStandards": [
      {
        "title": "Кабельные трассы по ГОСТ",
        "desc": "Кабель ВВГнг(А)-LS (Кольчугино / Севкабель), прокладка строго по вертикали и горизонтали по лазерному нивелиру."
      },
      {
        "title": "Опрессовка гильзами ГМЛ",
        "desc": "Все соединения в распределительных коробках — только опрессовкой медными гильзами ГМЛ-П с клеевой термоусадкой."
      },
      {
        "title": "Инженерная сборка щитов",
        "desc": "Реле контроля напряжения по каждой фазе, селективное УЗО, дифзащита 30мА/10мА типа «А» на мокрые зоны, гребёнки и НШВИ."
      },
      {
        "title": "Алмазное бурение без пыли",
        "desc": "Резка штроб и высверливание подрозетников 68 мм с промышленным пылесосом. Сдача фото-схем скрытых трасс с размерами."
      }
    ],
    "schedule": "Ежедневно с 08:00 до 22:00 (аварийный выезд — 24/7)",
    "experienceYears": "12 лет",
    "warrantyYears": "5 лет",
    "arrivalTime": "от 45 мин",
    "normative": "ПУЭ-7 и ГОСТ",
    "minOrder": 2500,
    "urgentMultiplier": 30,
    "heroSubtitle": "Работаю без посредников и накруток диспетчеров: от срочного поиска короткого замыкания до полной сборки щитов и разводки в новостройках.",
    "heroCardCaption": "Опрессовка гильзами ГМЛ, селективная защита УЗО, реле контроля напряжения и штробление с промышленным пылесосом."
  },
  "contacts": {
    "phone": "+7 (912) 345-67-89",
    "phoneClean": "+79123456789",
    "telegram": "https://t.me/electro_master_rf",
    "whatsapp": "https://wa.me/79123456789",
    "max": "https://max.ru/electro_master_rf",
    "vk": "https://vk.com/electro_master_rf",
    "email": "master@electro-profi.ru",
    "tgBotToken": "",
    "tgChatId": ""
  },
  "seo": {
    "titleTemplate": "Электромонтаж в г. {city} — Частный мастер {brandName}",
    "description": "Услуги частного электрика с допуском IV группы. Сборка электрощитов, полная замена проводки без пыли, поиск КЗ. Честный калькулятор цен онлайн."
  },
  "adminPassword": "admin",
  "services": [
    {
      "id": "s1",
      "name": "Прокладка кабеля (ВВГнг-LS)",
      "unit": "м.п.",
      "price": 180,
      "icon": "cable",
      "active": true,
      "desc": "Монтаж силового кабеля по потолку или в гофре с креплением клипсами/площадками."
    },
    {
      "id": "s2",
      "name": "Установка подрозетника и механизма розетки",
      "unit": "шт.",
      "price": 650,
      "icon": "socket",
      "active": true,
      "desc": "Алмазное бурение с пылесосом, вмазка подрозетника и чистовое подключение."
    },
    {
      "id": "s3",
      "name": "Монтаж выключателя / переключателя",
      "unit": "шт.",
      "price": 600,
      "icon": "switch",
      "active": true,
      "desc": "Установка одно-, двухклавишных и проходных выключателей света."
    },
    {
      "id": "s4",
      "name": "Установка светильников и люстр",
      "unit": "шт.",
      "price": 900,
      "icon": "lamp",
      "active": true,
      "desc": "Монтаж точечных светильников, трековых систем, бра и сборка потолочных люстр."
    },
    {
      "id": "s5",
      "name": "Профессиональная сборка электрощита",
      "unit": "модуль",
      "price": 550,
      "icon": "shield",
      "active": true,
      "desc": "Расключение автоматов, УЗО, реле напряжения с маркировкой каждой линии."
    },
    {
      "id": "s6",
      "name": "Штробление стен без пыли (с пылесосом)",
      "unit": "м.п.",
      "price": 450,
      "icon": "drill",
      "active": true,
      "desc": "Резка штроборезом со строительным пылесосом по бетону, кирпичу и газоблоку."
    },
    {
      "id": "s7",
      "name": "Поиск и устранение короткого замыкания",
      "unit": "услуга",
      "price": 3000,
      "icon": "search",
      "active": true,
      "desc": "Трассоискатель, тепловизор и мегаомметр. Локализация обрыва без вскрытия всех обоев."
    },
    {
      "id": "s8",
      "name": "Подключение варочной панели / духовки",
      "unit": "шт.",
      "price": 2200,
      "icon": "stove",
      "active": true,
      "desc": "Силовое подключение техники с обжимом наконечников НШВИ и проверкой заземления."
    }
  ],
  "materials": [
    {
      "id": "m1",
      "name": "Кабель силовой ВВГнг(А)-LS 3×2.5 (ГОСТ)",
      "unit": "м.п.",
      "price": 135,
      "active": true
    },
    {
      "id": "m2",
      "name": "Кабель освещения ВВГнг(А)-LS 3×1.5 (ГОСТ)",
      "unit": "м.п.",
      "price": 85,
      "active": true
    },
    {
      "id": "m3",
      "name": "Подрозетник глубокий 68×60 мм (усиленный)",
      "unit": "шт.",
      "price": 45,
      "active": true
    },
    {
      "id": "m4",
      "name": "Автоматический выключатель 1P 16A / 10A",
      "unit": "шт.",
      "price": 490,
      "active": true
    },
    {
      "id": "m5",
      "name": "Реле контроля напряжения с дисплеем 63А",
      "unit": "шт.",
      "price": 3600,
      "active": true
    },
    {
      "id": "m6",
      "name": "Гофра ПВХ с протяжкой + клипсы крепежа",
      "unit": "м.п.",
      "price": 40,
      "active": true
    }
  ],
  "cases": [
    {
      "id": "c1",
      "title": "Сборка трёхфазного щита на 48 модулей в коттедже",
      "tag": "Коттедж • 380В / 15 кВт",
      "spec": "Ввод 3P • 3×РКН 63А • ВДТ тип «А» • Кросс-модуль",
      "done": "Вводной автомат 3P и селективное противопожарное УЗО 100мА S; Три независимых реле контроля напряжения по каждой фазе; Распределение фаз через кросс-модуль с балансировкой нагрузок; Групповые УЗО 30мА (тип А) и отдельные линии на котёл, септик и скважину; Сборка многожильным проводом ПуГВ 6 мм² с опрессовкой НШВИ и печатной маркировкой",
      "duration": "2 рабочих дня",
      "cost": "38 500 ₽",
      "customPhoto": "",
      "svgKey": "shield3p"
    },
    {
      "id": "c2",
      "title": "Черновой электромонтаж в 2-комнатной новостройке (64 м²)",
      "tag": "Новостройка • 64 м² • Монолит-кирпич",
      "spec": "420 м ВВГнг(А)-LS ГОСТ • 58 подрозетников • Опрессовка ГМЛ",
      "done": "Прокладка 420 м кабеля ВВГнг(А)-LS (3×2.5 и 3×1.5 ГОСТ) по потолку строго под 90°; Алмазное высверливание 58 углублённых подрозетников 68×60 мм с пылесосом; Сборка распределительных коробок опрессовкой медными гильзами ГМЛ-П в клеевой термоусадке; Выделенные линии под варочную панель (3×6 мм²), духовой шкаф, ПММ, бойлер и 2 сплит-системы; Исполнительная фото-схема всех трасс с привязками к стенам",
      "duration": "5 рабочих дней",
      "cost": "94 000 ₽",
      "customPhoto": "",
      "svgKey": "apartmentWiring"
    },
    {
      "id": "c3",
      "title": "Подготовка электрики под кухонный гарнитур по проекту",
      "tag": "Кухня • По проекту мебельщиков",
      "spec": "Линия 3×6 мм² • 3 отдельных группы 3×2.5 мм² • Без скруток",
      "done": "Точная разметка осей по лазерному нивелиру согласно чертежу кухонного салона; Вывод кабеля ВВГнг(А)-LS 3×6 мм² в цоколь для индукционной варочной панели; Монтаж блока из 4 розеток на высоте 1100 мм над рабочей зоной фартука; Отдельные защищённые УЗО 30мА линии для посудомоечной машины, духовки и измельчителя; Чистое штробление без пыли с заделкой штроб и вмазкой подрозетников по уровню",
      "duration": "1 день (6 часов)",
      "cost": "14 800 ₽",
      "customPhoto": "",
      "svgKey": "kitchenPower"
    },
    {
      "id": "c4",
      "title": "Аварийный поиск обрыва нуля и замена сгоревших автоматов",
      "tag": "Аварийный выезд • Вторичный фонд",
      "spec": "Мегаомметр • Гильзовка ГМЛ • Замена автоматики",
      "done": "Локализация места перегрева и обрыва нулевого проводника в этажном и квартирном щитах; Проверка сопротивления изоляции линий мегаомметром (500В); Восстановление повреждённого соединения опрессовкой гильзами ГМЛ с термоусадкой; Замена старых изношенных автоматов на модульную автоматику 6кА с установкой шины N и PE на DIN-рейку; Проверка работы под полной нагрузкой и замер напряжения по группам",
      "duration": "2.5 часа",
      "cost": "5 500 ₽",
      "customPhoto": "",
      "svgKey": "emergencyFix"
    }
  ],
  "steps": [
    {
      "title": "Заявка и расчёт",
      "desc": "Обсуждаем задачу по телефону или в мессенджере, называю честную вилку цен.",
      "num": "1"
    },
    {
      "title": "Выезд и замер",
      "desc": "Осматриваю щит и стены, составляю точную смету работ и спецификацию материалов.",
      "num": "2"
    },
    {
      "title": "Договор",
      "desc": "Фиксируем итоговую стоимость и сроки на бумаге. Цена не меняется в процессе.",
      "num": "3"
    },
    {
      "title": "Комплектация",
      "desc": "Закупаю кабель ГОСТ и проверенную автоматику со скидкой или работаю с вашим материалом.",
      "num": "4"
    },
    {
      "title": "Чистый монтаж",
      "desc": "Штробление с пылесосом, опрессовка коробок гильзами, аккуратная сборка щита.",
      "num": "5"
    },
    {
      "title": "Проверка и гарантия",
      "desc": "Тестируем каждую линию под нагрузкой, передаю схему трасс и гарантию 5 лет.",
      "num": "6"
    }
  ],
  "reviews": [
    {
      "id": "r1",
      "name": "Дмитрий Ковалёв",
      "district": "р-н Академический",
      "service": "Полная разводка в двушке",
      "date": "14 февраля 2026",
      "rating": 5,
      "text": "Алексей делал всю черновую электрику в нашей новостройке. Главное, что поразило — идеальная чистота после штробления, реально работал с промышленным пылесосом. Все трассы ровные, сдал исполнительную схему с размерами до каждого кабеля.",
      "approved": true
    },
    {
      "id": "r2",
      "name": "Марина С.",
      "district": "р-н Ботаника",
      "service": "Переделка розеток под кухню",
      "date": "28 января 2026",
      "rating": 5,
      "text": "Мебельщики прислали схему розеток за три дня до установки гарнитура. Алексей выручил, приехал на следующий день, аккуратно перенёс 7 точек и вывел силовой кабель под варочную панель. Цена совпала с расчётом в калькуляторе.",
      "approved": true
    },
    {
      "id": "r3",
      "name": "Игорь Плотников",
      "district": "р-н ВИЗ",
      "service": "Сборка квартирного щита",
      "date": "09 марта 2026",
      "rating": 5,
      "text": "Вместо застройщицкого ужаса из трёх дешёвых автоматов собрал нормальный щит с реле напряжения и УЗО на ванную. Внутри всё уложено по линеечке, каждая группа подписана понятным языком. Рекомендую как грамотного инженера.",
      "approved": true
    },
    {
      "id": "r4",
      "name": "Елена Викторовна",
      "district": "Центр",
      "service": "Поиск короткого замыкания",
      "date": "19 декабря 2025",
      "rating": 5,
      "text": "Вечером пропал свет в половине квартиры и запахло горелым пластиком в коридоре. Мастер приехал за 50 минут, прибором нашёл скрутку под обоями, обжал гильзами и поставил нормальный автомат. Спасли от пожара!",
      "approved": true
    },
    {
      "id": "r5",
      "name": "Артём и Ксения",
      "district": "р-н Солнечный",
      "service": "Чистовая установка 45 точек",
      "date": "02 апреля 2026",
      "rating": 4,
      "text": "По качеству монтажа розеток, проходных выключателей и трековых светильников — твёрдая пятёрка, ни одной щели на обоях. Снял балл только за то, что из-за высокой загрузки приступил к работе на день позже, чем изначально планировали.",
      "approved": true
    },
    {
      "id": "r6",
      "name": "Сергей В.",
      "district": "р-н Уралмаш",
      "service": "Замена алюминиевой проводки",
      "date": "21 мая 2026",
      "rating": 5,
      "text": "Меняли старый советский алюминий в хрущёвке на медь ВВГнг-LS. Алексей сам закупил кабель ГОСТ по оптовой скидке, отчитался по каждому чеку. Договор и гарантийный талон на руках.",
      "approved": true
    },
    {
      "id": "r7",
      "name": "Ольга Романова",
      "district": "р-н Втузгородок",
      "service": "Подключение техники и бра",
      "date": "11 июля 2026",
      "rating": 5,
      "text": "Нужен был небольшой объём: подключить духовой шкаф, варочную панель и повесить две сложные люстры. Многие электрики отказывались от мелкого заказа, а Алексей приехал вовремя и сделал всё за два часа.",
      "approved": true
    },
    {
      "id": "r8",
      "name": "Константин Б.",
      "district": "КП Образцово",
      "service": "Щит ввода и заземление в доме",
      "date": "18 сентября 2026",
      "rating": 5,
      "text": "Забивали модульное штыревое заземление около дома и собирали трёхфазный щит с переключателем на бензогенератор. Замерили сопротивление контура прибором — всё уложилось в нормативы ПУЭ с запасом.",
      "approved": true
    }
  ],
  "faqs": [
    {
      "q": "Правда ли штробление проходит без пыли, или вся квартира будет в белом налёте?",
      "a": "Работаю профессиональным штроборезом и алмазной дрелью с прямым подключением к строительному пылесосу с автоочисткой фильтра. До 95% бетонной и кирпичной пыли сразу уходит в мешок пылесоса — можно работать даже в жилой квартире."
    },
    {
      "q": "Кто закупает кабель, автоматы и подрозетники?",
      "a": "На ваш выбор. Вы можете купить материалы сами по моему списку, либо я закажу проверенный кабель строго по ГОСТ (не заниженное сечение ТУ) и оригинальную автоматику у профильных поставщиков со своей скидкой и предоставлю все чеки."
    },
    {
      "q": "Изменится ли цена из онлайн-калькулятора в процессе работы?",
      "a": "Калькулятор считает по реальному прайсу с погрешностью ±15% на нюансы стен. Перед началом работ я фиксирую точную смету в договоре — в процессе монтажа стоимость не вырастет ни на рубль, если вы сами не добавите новые точки."
    },
    {
      "q": "Какую гарантию вы даёте и как она оформляется?",
      "a": "Заключаем официальный письменный договор. На все электромонтажные работы и собранные щиты действует гарантия 5 лет. Также вы получаете фото-схему скрытых трасс проводки, чтобы при монтаже мебели не пробить кабель."
    },
    {
      "q": "Как соединяются провода в распределительных коробках? Скрутки делаете?",
      "a": "Обычные скрутки запрещены правилами ПУЭ и опасны возгоранием. Все соединения выполняются только опрессовкой медными гильзами ГМЛ с помощью гидравлического пресса или сваркой, с изоляцией клеевой термоусадкой."
    },
    {
      "q": "Выезжаете ли вы на небольшие заказы (починить розетку, повесить люстру)?",
      "a": "Да, выезжаю. Единственное условие — действует порог минимального заказа (указан в калькуляторе), в который уже входит выезд и до 1.5–2 часов мелких электромонтажных работ."
    }
  ],
  "requests": []
};

  function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }
  const encodeToken = function encodeToken(str) {
    const s = (str || '').trim();
    if (!s) return '';
    if (s.indexOf('b64:') === 0) return s;
    try { return 'b64:' + btoa(unescape(encodeURIComponent(s))); } catch (e) { return s; }
  };
  const decodeToken = function decodeToken(str) {
    const s = (str || '').trim();
    if (!s) return '';
    if (s.indexOf('b64:') === 0) {
      try { return decodeURIComponent(escape(atob(s.slice(4)))); } catch (e) { return s.slice(4); }
    }
    return s;
  };
  const enrichConfig = function enrichConfig(saved) {
    const base = deepClone(DEFAULT_CONFIG);
    if (!saved || typeof saved !== 'object') return base;

    const merged = {
      ...base,
      ...saved,
      cloud: { ...base.cloud, ...(saved.cloud || {}) },
      brand: { ...base.brand, ...(saved.brand || {}) },
      contacts: { ...base.contacts, ...(saved.contacts || {}) },
      seo: { ...base.seo, ...(saved.seo || {}) }
    };

    merged.cloud.binId = (merged.cloud.binId || base.cloud.binId || '').trim();
    merged.cloud.apiKey = decodeToken(merged.cloud.apiKey || base.cloud.apiKey || '');

    if (!merged.brand.defaultTheme || ['cyber', 'fluke', 'outdoor'].indexOf(merged.brand.defaultTheme) === -1) {
      merged.brand.defaultTheme = 'cyber';
    }
    if (!Array.isArray(merged.brand.heroStandards) || merged.brand.heroStandards.length === 0) {
      merged.brand.heroStandards = deepClone(base.brand.heroStandards);
    }
    if (!Array.isArray(merged.steps) || merged.steps.length === 0) {
      merged.steps = deepClone(base.steps);
    }
    if (!Array.isArray(merged.faqs) || merged.faqs.length === 0) {
      merged.faqs = deepClone(base.faqs);
    }
    if (Array.isArray(merged.cases) && merged.cases.length > 0) {
      merged.cases = merged.cases.map(function (c, i) {
        const defCase = base.cases.find(function (d) { return d.id === c.id; }) || base.cases[i] || base.cases[0];
        return {
          ...defCase,
          ...c,
          tag: (c.tag && c.tag.trim()) ? c.tag : defCase.tag,
          spec: (c.spec && c.spec.trim()) ? c.spec : defCase.spec,
          done: (c.done && c.done.indexOf(';') !== -1) ? c.done : (defCase.id === c.id ? defCase.done : c.done)
        };
      });
    } else {
      merged.cases = deepClone(base.cases);
    }
    return merged;
  };

  let syncChannel = ('BroadcastChannel' in window) ? new BroadcastChannel(CHANNEL_NAME) : null;
  function notifyUpdate() {
    window.dispatchEvent(new CustomEvent('store:updated'));
    if (syncChannel) { try { syncChannel.postMessage({ type: 'store:updated' }); } catch (e) {} }
  }
  if (syncChannel) {
    syncChannel.onmessage = function (ev) {
      if (ev.data && ev.data.type === 'store:updated') window.dispatchEvent(new CustomEvent('store:updated'));
    };
  }
  window.addEventListener('storage', function (ev) {
    if (ev.key === STORAGE_KEY || ev.key === REQUESTS_KEY || ev.key === THEME_KEY) window.dispatchEvent(new CustomEvent('store:updated'));
  });

  window.Store = {
    encodeToken: encodeToken,
    decodeToken: decodeToken,
    getDefaultConfig: function () { return deepClone(DEFAULT_CONFIG); },
    getConfig: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return enrichConfig(null);
        return enrichConfig(JSON.parse(raw));
      } catch (e) { return enrichConfig(null); }
    },
    getActiveTheme: function () {
      try {
        const userTheme = localStorage.getItem(THEME_KEY);
        if (userTheme && ['cyber', 'fluke', 'outdoor'].indexOf(userTheme) !== -1) {
          return userTheme;
        }
      } catch (e) {}
      const cfg = this.getConfig();
      return (cfg.brand && cfg.brand.defaultTheme) || 'cyber';
    },
    setActiveTheme: function (themeName) {
      const valid = ['cyber', 'fluke', 'outdoor'].indexOf(themeName) !== -1 ? themeName : 'cyber';
      try {
        localStorage.setItem(THEME_KEY, valid);
      } catch (e) {}
      if (document && document.documentElement) {
        document.documentElement.setAttribute('data-theme', valid);
      }
      notifyUpdate();
      return valid;
    },
    clearUserThemeOverride: function () {
      try { localStorage.removeItem(THEME_KEY); } catch (e) {}
    },
    saveConfig: function (newConfig, skipCloud) {
      try {
        const clean = enrichConfig(newConfig);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
        notifyUpdate();
        if (!skipCloud && clean.cloud && clean.cloud.binId && clean.cloud.apiKey) {
          this.pushToCloud(clean);
        }
        return true;
      } catch (e) {
        console.error('Ошибка сохранения:', e);
        return false;
      }
    },
    pushToCloud: function (cfg) {
      const gistId = ((cfg.cloud && cfg.cloud.binId) || '').trim();
      const token = decodeToken((cfg.cloud && cfg.cloud.apiKey) || '');
      if (!gistId || !token) return Promise.resolve(false);

      const copyForCloud = deepClone(cfg);
      if (copyForCloud.cloud) copyForCloud.cloud.apiKey = '';

      const payload = {
        description: 'ElectroProfi Cloud Config (' + (cfg.brand && cfg.brand.name || '') + ')',
        files: {
          'electro_config.json': {
            content: JSON.stringify({
              config: copyForCloud,
              requests: this.getRequests()
            }, null, 2)
          }
        }
      };

      return fetch('https://api.github.com/gists/' + gistId, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.ok; }).catch(function () { return false; });
    },
    pullFromCloud: function () {
      const localCfg = this.getConfig();
      const gistId = ((localCfg.cloud && localCfg.cloud.binId) || DEFAULT_CONFIG.cloud.binId || '').trim();
      const token = decodeToken((localCfg.cloud && localCfg.cloud.apiKey) || DEFAULT_CONFIG.cloud.apiKey || '');
      if (!gistId) return Promise.resolve(false);

      const headers = { 'Accept': 'application/vnd.github+json' };
      if (token) headers['Authorization'] = 'Bearer ' + token;

      const self = this;
      return fetch('https://api.github.com/gists/' + gistId + '?t=' + Date.now(), {
        method: 'GET',
        headers: headers
      })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (gist) {
          if (!gist || !gist.files) return false;
          const fileObj = gist.files['electro_config.json'] || Object.values(gist.files)[0];
          if (!fileObj || !fileObj.content) return false;
          const parsed = JSON.parse(fileObj.content);
          const remoteCfg = parsed.config || parsed;
          if (remoteCfg && remoteCfg.brand) {
            remoteCfg.cloud = {
              provider: 'gist',
              binId: gistId,
              apiKey: token
            };
            self.saveConfig(remoteCfg, true);
            if (Array.isArray(parsed.requests) && parsed.requests.length > 0) {
              try {
                localStorage.setItem(REQUESTS_KEY, JSON.stringify(parsed.requests));
                notifyUpdate();
              } catch (e) {}
            }
            return true;
          }
          return false;
        })
        .catch(function () { return false; });
    },
    resetConfig: function () {
      const current = this.getConfig();
      const savedCloud = current.cloud || {};
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(THEME_KEY);
      } catch (e) {}
      const fresh = deepClone(DEFAULT_CONFIG);
      fresh.cloud = savedCloud;
      this.saveConfig(fresh, false);
      return fresh;
    },
    getRequests: function () {
      try { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]'); } catch (e) { return []; }
    },
    addRequest: function (req) {
      const list = this.getRequests();
      const item = {
        id: 'req_' + Date.now(),
        createdAt: new Date().toLocaleString('ru-RU'),
        name: req.name || 'Без имени',
        phone: req.phone || '',
        channel: req.channel || 'whatsapp',
        comment: req.comment || ''
      };
      list.unshift(item);
      try {
        localStorage.setItem(REQUESTS_KEY, JSON.stringify(list));
        notifyUpdate();
        const cfg = this.getConfig();
        if (cfg.cloud && cfg.cloud.binId && cfg.cloud.apiKey) {
          this.pushToCloud(cfg);
        }
      } catch (e) {}
      return item;
    },
    deleteRequest: function (id) {
      const list = this.getRequests().filter(function (r) { return r.id !== id; });
      try {
        localStorage.setItem(REQUESTS_KEY, JSON.stringify(list));
        notifyUpdate();
        const cfg = this.getConfig();
        if (cfg.cloud && cfg.cloud.binId && cfg.cloud.apiKey) this.pushToCloud(cfg);
      } catch (e) {}
    },
    clearRequests: function () {
      try {
        localStorage.removeItem(REQUESTS_KEY);
        notifyUpdate();
        const cfg = this.getConfig();
        if (cfg.cloud && cfg.cloud.binId && cfg.cloud.apiKey) this.pushToCloud(cfg);
      } catch (e) {}
    },
    getReviews: function (onlyApproved) {
      const all = this.getConfig().reviews || [];
      return onlyApproved ? all.filter(function (r) { return r.approved !== false; }) : all;
    },
    addReview: function (reviewObj) {
      const cfg = this.getConfig();
      const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
      const now = new Date();
      const item = {
        id: 'rev_' + Date.now(),
        name: (reviewObj.name || 'Клиент').trim(),
        district: (reviewObj.district || 'Город').trim(),
        service: (reviewObj.service || 'Электромонтаж').trim(),
        date: (reviewObj.date || (now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear())).trim(),
        rating: Math.min(5, Math.max(1, Number(reviewObj.rating) || 5)),
        text: (reviewObj.text || '').trim(),
        approved: reviewObj.approved === true
      };
      cfg.reviews.unshift(item);
      this.saveConfig(cfg);
      return item;
    },
    approveReview: function (id) {
      const cfg = this.getConfig();
      cfg.reviews = (cfg.reviews || []).map(function (r) {
        if (r.id === id) r.approved = true;
        return r;
      });
      this.saveConfig(cfg);
    },
    deleteReview: function (id) {
      const cfg = this.getConfig();
      cfg.reviews = (cfg.reviews || []).filter(function (r) { return r.id !== id; });
      this.saveConfig(cfg);
    },
    exportJSON: function () { return JSON.stringify(this.getConfig(), null, 2); },
    importJSON: function (str) { const p = JSON.parse(str); this.saveConfig(p); return p; },
    generateReadyStoreJsContent: function () {
      const currentConfig = this.getConfig();
      if (currentConfig.cloud && currentConfig.cloud.apiKey) {
        currentConfig.cloud.apiKey = encodeToken(currentConfig.cloud.apiKey);
      }
      const serializedConfig = JSON.stringify(currentConfig, null, 2);

      return `/**
 * store.js — Сгенерировано в панели управления сайта "${currentConfig.brand.name}".
 * Дата: ${new Date().toLocaleString('ru-RU')}
 * Включает 3 темы оформления и облачную синхронизацию GitHub Gist.
 */
(function (window) {
  'use strict';
  const STORAGE_KEY = '${STORAGE_KEY}';
  const REQUESTS_KEY = '${REQUESTS_KEY}';
  const THEME_KEY = '${THEME_KEY}';
  const CHANNEL_NAME = '${CHANNEL_NAME}';
  const DEFAULT_CONFIG = ${serializedConfig};

  function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }
  const encodeToken = ${encodeToken.toString()};
  const decodeToken = ${decodeToken.toString()};
  const enrichConfig = ${enrichConfig.toString()};

  let syncChannel = ('BroadcastChannel' in window) ? new BroadcastChannel(CHANNEL_NAME) : null;
  function notifyUpdate() {
    window.dispatchEvent(new CustomEvent('store:updated'));
    if (syncChannel) { try { syncChannel.postMessage({ type: 'store:updated' }); } catch (e) {} }
  }
  if (syncChannel) {
    syncChannel.onmessage = function (ev) {
      if (ev.data && ev.data.type === 'store:updated') window.dispatchEvent(new CustomEvent('store:updated'));
    };
  }
  window.addEventListener('storage', function (ev) {
    if (ev.key === STORAGE_KEY || ev.key === REQUESTS_KEY || ev.key === THEME_KEY) window.dispatchEvent(new CustomEvent('store:updated'));
  });

  window.Store = {
    encodeToken: encodeToken,
    decodeToken: decodeToken,
    getDefaultConfig: function () { return deepClone(DEFAULT_CONFIG); },
    getConfig: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return enrichConfig(null);
        return enrichConfig(JSON.parse(raw));
      } catch (e) { return enrichConfig(null); }
    },
    getActiveTheme: ${this.getActiveTheme.toString()},
    setActiveTheme: ${this.setActiveTheme.toString()},
    clearUserThemeOverride: ${this.clearUserThemeOverride.toString()},
    saveConfig: ${this.saveConfig.toString()},
    pushToCloud: ${this.pushToCloud.toString()},
    pullFromCloud: ${this.pullFromCloud.toString()},
    resetConfig: ${this.resetConfig.toString()},
    getRequests: ${this.getRequests.toString()},
    addRequest: ${this.addRequest.toString()},
    deleteRequest: ${this.deleteRequest.toString()},
    clearRequests: ${this.clearRequests.toString()},
    getReviews: ${this.getReviews.toString()},
    addReview: ${this.addReview.toString()},
    approveReview: ${this.approveReview.toString()},
    deleteReview: ${this.deleteReview.toString()},
    exportJSON: function () { return JSON.stringify(this.getConfig(), null, 2); },
    importJSON: function (str) { const p = JSON.parse(str); this.saveConfig(p); return p; },
    generateReadyStoreJsContent: ${this.generateReadyStoreJsContent.toString()}
  };

  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('data-theme', window.Store.getActiveTheme());
  }
  window.Store.pullFromCloud();
})(window);`;
    }
  };

  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('data-theme', window.Store.getActiveTheme());
  }
  window.Store.pullFromCloud();
})(window);