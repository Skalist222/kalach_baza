function fillArrivals(arrivals) {
    const select = document.getElementById("currentArrival");
    const wrapper = document.getElementById("arrivalSelectWrapper");
    const trigger = wrapper.querySelector(".custom-select-trigger");
    const optionsContainer = wrapper.querySelector(".custom-options");

    let current_selection = select.value;

    // очищаем
    select.innerHTML = "";
    optionsContainer.innerHTML = "";

    arrivals.forEach(a => {
        // --- обычный select (для логики)
        const opt = document.createElement("option");
        opt.value = a.id;
        opt.innerText = a.name;
        select.appendChild(opt);

        // --- кастомный option
        const customOpt = document.createElement("div");
        customOpt.className = "custom-option";
        customOpt.innerText = a.name;
        customOpt.dataset.value = a.id;

        customOpt.addEventListener("click", () => {
            select.value = a.id;

            trigger.innerText = a.name;

            optionsContainer.querySelectorAll(".custom-option")
                .forEach(o => o.classList.remove("selected"));

            customOpt.classList.add("selected");

            optionsContainer.style.display = "none";

            // ВАЖНО: вызываем change вручную
            select.dispatchEvent(new Event("change"));
        });

        optionsContainer.appendChild(customOpt);
    });

    // восстановление выбранного
    if (current_selection) select.value = current_selection;
    else if (arrivals.length > 0) select.value = arrivals[0].id;

    // обновляем текст
    const selected = arrivals.find(a => a.id == select.value);
    if (selected) {
        trigger.innerText = selected.name;

        const selectedOption = optionsContainer.querySelector(`[data-value="${selected.id}"]`);
        if (selectedOption) selectedOption.classList.add("selected");
    }

    // клик по триггеру
    trigger.onclick = () => {
        optionsContainer.style.display =
            optionsContainer.style.display === "block" ? "none" : "block";
    };

    // клик вне — закрытие
    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) {
            optionsContainer.style.display = "none";
        }
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
