// Разместить человека
async function place(visitor_id, bed_id, status, arrival_id, money) {
    if (money == "") money = 0
    await fetch(`/api/place?visitor_id=${visitor_id}&bed_id=${bed_id}&arrival_id=${arrival_id}&status=${status}&money=${money}`, {
        method: "POST"
    })
    loadData()
}

async function update_place(visitor_id, bed_id, status, money, arrival_id) {
    await fetch(`/api/update_place?visitor_id=${visitor_id}&bed_id=${bed_id}&arrival_id=${arrival_id}&status=${status}&money=${money}`, {
        method: "POST"
    })
    loadData()
}

async function update_visitor(visitor_id, name, dr, phone) {
    await fetch(`/api/update_visitor?visitor_id=${encodeURIComponent(String(visitor_id).trim())}
    &name=${encodeURIComponent(String(name).trim())}
    &dr=${encodeURIComponent(String(dr).trim())}
    &phone=${encodeURIComponent(String(phone).trim())}`, {
        method: "POST"
    });
    loadData();
}

async function delete_visitor(visitor_id) {
    await fetch(`/api/delete_visitor?visitor_id=${encodeURIComponent(String(visitor_id).trim())}`, {
        method: "POST"
    });
    loadData();
}
async function delete_arrival(arrival_id) {
    await fetch(`/api/delete_arrival?arrival_id=${encodeURIComponent(String(arrival_id).trim())}`, {
        method: "POST"
    });
}






async function move_place(visitor_id, old_bed_id, new_bed_id, arrival_id) {
    await fetch(`/api/move_place?visitor_id=${visitor_id}&old_bed_id=${old_bed_id}&new_bed_id=${new_bed_id}&arrival_id=${arrival_id}`, {
        method: "POST"
    })
    loadData()
}

async function replace(visitor_id,bed_id, arrival_id = 1) {
    await fetch(`/api/replace?bed_id=${bed_id}&arrival_id=${arrival_id}&visitor_id=${visitor_id}`, {
        method: "POST"
    })
    loadData()
}

// Добавить посетителя
async function addVisitor() {

    let nameInp = document.getElementById("visitorName")
    let dateInp = document.getElementById("visitorDate")
    let phoneInp = document.getElementById("visitorPhone")
    let sityInp = document.getElementById("visitorSity")

    let sities = await get_table("sities")

    let namesity = String(sityInp.value).charAt(0).toUpperCase() + String(sityInp.value.toLowerCase()).slice(1);

    let selected_sity = sities.filter((sity) => sity.name.toLowerCase() == sityInp.value.toLowerCase())
    let selected_sity_id = selected_sity.length == 0 ? null : selected_sity[0].id

    let sex = document.getElementById("sexMen").checked

    let name = nameInp.value
    let dr = dateInp.value
    let phone = phoneInp.value

    if (name == "") {
        alert_element(nameInp)

        open_modal({
            title: "Ошибка",
            body: "Для начала введите имя!",
            controls: [{ type: "btn", text: "ОК" }]
        })
        return;
    }

    if (dr == "" && document.getElementById("turn_on_birth").checked) {
        alert_element(dateInp)

        open_modal({
            title: "Ошибка",
            body: "Дата рождения не указана!",
            controls: [{ type: "btn", text: "ОК" }]
        })
        return;
    }
    if (selected_sity_id == "" && document.getElementById("turn_on_sity").checked) {
        alert_element(sityInp)

        open_modal({
            title: "Ошибка",
            body: "Город не указан!",
            controls: [{ type: "btn", text: "ОК" }]
        })
        return;
    }
    if (phone == "" && document.getElementById("turn_on_phone").checked) {
        alert_element(phoneInp)

        open_modal({
            title: "Ошибка",
            body: "Номер телефона не указан!",
            controls: [{ type: "btn", text: "ОК" }]
        })
        return;
    }
    // await fetch(`/api/add_sity?name=${name}`, {
    //         method: "POST"
    //     })

    await fetch(`/api/add_visitor?name=${name}&dr=${dr}&phone=${phone}&sex=${sex}`, {
        method: "POST"
    })

    nameInp.value = ""
    dateInp.value = ""
    phoneInp.value = ""

    loadData()
}

// Добавить заезд
async function addArrival(id_button_close = null) {
    const buttonClose = document.getElementById(id_button_close)
    const NameEl = document.getElementById("arrivalName")
    const costEl = document.getElementById("arrivalCost")

    const startEl = document.getElementById("start_arrival")
    const stopEl = document.getElementById("stop_arrival")


    let name = NameEl.value
    let cost = costEl.value
    let start = startEl.value
    let stop = stopEl.value


    if (cost == "") cost = 0

    if (name == "") {
        alert_element(NameEl)

        open_modal({
            title: "Ошибка",
            body: "Для начала введите название заезда!",
            controls: [{ type: "btn", text: "ОК" }]
        })

        return;
    }
    if (start == "") {
        alert_element(startEl)
        open_modal({
            title: "Ошибка",
            body: "Для начала введите дату начала заезда!",
            controls: [{ type: "btn", text: "ОК" }]
        })

        return;
    }
    if (stop == "") {
        alert_element(stopEl)
        open_modal({
            title: "Ошибка",
            body: "Для начала введите дату завершения заезда!",
            controls: [{ type: "btn", text: "ОК" }]
        })

        return;
    }

    const arrivals = await get_table("arrivals")
    if (arrivals.filter(a => a.name.toLowerCase() == name.toLowerCase()).length > 0) {
        alert_element(NameEl)
        open_modal({
            title: "Такой заезд уже существует",
            body: "Имя заезда уже используется для другого заезда! Может возникнуть путанница.",
            controls: [{ type: "btn", text: "ОК" }]
        })
        return;
    }


    await fetch(`/api/add_arrival?name=${name}&cost=${cost}&start=${start}&stop=${stop}`, {
        method: "POST"
    })


    await fillingComponentsData()
    NameEl.value = ""
    costEl.value = ""
    // нажымаем на кнопку скрыть
    if (buttonClose) buttonClose.click()
}


// Добавить корпус
async function addBuilding(name = null) {
    if (name == null) name = document.getElementById("buildingName").value

    if (name == "") {
        open_modal({
            title: "Ошибка",
            body: "Введите название корпуса",
            controls: [{ type: "btn", text: "ОК" }]
        })
        return
    }

    await fetch(`/api/add_building?name=${name}`, {
        method: "POST"
    })

    loadData()
}

// Добавить комнату
async function addRoom(building = null, number = null) {
    if (building == null) building = document.getElementById("roomBuilding").value
    if (number == null) number = document.getElementById("roomNumber").value

    if (building == null || building == "") {
        open_modal({
            title: "Ошибка",
            body: "Не выбран корпус",
            controls: [{ type: "btn", text: "ОК" }]
        })
        return
    }

    if (number == null || number == "") {
        open_modal({
            title: "Ошибка",
            body: "Введите номер комнаты",
            controls: [{ type: "btn", text: "ОК" }]
        })
        return
    }

    await fetch(`/api/add_room?building_id=${building}&number=${number}`, {
        method: "POST"
    })

    loadData()
}

// Добавить кровать
async function addBed() {

    let room = document.getElementById("bedRoom").value
    let position = document.getElementById("bedPosition").value

    if (!room) {
        open_modal({
            title: "Ошибка",
            body: "Не выбрана комната",
            controls: [{ type: "btn", text: "ОК" }]
        })
        return
    }

    await fetch(`/api/add_bed?room_id=${room}&position=${position}`, {
        method: "POST"
    })

    loadData()
}