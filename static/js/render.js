// ------------------------------
// Tooltip
// ------------------------------
function add_chase_tooltip(el, text, visual_element) {
    const tooltip = document.getElementById('tooltip')
    if (visual_element) visual_element.appendChild(visual_element)

    el.addEventListener('mouseenter', e => {
        tooltip.innerText = text;
        tooltip.style.display = 'block';
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY + 10 + 'px';
    });

    el.addEventListener('mousemove', e => {
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY + 10 + 'px';
    });

    el.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
}
function renderArrivalInfo(data) {
    const currentArrivalEl = document.getElementById("currentArrival");
    const currentArrivalCostEl = document.getElementById("current_arrival_cost"); // судя по index.html
    const currentArrivalId = currentArrivalEl.value;

    if (!currentArrivalId) return;

    const arrival = data.arrivals.find(a => a.id == currentArrivalId);
    if (!arrival) return;

    currentArrivalCostEl.innerText = `Взнос: ${arrival.cost}`;
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
        el.innerText = v.name;
        const age = v.dr ? calculate_age_str(v.dr) : 0;

        add_chase_tooltip(el, `${v.dr}\n${v.phone}\n${v.sex ? "М" : "Ж"}\nВозраст: ${age}`);

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
    const current_arrival_id = parseInt(document.getElementById("currentArrival").value);
    const map = document.getElementById("map");
    map.innerHTML = "";
    const buildings = data.buildings
    for (const building of buildings) {
        await renderBuilding(map, building, data, current_arrival_id)
    }

}

async function renderBuilding(map, building, data, current_arrival_id) {
    const buildingDiv = document.createElement("div");
    buildingDiv.className = "building greed row";

    const title = document.createElement("div");
    title.className = "building_title";
    title.innerText = building.name;

    const roomsContainer = document.createElement("div");
    roomsContainer.classList = "row_container greed table"



    const rooms = data.rooms.filter(r => r.building_id == building.id);
    for (const room of rooms) {
        await renderRoom(roomsContainer, room, data, current_arrival_id)
    }
    buildingDiv.appendChild(title);
    buildingDiv.appendChild(roomsContainer)
    map.appendChild(buildingDiv);
}

async function renderRoom(buildingDiv, room, data, current_arrival_id) {
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
        await renderBed(upBedsContainer, downBedsContainer, bed, data, current_arrival_id)
    }

    roomDiv.appendChild(bedsContainer)
    buildingDiv.appendChild(roomDiv)
}



// ------------------------------
// Render Bed using Template
// ------------------------------
async function renderBed(upContainer, downContainer, bed, data, current_arrival_id) {
    // клонируем шаблон
    const template = await TemplateCache.getTemplate("/templates/bed.html");
    const placement = data.placements.find(p => p.bed_id == bed.id && p.arrival_id == current_arrival_id);

    let bedDiv = template.querySelector(".bed");
    bedDiv.classList.add(bed.position);
    bedDiv.dataset.id = bed.id;

    bedDiv.addEventListener("dragover", e => e.preventDefault());
    bedDiv.addEventListener("drop", e => {
        e.preventDefault();
        const visitor_id = e.dataTransfer.getData("visitor_id");
        choosePlacement(data, visitor_id, bed.id);
    });



    const position_rus = bed.position === "upper" ? "Верхняя койка" : bed.position === "lower" ? "Нижняя койка" : "";



    if (placement) {
        const visitor = data.visitors.find(v => v.id === placement.visitor_id);
        const name = visitor ? visitor.name : "";
        const age = visitor && visitor.dr ? calculate_age_str(visitor.dr) : 0;
        const status_rus = placement.status === "busy" ? "Занято" : placement.status === "reserved" ? "Зарезервировано" : "";

        add_chase_tooltip(bedDiv, `${position_rus}\n${status_rus}\n${name}`);

        const sexColor = visitor && visitor.sex ? "boy" : "girl";
        const sexEl = bedDiv.querySelector(".bedsex") || document.createElement("div");
        sexEl.className = `bedsex ${sexColor}`;
        sexEl.innerText = age;
        if (!bedDiv.querySelector(".bedsex")) bedDiv.appendChild(sexEl);

        bedDiv.addEventListener("click", () => {
            openModal({
                title: "Освободить койку?",
                body: `${position_rus}\n${status_rus}\n${name}`,
                controls: buttons_reset_bed(bed.id, current_arrival_id)
            });
        });
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