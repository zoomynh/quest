/* script.js — ПОВНИЙ ФАЙЛ (21042025 по 1 цифрі + внутрішні лінки/підказки)
   - Без пошуку показує всіх, КРІМ hidden
   - Квестова особа hidden:true => зʼявляється ТІЛЬКИ через пошук (наприклад zoomynh)
   - Досьє квестової locked:true => відкривається тільки кодом 21042025
   - 8 “носіїв” цифр мають:
       clueDigit: "2"..."5"
       links: [{label, query}]  // внутрішні лінки на інші досьє
       hint: "..."              // текстова підказка (може натякати що далі)
*/



const listEl = document.getElementById("list");
const dossierEl = document.getElementById("dossier");

/* ====== ЗНАЙДЕНІ ЦИФРИ ====== */
function getDigits() {
  try { return JSON.parse(localStorage.getItem("foundDigits") || "[]"); }
  catch { return []; }
}
function addDigit(d) {
  const arr = getDigits();
  arr.push(String(d));
  localStorage.setItem("foundDigits", JSON.stringify(arr));
}
function digitsString() {
  return getDigits().join("");
}
function resetDigits() {
  localStorage.setItem("foundDigits", "[]");
}

/* ====== ДАНІ ====== */
const people = [];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
const firstNamesM = ["Олександр","Андрій","Ігор","Дмитро","Сергій","Віталій","Максим","Роман","Євген","Олег"];
const firstNamesF = ["Олена","Ірина","Анна","Марія","Катерина","Наталія","Оксана","Юлія"];
const lastNames = ["Іваненко","Петренко","Шевченко","Ковальчук","Мельник","Бондар","Ткаченко","Кравченко","Романюк","Гриценко"];
const patronymicsM = ["Олександрович","Андрійович","Ігорович","Дмитрович","Сергійович","Віталійович","Максимович","Романович"];
const patronymicsF = ["Олександрівна","Андріївна","Ігорівна","Дмитрівна","Сергіївна","Віталіївна","Максимівна","Романівна"];
const ranks = ["Лейтенант","Старший лейтенант","Капітан","Майор"];
const positions = ["Аналітичний відділ","Оперативний відділ","Кібербезпека","Контррозвідка","Адміністративний відділ","Відділ зв’язку"];

// фонові (без підказок)
for (let i = 0; i < 210; i++) {
  const isFemale = Math.random() < 0.25;
  people.push({
    name: `${rand(lastNames)} ${isFemale ? rand(firstNamesF) : rand(firstNamesM)} ${isFemale ? rand(patronymicsF) : rand(patronymicsM)}`,
    callsign: "-",
    rank: rand(ranks),
    position: rand(positions),
    photo: "photos/default.jpg",
    notes: "Службова інформація",

    hidden: false,
    locked: false,
    accessKey: "",
    clueDigit: "",
    hint: "",
    links: []
  });
}

/* ====== НОСІЇ ЦИФР + ПІДКАЗКИ + ВНУТРІШНІ ЛІНКИ (цепочка) ======
   Логіка:
   1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8
   На кожному кроці:
   - є цифра коду
   - є підказка (hint)
   - є внутрішній лінк (links) який веде далі
*/

