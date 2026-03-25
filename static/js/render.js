function add_chase_tooltip(el, inform_text, visual_element) {
    let tooltip = document.getElementById('tooltip')
    let visualelement = document.getElementById('visual_element')
    if (visual_element) visualelement.appendChild(visual_element)
    el.addEventListener('mouseenter', (e) => {
        tooltip.innerText = inform_text;
        tooltip.style.display = 'block';
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY + 10 + 'px';
    });
    el.addEventListener('mousemove', (e) => {
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY + 10 + 'px';
    });
    el.addEventListener('mouseleave', (e) => {
        tooltip.style.display = 'none';
    });
}

function renderVisitors(visitors, placemants) {


    let sortElement = document.getElementById("sortVisitors")
    let sort = sortElement.value

    let list = document.getElementById("visitorList")
    let cur_arrival = document.getElementById("currentArrival")
    let current_arrival = cur_arrival.value
    list.innerHTML = ""





    visitors.forEach(v => {
        let placements = placemants.filter(p => p.visitor_id == v.id && p.arrival_id == current_arrival)
        console.log(placements)
        
        let selBeds = [];
        if (placements) {
            let beds = document.querySelectorAll('.bed');
            beds.forEach(bed => {
                placements.forEach(p => {
                    if (bed.dataset.id == p.bed_id) {
                        selBeds.push(bed);
                    }
                });
            });
        }

        if (
            (sort != "" && (v.dr.includes(sort) || v.name.includes(sort) || v.phone.includes(sort)))
            ||
            sort == ""
        ) {

            let el = document.createElement("div")
            el.className = "visitor";
            el.innerText = v.name
            let age = calculate_age_str(v.dr)
            let toolInfo = v.dr + "\n"
                + v.phone + "\n"
                + (v.sex === true ? "М" : "Ж") + "\n"
                + "Возраст:" + age + "\n"
            add_chase_tooltip(el, toolInfo)

            el.draggable = true
            el.dataset.id = v.id

            el.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("visitor_id", v.id)
            })
            list.appendChild(el)
            el.addEventListener("mouseenter", () => {
                selBeds.forEach(bed => {
                    let overlay = document.createElement('div');
                    overlay.className = 'bed-overlay';
                    bed.appendChild(overlay);
                });
            })
            el.addEventListener("mouseleave", () => {
                document.querySelectorAll('.bed-overlay').forEach(o => o.remove());
            });
            console.log(placemants.length)
            if(placemants.length >0) el.classList.add("busy-white")
            // el.addEventListener("click", () => { open_modal("Приветка?", buttons_reset_bed(0, 1)); })
        }
    })
}


function renderMap(data) {
    let current_arrival_el = data.arrivals.find(a => a.id == current_arrival.value)
    let current_arrival_id = current_arrival_el.id
    let map = document.getElementById("map")
    map.innerHTML = ""
    data.buildings.forEach(building => {
        renderBuilding(map, building, data, current_arrival_id)
    })

}
function renderBuilding(map, building, data, current_arrival_id) {
    let buildingDiv = document.createElement("div")
    buildingDiv.className = "building"
    let title = document.createElement("div")
    title.className = "building_title"
    title.innerText = building.name
    buildingDiv.appendChild(title)
    /* комнаты корпуса */
    let rooms = data.rooms.filter(r => r.building_id == building.id)
    rooms.forEach(room => {
        renderRoom(buildingDiv, room, data, current_arrival_id)
    })
    map.appendChild(buildingDiv)
}
function renderRoom(buildingDiv, room, data, current_arrival_id) {
    let roomDiv = document.createElement("div")
    roomDiv.className = "room"

    let roomTitle = document.createElement("div")
    roomTitle.className = "room_title"
    roomTitle.innerText = room.number
    roomDiv.appendChild(roomTitle)
    let bedsContainer = document.createElement("div")
    bedsContainer.className = "beds"
    /* койки комнаты */
    let beds = data.beds.filter(b => b.room_id == room.id)
    beds.forEach(bed => { renderBed(bedsContainer, bed, data, current_arrival_id) })

    roomDiv.appendChild(bedsContainer)

    buildingDiv.appendChild(roomDiv)
}
function renderBed(bedsContainer, bed, data, current_arrival_id) {

    let bedDiv = document.createElement("div")
    bedDiv.className = "bed free " + bed.position
    bedDiv.dataset.id = bed.id
    bedDiv.addEventListener("dragover", (e) => { e.preventDefault() })
    bedDiv.addEventListener("drop", (e) => {
        e.preventDefault()
        let visitor_id = e.dataTransfer.getData("visitor_id")
        let bed_id = bedDiv.dataset.id
        // ОБЯЗАТЕЛЬНО ЗАМЕНИТЬ 1 на определенный автоматически заезд 
        choosePlacement(data, visitor_id, bed_id)
        // place(visitor_id, bed_id, 1)
    })

    let placement = data.placements.find(p => p.bed_id == bed.id && p.arrival_id == current_arrival_id)
    let position_rus =
        bed.position === "upper" ? "Верхняя койка\n" :
            bed.position === "lower" ? "Нижняя койка\n" : "";

    if (placement) {

        let status_rus =
            placement.status === "busy" ? "Занято:\n" :
                placement.status === "reserved" ? "Зарезервированно:\n" : "";

        bedDiv.className = "bed " + placement.status + " " + bed.position
        visitor = data.visitors.find(visitor => visitor.id === placement.visitor_id)
        let age = 0
        if (visitor.dr != null) age = calculate_age_str(visitor.dr)
        let name = ""
        if (visitor) name = visitor.name
        add_chase_tooltip(bedDiv, position_rus + status_rus + name)

        let sexColor = ""
        if (visitor && visitor.sex) sexColor = "boy"
        else sexColor = "girl"
        let sex = document.createElement("div")
        sex.classList = "bedsex " + sexColor
        sex.innerHTML = age

        bedDiv.appendChild(sex)

        bedDiv.addEventListener("click", () => { open_modal("Освободить койку?", buttons_reset_bed(bed.id, current_arrival_id)); })
    }
    else {
        add_chase_tooltip(bedDiv, position_rus + "Пусто")
    }



    bedsContainer.appendChild(bedDiv)

}