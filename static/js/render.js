// ------------------------------
// Tooltip
// ------------------------------
function add_chase_tooltip(el, text, visual_element) {
    const tooltip = document.getElementById('tooltip')
    if (text != "") {
        el.addEventListener('mouseenter', e => {
            tooltip.innerText = text;
            tooltip.style.display = 'block';
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
        });
    }
    else {

        el.addEventListener('mouseenter', e => {
            tooltip.innerText = "";
            tooltip.appendChild(visual_element);
            tooltip.style.display = 'block';
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
        });
    }
    // if (visual_element) visual_element.appendChild(visual_element)



    el.addEventListener('mousemove', e => {
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY + 10 + 'px';
    });

    el.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
}
async function renderArrivalInfo(data) {
    const costEl = document.getElementById("current_arrival_cost"); // судя по index.html
    const startEl = document.getElementById("current_arrival_start");
    const stopEl = document.getElementById("current_arrival_stop");

    cur_ar_id = await current_arrival_id()

    if (!cur_ar_id) {
        return;
    }
    const arrival = data.arrivals.find(a => a.id == cur_ar_id);
    if (!arrival) return;

    costEl.innerText = `Желательное пожертвование: ${arrival.cost}`;
    startEl.innerHTML = `Начало:${arrival.start}`;
    stopEl.innerHTML = `Конец: ${arrival.stop}`;
}
// ------------------------------
// Render Visitors
// ------------------------------
function renderVisitors(visitors, placements) {
    const sort = document.getElementById("sortVisitors").value;
    const search = sort.toLowerCase();
    const list = document.getElementById("visitorList");
    const current_arrival = document.getElementById("currentArrival").value;
    list.innerHTML = "";

    visitors.forEach(v => {
        const vPlacements = placements.filter(p => p.visitor_id == v.id && p.arrival_id == current_arrival);
        const selBeds = [];

        document.querySelectorAll('.bed').forEach(bed => {
            vPlacements.forEach(p => { if (bed.dataset.id == p.bed_id) selBeds.push(bed); });
        });

        if (search && ![v.name, v.dr, v.phone].some(s => String(s).toLowerCase().includes(search))) return;

        const el = document.createElement("div");
        el.className = "visitor";
        el.innerHTML = (repl(v.name));

        const age = v.dr ? calculate_age_str(v.dr) : 0;
        function repl(str) {
            const cleanStr = String(str);
            const cleanSearch = String(search).trim();

            if (!cleanSearch) return cleanStr;

            const index = cleanStr.toLowerCase().indexOf(cleanSearch.toLowerCase());
            console.log(cleanStr);
            console.log(index);

            if (index === -1) return cleanStr;

            const regex = new RegExp(cleanSearch, "i");

            return "<div>" + cleanStr.replace(regex, "<span class='search_select'>$&</span>") + "</div>";
        }

        let visual_element = document.createElement("div")

        let birth_day_el = document.createElement("div")
        let phone_el = document.createElement("div")
        let sex_el = document.createElement("div")
        let age_el = document.createElement("div")

        birth_day_el.classList = "info_tooltip"
        birth_day_el.innerHTML = repl(v.dr)
        phone_el.classList = "info_tooltip"
        phone_el.innerHTML = repl(v.phone)
        sex_el.classList = "info_tooltip"
        sex_el.innerHTML = repl(v.sex ? "М" : "Ж")
        age_el.classList = "info_tooltip"
        age_el.innerHTML = repl(age)

        visual_element.appendChild(birth_day_el)
        visual_element.appendChild(phone_el)
        visual_element.appendChild(sex_el)
        visual_element.appendChild(age_el)

        add_chase_tooltip(el, "", visual_element);

        el.draggable = true;
        el.dataset.id = v.id;
        el.addEventListener("dragstart", e => e.dataTransfer.setData("visitor_id", v.id));

        el.addEventListener("mouseenter", () => selBeds.forEach(b => {
            const overlay = document.createElement('div');
            overlay.className = 'bed-overlay';
            b.appendChild(overlay);
        }));

        el.addEventListener("mouseleave", () => document.querySelectorAll('.bed-overlay').forEach(o => o.remove()));

        if (selBeds.length > 0) el.classList.add("busy-white");

        el.addEventListener("click", () => {
            document.querySelectorAll(`.visitor.selected`).forEach(n => n.classList.remove("selected"));
            el.classList.add("selected");
        });

        list.appendChild(el);
    });

    const visitorsElements = document.getElementsByClassName("visitor");
    if (visitorsElements.length) visitorsElements[0].classList.add("selected");
}

// ------------------------------
// Render Map
// ------------------------------
async function renderMap(data) {

    const map = document.getElementById("map");
    map.innerHTML = "";
    const buildings = data.buildings
    for (const building of buildings) {
        await renderBuilding(map, building, data)
    }

}

async function renderBuilding(map, building, data) {

    const buildingDiv = document.createElement("div");
    buildingDiv.className = "building greed row";

    const title = document.createElement("div");
    title.className = "building_title";
    title.innerText = building.name;

    const roomsContainer = document.createElement("div");
    roomsContainer.classList = "row_container greed table"



    const rooms = data.rooms.filter(r => r.building_id == building.id);
    for (const room of rooms) {
        await renderRoom(roomsContainer, room, data)
    }
    buildingDiv.appendChild(title);
    buildingDiv.appendChild(roomsContainer)
    map.appendChild(buildingDiv);
}

