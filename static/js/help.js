let sortVisitorElement = document.getElementById("sortVisitors")
let debounceTimer;
let bedTemplate, modalTemplate;

function current_arrival_id() {
    const current_arrival = document.getElementById("currentArrival");
    const id = current_arrival.value;
    if (id) return id;
    else return 1;
}

async function init() {
    bedTemplate = await TemplateCache.getTemplate("/templates/bed.html");
    modalTemplate = await TemplateCache.getTemplate("/templates/modal.html");
}




sortVisitorElement.addEventListener("input", (e) => {
    loadVisitors();
});


function preplace_on_off() {
    const on_off_preplace = document.getElementById("on_off_preplace")
    const preplace = document.getElementById("preplace")
    if(on_off_preplace.checked){
        preplace.classList.remove("invisible")
    }
    else{
        preplace.classList.add("invisible")
    }
}

async function alert_element(e) {
    color = e.style.backgroundColor
    e.style.backgroundColor = "#f09292"
    e.addEventListener("click", (el) => {
        e.style.backgroundColor = color
        e.removeEventListener("click", () => { })
    })
}

async function get_table(table_name) {
    let res = await fetch("/api/" + table_name)
    let result_table = (await res.json())[table_name]
    return result_table
}
async function get_last(table_name){
    const result = await get_table(table_name)
    return result[result.length-1]
}

async function getTemplateFromFile(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Не удалось загрузить шаблон: " + path);
    const text = await res.text();

    const template = document.createElement("template");
    template.innerHTML = text.trim();
    return template.content.cloneNode(true);
}

function today_string() {
    const today = new Date().toISOString().slice(0, 10);
    return today
}
function set_today() {
    let currentDate = document.getElementById("currentDate")
    currentDate.innerHTML = today_string()
}

function collapse(button, text_button = "Добавить") {
    let button_id = button.id;

    if (!String(button_id).startsWith("collapse_")) return;

    let collapsable_id = button_id.substring("collapse_".length);
    let el = document.getElementById(collapsable_id);

    if (!el) return;

    if (el.classList.contains("collapsed")) {
        // 🔽 ОТКРЫВАЕМ
        el.classList.remove("collapsed");
        el.classList.remove("no_margin");
        el.classList.remove("no_padding");
        el.style.maxHeight = "0px"; // старт
        el.offsetHeight; // форс рефлоу

        el.style.maxHeight = el.scrollHeight + "px";

        button.innerText = "▲";

    } else {
        // 🔼 ЗАКРЫВАЕМ
        el.style.maxHeight = el.scrollHeight + "px"; // фиксируем текущую высоту
        el.offsetHeight;

        el.style.maxHeight = "0px";

        button.innerText = text_button + " ▼";

        // после завершения анимации
        el.addEventListener("transitionend", function handler() {
            el.classList.add("collapsed");
            el.classList.add("no_margin");
            el.classList.add("no_padding");
            el.removeEventListener("transitionend", handler);
        });
    }
}

function toggleMenu() {
    document.querySelector(".left-panel").classList.toggle("open");
}

document.getElementById("collapse_visitor_add").click()
document.getElementById("collapse_arrival_add").click()
document.getElementById("collapse_settings").click()
// document.getElementById("collapse_plase_new_visitor").click()
document.getElementById("on_off_preplace").click()
init();
set_today();