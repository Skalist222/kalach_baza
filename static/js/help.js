let sortVisitorElement = document.getElementById("sortVisitors")
let debounceTimer;
sortVisitorElement.addEventListener("input", (e) => {
    loadVisitors();

    // clearTimeout(debounceTimer);
    // debounceTimer = setTimeout(() => {
    //     loadVisitors();
    // }, 100);
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
function collapse(button, text_button = "Добавить") {
    let button_id = button.id
    if (String(button_id).startsWith("collapse_")) {
        let colapsable_el = button_id.substring("collapse_".length)
        let el = document.getElementById(colapsable_el)
        if (el.classList.contains("collapsed")) {
            button.innerText = "▲"
            el.classList.remove("collapsed")
        }
        else {
            el.classList.add("collapsed")
            button.innerText = text_button + " ▼"

        }
        button.in
    }

}

document.getElementById("collapse_visitor_add").click()
document.getElementById("collapse_arrival_add").click()