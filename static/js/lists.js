let arrivalSelectInitialized = false;
let free_buildings = [];
let free_rooms = [];
let free_beds = [];
async function fillArrivals(data) {
    const select = document.getElementById("currentArrival");
    const wrapper = document.getElementById("arrivalSelectWrapper");
    const trigger = wrapper.querySelector(".custom-select-trigger");
    const optionsContainer = wrapper.querySelector(".custom-options");





    select.innerHTML = "";
    trigger.innerText = ""
    optionsContainer.innerHTML = "";

    trigger.onclick = () => {
        if (optionsContainer.classList.contains("invisible")) {
            optionsContainer.classList.remove("invisible")
        } else {
            optionsContainer.classList.add("invisible")
        }
    }

    data.arrivals.forEach(a => {
        // --- обычный select
        const opt = document.createElement("option");
        opt.value = a.id;
        opt.innerText = a.name;
        select.appendChild(opt);
        // --- кастомный option
        const customOpt = document.createElement("div");
        customOpt.className = "custom-option";
        customOpt.innerText = a.name;
        customOpt.dataset.value = a.id;
        customOpt.addEventListener("click", (e) => {
            select.value = a.id;

            trigger.innerText = a.name;
            optionsContainer.querySelectorAll(".custom-option")
                .forEach(o => o.classList.remove("selected"));
            customOpt.classList.add("selected");
            optionsContainer.classList.add("invisible")
            loadData()
        });
        optionsContainer.appendChild(customOpt);
    });



    const selected = data.arrivals.find(a => a.id == select.value);
    if (selected) {
        trigger.innerText = selected.name;

        const selectedOption = optionsContainer.querySelector(`[data-value="${selected.id}"]`);
        if (selectedOption) selectedOption.classList.add("selected");
    }
    trigger.addEventListener('contextmenu', (e) => {
        const cur_arr_id = current_arrival_id();
        const arrival = data.arrivals.find(a => a.id == cur_arr_id);
        open_menu(e, arrival_menu(arrival, data.placements));
    });
}
function fillSities(sities) {
    const select = document.getElementById("visitorSity");
    if (!select) return;

    // Сохраняем имя и другие атрибуты оригинального select
    const selectName = select.name || "visitorSity";

    // Если элемент ввода уже создан ранее – удаляем старый, чтобы избежать дублирования
    const existingInput = document.getElementById("visitorSityInput");
    if (existingInput) existingInput.remove();
    const existingDatalist = document.getElementById("cityDatalist");
    if (existingDatalist) existingDatalist.remove();

    // Создаём input с автодополнением
    const input = document.createElement("input");
    input.classList.add("f7");
    input.type = "text";
    input.id = "visitorSityInput";
    input.placeholder = "Введите или выберите город";
    input.setAttribute("list", "cityDatalist");
    input.autocomplete = "off";

    // Создаём datalist, который будет содержать варианты городов
    const datalist = document.createElement("datalist");
    datalist.id = "cityDatalist";

    // Заполняем datalist опциями из списка городов
    sities.forEach(city => {
        const option = document.createElement("option");
        option.value = city.name;  // отображаемое и отправляемое значение
        datalist.appendChild(option);
    });

    // Вставляем input и datalist перед select
    select.parentNode.insertBefore(input, select);
    document.body.appendChild(datalist); // datalist может быть в любом месте, но лучше рядом с input

    // Скрываем оригинальный select (он остаётся в DOM для отправки формы)
    select.style.display = "none";

    // Функция синхронизации значения input с select
    function syncSelect(value) {
        // Очищаем все option в select (кроме тех, что могут быть нужны)
        select.innerHTML = "";
        // Добавляем выбранное значение как option
        const option = new Option(value, value);
        select.add(option);
        option.selected = true;
        // Если нужно сохранить все города в select (для обратной совместимости), 
        // можно добавить их скрытыми, но это не обязательно
    }

    // Обработчик изменения input (выбор из datalist или ручной ввод)
    input.addEventListener("change", function () {
        let value = this.value.trim();
        if (value !== "") {
            syncSelect(value);
        }
    });

    // Также можно синхронизировать при потере фокуса, если пользователь ввёл текст
    input.addEventListener("blur", function () {
        let value = this.value.trim();
        if (value !== "") {
            syncSelect(value);
        }
    });

    // Если в select уже было выбрано какое-то значение – переносим его в input
    if (select.options.length > 0 && select.options[0].value) {
        input.value = select.options[select.selectedIndex]?.text || "";
    }
}
async function fillPrePlace_info(data) {

    const cur_arr_id = await current_arrival_id();
    const cur_placements = data.placements.filter(p => p.arrival_id == cur_arr_id);

    free_rooms = []
    free_buildings = []
    free_beds = data.beds.filter(bed =>
        !cur_placements.find(p => p.bed_id == bed.id)
    )


    free_beds.forEach(b => {
        const room = data.rooms.find(r => r.id == b.room_id)
        const building = data.buildings.find(bu => bu.id == room.building_id)

        if (free_rooms.find(r => r.id == room.id) == null) free_rooms.push(room);
        if (free_buildings.find(b => b.id == building.id) == null) free_buildings.push(building);
    })

    fill_prePlace_Buildings();
    
    
}

function fill_prePlace_Buildings() {
    const build_new_visitor = document.getElementById("build_new_visitor");
    free_buildings.forEach(b => {
        const opt = document.createElement("option")
        opt.value = b.id
        opt.innerText = b.name
        build_new_visitor.appendChild(opt)
    })
    fill_prePlace_rooms();
}
function fill_prePlace_rooms() {
    const build_new_visitor = document.getElementById("build_new_visitor");
    const room_new_visitor = document.getElementById("room_new_visitor");
    room_new_visitor.innerHTML = "";
    free_rooms.forEach(room => {

        if (room.building_id == build_new_visitor.value) {
            const opt = document.createElement("option")
            opt.value = room.id
            opt.innerText = room.number
            room_new_visitor.appendChild(opt)
        }
    });
    fill_prePlace_beds();
}
function fill_prePlace_beds() {
    const room_new_visitor = document.getElementById("room_new_visitor");
    const bed_new_visitor = document.getElementById("bed_new_visitor");
    bed_new_visitor.innerHTML = "";
    free_beds.forEach(bed => {

        if (bed.room_id == room_new_visitor.value) {
            const opt = document.createElement("option")
            opt.value = bed.id
            opt.innerText = bed.id + " (" +
                (bed.position == "lower" ? "Нижняя" :
                    (bed.position == "upper" ? "Верхняя" : (
                        bed.position == "bigger-left" ? "Двойная-лев" :"Двойная-прав"
                )))+")";
            bed_new_visitor.appendChild(opt)
        }
    });
}