const carriers = [
  {
    name: "Ковальчук Олена Сергіївна",
    rank: "Капітан",
    position: "Відділ зв’язку",
    clueDigit: "2",
    hint: "В архіві згадується аналітик. Шукайте за прізвищем: Мельник.",
    links: [{ label: "Перехресний контакт: Мельник Дмитро", query: "Мельник Дмитро" }]
  },
  {
    name: "Мельник Дмитро Ігорович",
    rank: "Лейтенант",
    position: "Аналітичний відділ",
    clueDigit: "1",
    hint: "Є посилання на оперативника з позначкою «0». Прізвище: Шевченко.",
    links: [{ label: "Справa 0/оперативний: Шевченко Андрій", query: "Шевченко Андрій" }]
  },
  {
    name: "Шевченко Андрій Віталійович",
    rank: "Старший лейтенант",
    position: "Оперативний відділ",
    clueDigit: "0",
    hint: "Далі — контррозвідка. Пошук по імені: Ірина.",
    links: [{ label: "Напрямок: Контррозвідка (Ірина)", query: "Ірина" }]
  },
  {
    name: "Петренко Ірина Миколаївна",
    rank: "Лейтенант",
    position: "Контррозвідка",
    clueDigit: "4",
    hint: "Є згадка про кібербезпеку. Пошук: Максим.",
    links: [{ label: "Перехід: Кібербезпека (Максим)", query: "Максим" }]
  },
  {
    name: "Іваненко Максим Сергійович",
    rank: "Капітан",
    position: "Кібербезпека",
    clueDigit: "2",
    hint: "Наступний фрагмент у адмін-відділі. Прізвище: Бондар.",
    links: [{ label: "Запит до адмін-відділу: Бондар Олег", query: "Бондар Олег" }]
  },
  {
    name: "Бондар Олег Романович",
    rank: "Старший лейтенант",
    position: "Адміністративний відділ",
    clueDigit: "0",
    hint: "Потрібен ще один фрагмент у відділі зв’язку. Ім’я: Юлія.",
    links: [{ label: "Відділ зв’язку: Юлія", query: "Юлія" }]
  },
  {
    name: "Ткаченко Юлія Віталіївна",
    rank: "Лейтенант",
    position: "Відділ зв’язку",
    clueDigit: "2",
    hint: "Фінальний фрагмент у оперативному відділі. Прізвище: Кравченко.",
    links: [{ label: "Оперативний відділ: Кравченко Сергій", query: "Кравченко Сергій" }]
  },
  {
    name: "Кравченко Сергій Дмитрович",
    rank: "Капітан",
    position: "Оперативний відділ",
    clueDigit: "5",
    hint: "Код зібрано. Квестова особа не відображається у списку — шукайте через пошук за позивним: zoomynh.",
    links: [{ label: "Підказка: введіть у пошук «zoomynh»", query: "zoomynh" }]
  }
];

carriers.forEach(c => {
  people.push({
    name: c.name,
    callsign: "-",
    rank: c.rank,
    position: c.position,
    photo: "photos/default.jpg",
    notes: "Службова інформація",
    hidden: false,
    locked: false,
    accessKey: "",
    clueDigit: c.clueDigit,
    hint: c.hint,
    links: c.links
  });
});

/* ====== КВЕСТОВА ОСОБА ====== */
people.push({
  name: "Безшкурий Роман Віталійович",
  callsign: "zoomynh",
  rank: "Майор",
  position: "Невідомо",
  photo: "photos/roman.jpg",
  notes: "Інформація обмежена",

  hidden: true,
  locked: true,
  accessKey: "21042025",
  clueDigit: "",
  hint: "Введіть код доступу для розкриття досьє.",
  links: []
});

/* ====== ВНУТРІШНІ ПЕРЕХОДИ ПО ДОСЬЄ ====== */
function openByQuery(q) {
  const query = (q || "").toLowerCase().trim();
  if (!query) return;

  // шукаємо ПЕРШИЙ найкращий збіг
  const found = people.find(p =>
    (p.name || "").toLowerCase().includes(query) ||
    (p.callsign || "").toLowerCase().includes(query)
  );

  if (found) {
    showDossier(found);
  } else {
    alert("Не знайдено профіль за запитом: " + q);
  }
}

