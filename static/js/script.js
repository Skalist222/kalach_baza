// ------------------------------
// Глобальные переменные
// ------------------------------
let selectedVisitor = null;
const current_arrival = document.getElementById("currentArrival");

// Отключаем меню правой кнопки
document.addEventListener('contextmenu', e => e.preventDefault());

// ------------------------------
// Загрузка данных
// ------------------------------
async function loadData() {
    const res = await fetch("/api/map");
    const data = await res.json();
    const sities = await get_table("sities");

    fillArrivals(data.arrivals);
    fillSities(sities);

    await renderMap(data);
    renderArrivalInfo(data); // оставляем, если есть функция
    renderVisitors(data.visitors, data.placements);
}

async function loadVisitors() {
    const visitors = await get_table("visitors");
    const placements = await get_table("placements");
    renderVisitors(visitors, placements);
}

async function loadSities() {
    const sities = await get_table("sities");
    renderVisitors(sities);
}

// ------------------------------
// Вспомогательная функция для возраста
// ------------------------------
function calculate_age_str(birthDateString) {
    if (isNaN(Date.parse(birthDateString))) {
        console.error("Ошибка обработчика даты!");
        return -1;
    }

    const [year, month, day] = birthDateString.split("-").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassed = today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) age--;
    return age;
}

// ------------------------------
// Размещение посетителя (универсальная модалка)
// ------------------------------
function choosePlacement(data, visitor_id, bed_id, event_type = null) {
    const current_arrival_id = current_arrival.value;
    if (!current_arrival_id) {
        alert("Сначала выберите заезд");
        return;
    }

    const visitor = data.visitors.find(v => v.id == visitor_id);
    const bed = data.beds.find(b => b.id == bed_id);
    const room = data.rooms.find(r => r.id == bed.room_id);
    const building = data.buildings.find(b => b.id == room.building_id);

    const position_rus = bed.position === "upper" ? "Верхняя койка" : "Нижняя койка";

    const placement = data.placements.find(p => p.bed_id == bed_id && p.arrival_id == current_arrival_id);

    // Определяем, какие кнопки показывать
    let controls;
    if (event_type === "rebusy") controls = buttons_update_bed(visitor_id, bed_id, current_arrival_id);
    else if (!placement) controls = buttons_set_bed(visitor_id, bed_id, current_arrival_id);
    else controls = buttons_update_bed(visitor_id, bed_id, current_arrival_id);

    openModal({
        title: `${building.name} — Комната ${room.number}`,
        body: `${position_rus}\n${visitor.name}`,
        controls
    });
}

// ------------------------------
// Автозапуск
// ------------------------------
loadData();