// ===== ДОСТУП =====
if (!localStorage.getItem("accessGranted")) {
  window.location.href = "login.html";
}

// ===== ДАНІ (200+ генеруємо + 1 квестова) =====
const people = [];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const firstNamesM = ["Олександр","Андрій","Ігор","Дмитро","Сергій","Віталій","Максим","Роман","Євген","Олег"];
const firstNamesF = ["Олена","Ірина","Анна","Марія","Катерина","Наталія","Оксана","Юлія"];
const lastNames = ["Іваненко","Петренко","Шевченко","Ковальчук","Мельник","Бондар","Ткаченко","Кравченко","Романюк","Гриценко"];
const patronymicsM = ["Олександрович","Андрійович","Ігорович","Дмитрович","Сергійович","Віталійович","Максимович","Романович"];
const patronymicsF = ["Олександрівна","Андріївна","Ігорівна","Дмитрівна","Сергіївна","Віталіївна","Максимівна","Романівна"];

const ranks = ["Лейтенант","Старший лейтенант","Капітан","Майор", "Підполковник","Полковник","Генерал-майор", "Молодший лейтенант"];
const positions = ["Аналітичний відділ","Оперативний відділ","Кібербезпека","Контррозвідка","Адміністративний відділ","Відділ зв’язку"];

for (let i = 0; i < 220; i++) {
  const isFemale = Math.random() < 0.25;

  const fn = isFemale ? rand(firstNamesF) : rand(firstNamesM);
  const ln = rand(lastNames);
  const pt = isFemale ? rand(patronymicsF) : rand(patronymicsM);

  people.push({
    name: `${ln} ${fn} ${pt}`,
    callsign: "-",
    rank: rand(ranks),
    position: rand(positions),
    photo: "photos/default.jpg",
    notes: "Службова інформація"
  });
}

// КВЕСТОВА ОСОБА
people.push({
  name: "Безшкурий Роман Віталійович",
  callsign: "zoomynh",
  rank: "Майор",
  position: "Невідомо",
  photo: "photos/roman.jpg",
  notes: "Інформація обмежена"
});

// ===== UI =====
const listEl = document.getElementById("list");
const dossierEl = document.getElementById("dossier");

function renderList(data) {
  listEl.innerHTML = "";

  data.forEach((p) => {
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

function showDossier(p) {
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
  `;
}

function searchPeople() {
  const q = document.getElementById("search").value.toLowerCase().trim();

  if (!q) {
    renderList(people);
    return;
  }

  const filtered = people.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.rank.toLowerCase().includes(q) ||
    p.position.toLowerCase().includes(q) ||
    p.callsign.toLowerCase().includes(q)
  );

  renderList(filtered);
}

// Показати всіх одразу
renderList(people);