function renderLinks(p) {
  if (!p.links || !p.links.length) return "";

  let html = `<div class="dossier-note"><b>Внутрішні посилання:</b><br>`;
  p.links.forEach(l => {
    const safeQ = (l.query || "").replace(/'/g, "\\'");
    html += `<a href="#" onclick="openByQuery('${safeQ}'); return false;">• ${l.label}</a><br>`;
  });
  html += `</div>`;
  return html;
}

/* ====== РЕНДЕР СПИСКУ ====== */
function renderList(data) {
  listEl.innerHTML = "";

  if (!data.length) {
    listEl.innerHTML = `
      <div class="person-item">
        <div>Нічого не знайдено</div>
        <div class="meta">Спробуйте інший запит</div>
      </div>
    `;
    return;
  }

  data.forEach(p => {
    const item = document.createElement("div");
    item.className = "person-item";
    item.innerHTML = `
      <div>${p.name}</div>
      <div class="meta">${p.rank} • ${p.position}</div>
    `;
    item.onclick = () => showDossier(p);
    listEl.appendChild(item);
  });
}

/* ====== ДОСЬЄ ====== */
function showDossier(p) {
  const digitBlock = p.clueDigit
    ? `
      <div class="dossier-note">
        Службова примітка: цифра <b>${p.clueDigit}</b>
        <button class="mini-btn" onclick="saveDigit('${p.clueDigit}')">Зберегти</button>
      </div>
    `
    : "";

  const hintBlock = p.hint
    ? `<div class="dossier-note"><b>Підказка:</b><br>${p.hint}</div>`
    : "";

  // якщо квестова і locked — замок
  if (p.locked && digitsString() !== p.accessKey) {
    dossierEl.innerHTML = `
      <h2 class="dossier-title">${p.name}</h2>

      <div class="dossier-grid">
        <img class="dossier-photo" src="${p.photo}" alt="Фото">
        <div>
          <div class="dossier-line"><b>Звання:</b> ${p.rank}</div>
          <div class="dossier-line"><b>Посада:</b> ${p.position}</div>
          <div class="dossier-line"><b>Позивний:</b> ${p.callsign}</div>
          <div class="dossier-line"><b>Примітки:</b> ${p.notes}</div>

          <div class="lock-box">
            <div class="lock-title">⚠ Досьє засекречене</div>
            <div class="lock-text">Потрібен код доступу (8 цифр).</div>

            <input id="keyInput" class="key-input" placeholder="Введіть код">
            <button class="btn" onclick="tryUnlock('${p.accessKey}')">Підтвердити</button>

            <div class="found-keys">
              Знайдені цифри: <span id="digitsLine"></span>
              <button class="mini-btn" onclick="wipeDigits()">Скинути</button>
            </div>
          </div>
        </div>
      </div>

      ${hintBlock}
      ${digitBlock}
      ${renderLinks(p)}
    `;
    renderDigitsLine();
    return;
  }

  // звичайне / розблоковане
  dossierEl.innerHTML = `
    <h2 class="dossier-title">${p.name}</h2>

    <div class="dossier-grid">
      <img class="dossier-photo" src="${p.photo}" alt="Фото">
      <div>
        <div class="dossier-line"><b>Звання:</b> ${p.rank}</div>
        <div class="dossier-line"><b>Посада:</b> ${p.position}</div>
        <div class="dossier-line"><b>Позивний:</b> ${p.callsign}</div>
        <div class="dossier-line"><b>Примітки:</b> ${p.notes}</div>

        <div class="dossier-note">
          Дані з внутрішньої інформаційної системи. Рівень доступу обмежений.
        </div>
      </div>
    </div>

    ${hintBlock}
    ${digitBlock}
    ${renderLinks(p)}
  `;
}

/* ====== ДІЇ З ЦИФРАМИ ====== */
function saveDigit(d) {
  addDigit(d);
  alert("Збережено цифру: " + d);
  renderDigitsLine();
}

function renderDigitsLine() {
  const el = document.getElementById("digitsLine");
  if (!el) return;
  const str = digitsString();
  el.textContent = str.length ? str : "немає";
}

function wipeDigits() {
  resetDigits();
  renderDigitsLine();
}

/* ====== РОЗБЛОКУВАННЯ ====== */
function tryUnlock(correct) {
  const val = (document.getElementById("keyInput")?.value || "").trim();
  if (!val) return;

  if (val === correct) {
    alert("Доступ підтверджено.");
    const target = people.find(p => p.accessKey === correct);
    if (target) showDossier(target);
  } else {
    alert("Невірний код.");
  }
}

/* ====== ПОШУК (ВАЖЛИВО: hidden бере участь ТІЛЬКИ ПРИ ВВЕДЕННІ) ====== */
function searchPeople() {
  const q = (document.getElementById("search").value || "").toLowerCase().trim();

  if (!q) {
    renderList(people.filter(p => !p.hidden));
    return;
  }

  const filtered = people.filter(p =>
    (p.name || "").toLowerCase().includes(q) ||
    (p.rank || "").toLowerCase().includes(q) ||
    (p.position || "").toLowerCase().includes(q) ||
    (p.callsign || "").toLowerCase().includes(q)
  );

renderList(shuffleArray(filtered));
}

/* ====== СТАРТ ====== */
renderList(shuffleArray(people.filter(p => !p.hidden)));


function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
