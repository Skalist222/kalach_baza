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
async function renderVisitors(visitors, placements) {
    const sort = document.getElementById("sortVisitors").value;
    const search = sort.toLowerCase();
    const list = document.getElementById("visitorList");
    const current_arrival = await current_arrival_id();
    list.innerHTML = "";

    visitors.forEach(v => {


        const vPlacements = placements.filter(p => p.visitor_id == v.id && p.arrival_id == current_arrival);

        if (document.getElementById("turn_on_selected_visitors").checked && vPlacements.length == 0) return;

        function repl(str) {
            const cleanStr = String(str);
            const cleanSearch = String(search).trim();

            if (!cleanSearch) return cleanStr;

            const index = cleanStr.toLowerCase().indexOf(cleanSearch.toLowerCase());

            if (index === -1) return cleanStr;

            const regex = new RegExp(cleanSearch, "i");

            return "<div>" + cleanStr.replace(regex, "<span class='search_select'>$&</span>") + "</div>";
        }

        const el = document.createElement("div");
        let non_placemant = false;
        const selBeds = [];
        document.querySelectorAll(`.bed`).forEach(
            b => {
                vPlacements.forEach(p => {
                    if (p.bed_id == -1) {
                        non_placemant = true;
                    }
                    if (p.bed_id == b.dataset.id && p.arrival_id == current_arrival) {
                        selBeds.push(b);
                    }
                });
            });



        el.addEventListener("mouseenter", () => selBeds.forEach(b => {
            const overlay = document.createElement('div');
            overlay.className = 'bed-overlay';
            b.appendChild(overlay);
        }));
        el.addEventListener("mouseleave", () => document.querySelectorAll('.bed-overlay').forEach(o => o.remove()));

        if (search && ![v.name, v.dr, v.phone].some(s => String(s).toLowerCase().includes(search))) return;



        el.className = "visitor";
        el.innerHTML = (repl(v.name));
        el.addEventListener('contextmenu', (e) => {
            document.querySelectorAll('.bed-overlay').forEach(o => o.remove());
            open_menu(e, visitor_menu(v, vPlacements.length > 0, current_arrival));
        });

        const age = v.dr ? calculate_age_str(v.dr) : 0;


        let visual_element = document.createElement("div")

        let non_plase_el = document.createElement("div")
        let birth_day_el = document.createElement("div")
        let phone_el = document.createElement("div")
        let sex_el = document.createElement("div")
        let age_el = document.createElement("div")

        non_plase_el.classList = "info_tooltip"
        non_plase_el.innerHtml = non_placemant ? "Оплатили без заселения" : ""
        birth_day_el.classList = "info_tooltip"
        birth_day_el.innerHTML = repl(v.dr)
        phone_el.classList = "info_tooltip"
        phone_el.innerHTML = repl(v.phone)
        sex_el.classList = "info_tooltip"
        sex_el.innerHTML = repl(v.sex ? "М" : "Ж")
        age_el.classList = "info_tooltip"
        age_el.innerHTML = repl(age)

        console.log(non_plase_el)
        visual_element.appendChild(non_plase_el)
        visual_element.appendChild(birth_day_el)
        visual_element.appendChild(phone_el)
        visual_element.appendChild(sex_el)
        visual_element.appendChild(age_el)
        

        add_chase_tooltip(el, "", visual_element);

        el.draggable = true;
        el.dataset.id = v.id;
        el.addEventListener("dragstart", e => e.dataTransfer.setData("visitor_id", v.id));





        if (vPlacements.length > 0) {
            if (non_placemant) {
                const non_place_el = document.createElement("div");
                non_place_el.classList = "non_place_info";
                non_place_el.innerText = "Оплатили без заселения"
                el.appendChild(non_place_el);
                el.classList.add("non_place_visitor");
            }
            else {
                el.classList.add("busy-white");
            }
        }

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


async function create_age_room(data, room) {
    let age_room = document.createElement("div")
    age_room.classList = "age_room"

    const current_beds = data.beds.filter(b => b.room_id == room.id)
    const current_placements = data.placements.filter(p => current_beds.some(b => b.id == p.bed_id))
    const current_visitors = current_placements.map(p => data.visitors.find(v => v.id == p.visitor_id))
    {
        let count = 0
        let age = 0
        current_visitors.forEach(v => {
            age += calculate_age_str(v.dr);
            count++;
        });
        age_room.innerText = age != 0 ? `${Math.round(age / count)}` : "";
    }
    return age_room
}
async function renderRoom(buildingDiv, room, data) {

    let roomDiv = document.createElement("div")
    roomDiv.classList = "room greed column"

    let roomTitle = document.createElement("div")
    roomTitle.classList = "room_title"
    roomTitle.innerText = room.number







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

    roomDiv.appendChild(roomTitle)
    roomDiv.appendChild(bedsContainer)

    // Выводить или нет средний возраст в комнате
    if (document.getElementById("turn_on_age_room").checked) {
        const age_room = await create_age_room(data, room)
        roomDiv.appendChild(age_room)
    }


    buildingDiv.appendChild(roomDiv)
}



// ------------------------------
// Render Bed using Template
// ------------------------------
async function renderBed(upContainer, downContainer, bed, data) {

    const template = await TemplateCache.getTemplate("/templates/bed.html");
    let bedDiv = template.querySelector(".bed");


    const cur_ar_id = await current_arrival_id();
    let arrival = data.arrivals.find(a => a.id == cur_ar_id)


    const current_arrival_cost = arrival.cost
    const placement = data.placements.find(p => p.bed_id == bed.id && p.arrival_id == cur_ar_id);


    bedDiv.classList.add(bed.position);
    bedDiv.dataset.id = bed.id;

    bedDiv.addEventListener("dragover", e => e.preventDefault());
    bedDiv.addEventListener("drop", e => {
        e.preventDefault();
        const visitor_id = e.dataTransfer.getData("visitor_id");
        const setted_bed = e.dataTransfer.getData("setted_bed");


        if (!setted_bed) choosePlacement(data, visitor_id, bed.id);
        else {
            const cur_place = data.placements.find(p => p.bed_id == setted_bed && p.arrival_id == cur_ar_id);
            open_modal({
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

        add_chase_tooltip(bedDiv, `${position_rus}\n${status_rus}\n${name}\nОплачено:${placement.money}`);

        bedDiv.draggable = true;
        bedDiv.dataset.id = bed.id;
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


        const payEl = bedDiv.querySelector(".pay") || document.createElement("div");
        payEl.classList.add(placement.money > 0 ? "payed" : "unpayed");
        payEl.innerText = placement.money > 0 ? "" : "$";

        if (!bedDiv.querySelector(".pay")) bedDiv.appendChild(payEl);

        if (placement.status == "busy") {



            bedDiv.addEventListener("click", () => {
                open_modal({
                    title: "Освободить койку?",
                    body: `${position_rus}\n${status_rus}\n${name}`,
                    controls: buttons_reset_bed(placement, current_arrival_cost)
                });
            });
        }
        if (placement.status == "reserved") {
            bedDiv.addEventListener("click", () => {
                open_modal({
                    title: "Койка зарезервированна.",
                    body: `${position_rus}\n${status_rus}\n${name}`,
                    controls: buttons_pay_bed(placement, current_arrival_cost)
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

    bedDiv.addEventListener('contextmenu', (e) => {
        document.querySelectorAll('.bed-overlay').forEach(o => {
            console.log(o)
            o.remove();
        });
        open_menu(e, bed_menu(placement, current_arrival_cost));
    });

    if (bed.position === "upper") { upContainer.appendChild(bedDiv); }
    else { downContainer.appendChild(bedDiv); }
}