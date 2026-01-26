// script.js
if (!localStorage.getItem("accessGranted")) {
    window.location.href = "login.html";
}

// ===== ПЕРЕВІРКА ДОСТУПУ =====
if (!localStorage.getItem("accessGranted")) {
    window.location.href = "login.html";
}

const people = [];

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const firstNames = ["Роман","Олександр","Ігор","Андрій","Максим","Сергій","Віталій"];
const lastNames = ["Іваненко","Петренко","Шевченко","Ковальчук","Мельник","Бондар"];
const ranks = ["Лейтенант","Капітан","Майор", "Підполковник","Полковник", "Генерал", "Старший лейтенант", "Молодший лейтенант"];
const positions = ["Аналітичний відділ","Контррозвідка","Кібербезпека","Оперативний відділ"];

for (let i = 0; i < 200; i++) {
    people.push({
        name: `${rand(lastNames)} ${rand(firstNames)} ${rand(firstNames)}ович`,
        callsign: "-",
        rank: rand(ranks),
        position: rand(positions)
    });
}

people.push({
    name: "Безшкурий Роман Віталійович",
    callsign: "zoomynh",
    rank: "Майор",
    position: "Невідомо"
});

const list = document.getElementById("list");
const dossier = document.getElementById("dossier");

function renderList(data) {
    list.innerHTML = "";
    data.forEach(p => {
        const div = document.createElement("div");
        div.className = "person-item";
        div.textContent = `${p.name} — ${p.rank}`;
        div.onclick = () => showDossier(p);
        list.appendChild(div);
    });
}


function showDossier(p) {
    dossier.innerHTML = `
        <h2>${p.name}</h2>
        <p><strong>Звання:</strong> ${p.rank}</p>
        <p><strong>Посада:</strong> ${p.position}</p>
        <p><strong>Позивний:</strong> ${p.callsign}</p>
        <hr>
        <p style="font-size:13px;color:#666">
            Дані з внутрішньої інформаційної системи.  
            Рівень доступу обмежений.
        </p>
    `;
}


function searchPeople() {
    const q = document.getElementById("search").value.toLowerCase();
    const filtered = people.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.rank.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        p.callsign.toLowerCase().includes(q)
    );
    renderList(filtered);
}

renderList(people);
