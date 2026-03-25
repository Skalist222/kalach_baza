function closeModal() {
    let modal_buttons = document.getElementById("modal_buttons")
    let modal = document.getElementById("placementModal")
    while (modal_buttons.firstChild) {
        modal_buttons.removeChild(modal_buttons.firstChild);
    }
    modal.style.display = "none"
}
function open_modal(text, buttons) {
    const modal = document.getElementById("placementModal");
    const modal_text = document.getElementById("modalText");
    const modal_buttons = document.getElementById("modal_buttons");

    modal.style.display = "flex";
    modal_text.innerText = text;

    modal_buttons.innerHTML = ""; // очистка перед добавлением

    buttons.forEach(({ type, id, text, action}) => {
        if (type == "btn") {
            const btn = document.createElement("button");
            btn.id = id;
            btn.innerText = text;
            btn.onclick = () => {
                action();
                closeModal();
            };
            modal_buttons.appendChild(btn);
        }
        if(type == "inpt"){
            const input = document.createElement("input");
            input.placeholder = text;
            input.id = action;
            modal_buttons.appendChild(input);
        }
    });
}

function buttons_set_bed(visitor_id, bed_id, current_arrival_id) {
    return [
        { type: "btn", id: "btnBusy", text: "Занять койку", action: () => place(visitor_id, bed_id, "busy", current_arrival_id) },
        { type: "btn", id: "btnReserved", text: "Зарезервировать", action: () => place(visitor_id, bed_id, "reserved", current_arrival_id) },
        { type: "btn", id: "btnCancel", text: "Отмена", action: () => { } }
    ];
}
function buttons_reset_bed(bed_id,current_arrival_id)
{
    return [
        { type: "btn", id: "btnReBusy", text: "Освободить", action: () => { replace(bed_id,current_arrival_id) } },
        { type: "btn", id: "btnCancel", text: "Отмена", action: () => { } }
    ]
        
}
