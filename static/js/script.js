
let selectedVisitor = null
let current_arrival = document.getElementById("currentArrival")

// Отключаем меню правой кнопки
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

async function loadData() {
    let res = await fetch("/api/map")
    let data = await res.json()

    fillArrivals(data.arrivals)
    fillSities(data.sities)
    renderMap(data)
    renderArrivalInfo(data)
    renderVisitors(data.visitors, data.placements)
}
async function loadVisitors(e) {
    let res = await fetch("/api/visitors")
    let visitors = (await res.json()).visitors
    res = await fetch("/api/placements")
    let placements = (await res.json()).placements
    renderVisitors(visitors, placements)
}
async function loadSityes(e){
    let res = await fetch("/api/sityes")
    let placements = (await res.json()).placements
    renderVisitors(visitors, placements)
}
function calculate_age_str(birthDateString) {
    if (isNaN(Date.parse(birthDateString))) {
        console.error("Ошибка обработчика даты!")
        return -1
    }
    // Обрабатываем аргумент birthDateString (yyyyMMdd)  
    const year = parseInt(birthDateString.split("-")[0], 10);
    const month = parseInt(birthDateString.split("-")[1], 10) - 1; // Месяцы начинаются с 0  
    const day = parseInt(birthDateString.split("-")[2], 10);
    // Создаём объект Date для даты рождения  
    const birthDate = new Date(year, month, day);
    // Получаем текущую дату  
    const today = new Date();
    // Вычисляем возраст  
    let age = today.getFullYear() - birthDate.getFullYear();
    // Проверяем, прошёл ли день рождения в текущем году  
    const hasBirthdayPassed = today.getMonth() > month || (today.getMonth() === month && today.getDate() >= day);
    if (!hasBirthdayPassed) {
        age--; // Если дня рождения ещё не было в этом году, уменьшаем на 1  
    }
    return age;
}


/*!!!!!!!!!!!!!!!!!!!!МОДАЛЬНОЕ ОКНО!!!!!!!!!!!!!!!!!!!!*/
// Выбор размещения
function modal_btns_new_bed() {
    let modal_buttons = document.getElementById("modal_buttons")
    let btnBusy = document.createElement("button")
    let btnReserved = document.createElement("button")
    let btnCancel = document.createElement("button")
    btnBusy.id = "btnBusy"
    btnBusy.innerText = "Занять койку"
    btnReserved.id = "btnReserved"
    btnReserved.innerText = "Зарезервировать"
    btnCancel.id = "btnCancel"
    btnCancel.innerText = "Отмена"
    modal_buttons.appendChild(btnBusy)
    modal_buttons.appendChild(btnReserved)
    modal_buttons.appendChild(btnCancel)
}

function choosePlacement(data, visitor_id, bed_id, event_type = null) {
    // Узнаем какой текущий id заезда
    let current_arrival_id = current_arrival.value
    if (current_arrival_id == "") {
        alert("Сначала выберите заезд")
        return
    }


    let visitor = data.visitors.find(v => v.id == visitor_id)
    let bed = data.beds.find(b => b.id = bed_id)
    let room = data.rooms.find(r => r.id = bed.room_id)
    let build = data.buildings.find(b => b.id = room.building_id)

    // Занята ли уже этим посетителем койка
    let current_placements = data.placements.find(p => p.visitor_id == visitor.id && p.arrival_id == current_arrival_id)
    // Занята ли выбранная койка кем либо
    let placement = data.placements.find(p => p.bed_id == bed_id && p.arrival_id == current_arrival_id)
    let position_bed_rus = ""
    if (bed.position == "upper") position_bed_rus = "Верхняя койка"
    else position_bed_rus = "Нижняя койка"
    
    if (event_type == "rebusy") {
       open_modal(
            text = build.name + "\nКомната:" + room.number + "\n" + position_bed_rus + "\n\n" + visitor.name,
            buttons = buttons_update_bed(visitor_id, bed_id, current_arrival_id)
        )
    }



    if (placement == undefined) {
        open_modal(
            text = build.name + "\nКомната:" + room.number + "\n" + position_bed_rus + "\n\n" + visitor.name,
            buttons = buttons_set_bed(visitor_id, bed_id, current_arrival_id)
        )
    }
    else {
        // перезанять койку
        open_modal(
            text = build.name + "\nКомната:" + room.number + "\n" + position_bed_rus + "\n\n" + visitor.name,
            buttons = buttons_update_bed(visitor_id, bed_id, current_arrival_id)
        )
    }

}





loadData()