async function renderRoom(buildingDiv, room, data) {

    let roomDiv = document.createElement("div")
    roomDiv.classList = "room greed column"

    let roomTitle = document.createElement("div")
    roomTitle.classList = "room_title"
    roomTitle.innerText = room.number
    roomDiv.appendChild(roomTitle)
    let bedsContainer = document.createElement("div")
    bedsContainer.classList = "beds greed row no_gap"

    let upBedsContainer = document.createElement("div")
    upBedsContainer.classList = "upBeds greed column no_gap"
    let downBedsContainer = document.createElement("div")
    downBedsContainer.classList = "downBeds greed column no_gap"

    bedsContainer.appendChild(upBedsContainer)
    bedsContainer.appendChild(downBedsContainer)

    let beds = data.beds.filter(b => b.room_id == room.id)
    for (const bed of beds) {
        await renderBed(upBedsContainer, downBedsContainer, bed, data)
    }

    roomDiv.appendChild(bedsContainer)
    buildingDiv.appendChild(roomDiv)
}



// ------------------------------
// Render Bed using Template
// ------------------------------
async function renderBed(upContainer, downContainer, bed, data) {

    const cur_ar_id = await current_arrival_id();
    let arrival = data.arrivals.find(a => a.id == cur_ar_id)

    const template = await TemplateCache.getTemplate("/templates/bed.html");
    const current_arrival_cost = arrival.cost
    const placement = data.placements.find(p => p.bed_id == bed.id && p.arrival_id == cur_ar_id);

    let bedDiv = template.querySelector(".bed");
    bedDiv.classList.add(bed.position);
    bedDiv.dataset.id = bed.id;

    bedDiv.addEventListener("dragover", e => e.preventDefault());
    bedDiv.addEventListener("drop", e => {
        e.preventDefault();
        const visitor_id = e.dataTransfer.getData("visitor_id");
        const setted_bed = e.dataTransfer.getData("setted_bed");


        if (!setted_bed) choosePlacement(data, visitor_id, bed.id);
        else {
            // console.log("Отправлена койка ", setted_bed)
            // console.log("На койку ", bed.id)
            const cur_place = data.placements.find(p => p.bed_id == setted_bed && p.arrival_id == cur_ar_id);
            openModal({
                title: "Перенос посетителя.",
                body: `Перенести посетителя на новую койку?`,
                controls: buttons_move_bed(bed.id, cur_place)
            });

        }
    });



    const position_rus = bed.position === "upper" ? "Верхняя койка" : bed.position === "lower" ? "Нижняя койка" : "";


    if (placement) {

        const visitor = data.visitors.find(v => v.id === placement.visitor_id);
        const name = visitor ? visitor.name : "";
        const age = visitor && visitor.dr ? calculate_age_str(visitor.dr) : 0;
        const status_rus = placement.status === "busy" ? "Занято" : placement.status === "reserved" ? "Зарезервировано" : "";

        add_chase_tooltip(bedDiv, `${position_rus}\n${status_rus}\n${name}`);

        bedDiv.draggable = true;
        bedDiv.dataset.id = visitor.id;
        bedDiv.addEventListener("dragstart", e => {
            e.dataTransfer.setData("visitor_id", visitor.id)
            e.dataTransfer.setData("setted_bed", bed.id)
            e.dataTransfer.setData("placement", placement)
        });

        const sexColor = visitor && visitor.sex ? "boy" : "girl";
        const sexEl = bedDiv.querySelector(".bedsex") || document.createElement("div");
        sexEl.className = `bedsex ${sexColor}`;
        sexEl.innerText = age;
        if (!bedDiv.querySelector(".bedsex")) bedDiv.appendChild(sexEl);

        if (placement.status == "busy") {

            bedDiv.addEventListener("click", () => {
                openModal({
                    title: "Освободить койку?",
                    body: `${position_rus}\n${status_rus}\n${name}`,
                    controls: buttons_reset_bed(bed.id, cur_ar_id)
                });
            });
        }
        if (placement.status == "reserved") {
            bedDiv.addEventListener("click", () => {
                openModal({
                    title: "Койка зарезервированна.",
                    body: `${position_rus}\n${status_rus}\n${name}`,
                    controls: buttons_pay_bed(visitor.id, bed.id, cur_ar_id, current_arrival_cost)
                });
            });
        }

        bedDiv.classList.add(placement.status);
    } else {
        add_chase_tooltip(bedDiv, `${position_rus}\nПусто`);
        bedDiv.addEventListener("click", () => {
            const visitor_id = document.querySelector(`.visitor.selected`)?.dataset.id;
            if (visitor_id) choosePlacement(data, visitor_id, bed.id);
        });
        bedDiv.classList.add("free");
    }

    if (bed.position === "upper") { upContainer.appendChild(bedDiv); }
    else { downContainer.appendChild(bedDiv); }
}