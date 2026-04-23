// ------------------------------
// Глобальные переменные
// ------------------------------
let selectedVisitor = null;

// Отключаем меню правой кнопки
document.addEventListener('contextmenu', e => e.preventDefault());
// Выставляю 
document.getElementById("start_arrival").value = today_string()
document.getElementById("stop_arrival").value = today_string()


async function fillingComponentsData() {
    const res = await fetch("/api/map");
    const data = await res.json();
    const sities = await get_table("sities")
    fillArrivals(data.arrivals);
    fillSities(sities);
}
// ------------------------------
// Загрузка данных
// ------------------------------
async function loadData() {
    const res = await fetch("/api/map");
    let data = await res.json();
    await renderMap(data);
    await renderArrivalInfo(data);
    renderVisitors(data);
}


async function loadVisitors() {
    const res = await fetch("/api/map");
    let data = await res.json();
    renderVisitors(data);
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
async function choosePlacement(data, visitor_id, bed_id, event_type = null) {
    const cur_ar_id = await current_arrival_id();
    if (!cur_ar_id) {
        alert("Сначала выберите заезд");
        return;
    }
    let arrival = data.arrivals.find(a => a.id == cur_ar_id)

    const arrival_cost = data.arrivals.find(a => a.id == cur_ar_id).cost

    const visitor = data.visitors.find(v => v.id == visitor_id);
    const bed = data.beds.find(b => b.id == bed_id);
    const room = data.rooms.find(r => r.id == bed.room_id);
    const building = data.buildings.find(b => b.id == room.building_id);

    const position_rus = bed.position === "upper" ? "Верхняя койка" : "Нижняя койка";

    const placement = data.placements.find(p => p.bed_id == bed_id && p.arrival_id == cur_ar_id);

    // Определяем, какие кнопки показывать

    let controls;
    if (event_type === "rebusy") controls = buttons_update_bed(visitor_id, bed_id, cur_ar_id);
    else if (!placement) controls = buttons_set_bed(visitor_id, bed_id, cur_ar_id, arrival_cost);
    else controls = buttons_update_bed(visitor_id, bed_id, cur_ar_id);

    open_modal({
        title: `${building.name} — Комната ${room.number}`,
        body: `${position_rus}\n${visitor.name}`,
        controls
    });
}

// ------------------------------
// Автозапуск
// ------------------------------
fillingComponentsData();
loadData();
