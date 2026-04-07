function fillArrivals(arrivals) {
    let select = document.getElementById("currentArrival")
    let current_selection = select.value
    select.innerHTML = ""

    arrivals.forEach(b => {
        let opt = document.createElement("option")
        opt.value = b.id
        opt.innerText = b.name
        select.appendChild(opt)
    })
    if (current_selection) select.value = current_selection
    else select.value = arrivals[0].id
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
