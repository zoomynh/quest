// 200+ фонова база + квестова особа
const firstNames = ["Олександр","Андрій","Роман","Максим","Ігор","Дмитро","Сергій","Віталій"];
const lastNames = ["Іваненко","Петренко","Ковальчук","Мельник","Шевченко","Бондар","Ткаченко","Кравченко"];
const ranks = ["Лейтенант", "Старший лейтенант", "Капітан", "Майор", "Підполковник", "Полковник", "Генерал", "Сержант"];
const positions = [
  "Аналітичний відділ",
  "Оперативний відділ",
  "Кібербезпека",
  "Контррозвідка",
  "Адміністративний відділ"
];

const people = [];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

for (let i = 0; i < 200; i++) {
  people.push({
    name: `${rand(lastNames)} ${rand(firstNames)} ${rand(firstNames)}ович`,
    callsign: "-",
    rank: rand(ranks),
    position: rand(positions),
    photo: "photos/default.jpg",
    notes: "Службова інформація"
  });
}

// квестова особа
people.push({
  name: "Безшкурий Роман Віталійович",
  callsign: "zoomynh",
  rank: "Майор",
  position: "Невідомо",
  photo: "photos/target.jpg",
  notes: "Службова інформація"
});

// Перевірка авторизації
if (!localStorage.getItem("auth")) {
    alert("Доступ заборонено. Спочатку авторизуйтесь.");
    location.href = "login.html";
}

// Пошук
function searchPeople() {
    const q = document.getElementById("search").value.toLowerCase();
    const list = document.getElementById("list");
    list.innerHTML = "";
    const dossier = document.getElementById("dossier");
    dossier.innerHTML = "";

    const filtered = people.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.rank.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        p.callsign.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
        list.innerHTML = "<p>Нічого не знайдено</p>";
    }

    filtered.forEach(p => {
        const div = document.createElement("div");
        div.className = "person-item";
        div.textContent = p.name + " — " + p.rank + " — " + p.position;
        div.onclick = () => showDossier(p);
        list.appendChild(div);
    });
}

// Рендер досьє
function showDossier(p) {
    const dossier = document.getElementById("dossier");
    dossier.innerHTML = `
        <h2>Досьє</h2>
        <img src="${p.photo}" class="photo">
        <p><b>ПІБ:</b> ${p.name}</p>
        <p><b>Позивний:</b> ${p.callsign}</p>
        <p><b>Звання:</b> ${p.rank}</p>
        <p><b>Посада:</b> ${p.position}</p>
        <p><b>Примітки:</b> ${p.notes}</p>
    `;
}
