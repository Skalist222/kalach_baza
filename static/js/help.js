let sortVisitorElement = document.getElementById("sortVisitors")
let debounceTimer;
let bedTemplate, modalTemplate;

async function init() {
    bedTemplate = await TemplateCache.getTemplate("/templates/bed.html");
    modalTemplate = await TemplateCache.getTemplate("/templates/modal.html");
}

init();




sortVisitorElement.addEventListener("input", (e) => {
    loadVisitors();
});


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


async function getTemplateFromFile(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Не удалось загрузить шаблон: " + path);
    const text = await res.text();

    const template = document.createElement("template");
    template.innerHTML = text.trim();
    return template.content.cloneNode(true);
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
document.getElementById("collapse_visitor_add").click()
document.getElementById("collapse_arrival_add").click()