// Разместить человека
async function place(visitor_id, bed_id, status, arrival_id = 1) {
    await fetch(`/api/place?visitor_id=${visitor_id}&bed_id=${bed_id}&arrival_id=${arrival_id}&status=${status}`, {
        method: "POST"
    })
    loadData()
}
// Разместить человека
async function replace(bed_id,  arrival_id = 1) {
    await fetch(`/api/replace?bed_id=${bed_id}&arrival_id=${arrival_id}`, {
        method: "POST"
    })
    loadData()
}

// Добавить посетителя
async function addVisitor() {

    let nameInp = document.getElementById("visitorName")
    let dateInp = document.getElementById("visitorDate")
    let phoneInp = document.getElementById("visitorPhone")

    let sex = document.getElementById("sexMen").checked

    let name = nameInp.value
    let dr = dateInp.value
    let phone = phoneInp.value

    console.log(dr)
    if (name == "") {
        alert_element(nameInp)
        alert("Для начала введите имя!")
        return;
    }
    if (dr == "") {
        alert_element(dateInp)
        alert("дата рождения не указана!")
        return;
    }
    if (phone == "") {
        alert_element(phoneInp)
        alert("Номер телефона не указан!")
        return;
    }
    await fetch(`/api/add_visitor?name=${name}&dr=${dr}&phone=${phone}&sex=${sex}`, {
        method: "POST"
    })

    nameInp.value = ""
    dateInp.value = ""
    phoneInp.value = ""
    loadData()
}
// Добавить заезд
async function addArrival() {

    let name = document.getElementById("arrivalName").value

    await fetch(`/api/add_arrival?name=${name}`, {
        method: "POST"
    })

    loadData()

}




async function addBuilding(name = null) {
    if (name == null) name = document.getElementById("buildingName").value
    if (name == "") return
    await fetch(`/api/add_building?name=${name}`, {
        method: "POST"
    })
    loadData()
}
async function addRoom(building = null, number = null) {
    if (building == null) building = document.getElementById("roomBuilding").value
    if (number == null) number = document.getElementById("roomNumber").value
    if (building == null) return
    if (number == null) return
    await fetch(`/api/add_room?building_id=${building}&number=${number}`, {
        method: "POST"
    })
    loadData()
}
async function addBed() {

    let room = document.getElementById("bedRoom").value
    let position = document.getElementById("bedPosition").value

    await fetch(`/api/add_bed?room_id=${room}&position=${position}`, {
        method: "POST"
    })

    loadData()

}