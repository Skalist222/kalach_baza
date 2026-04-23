let template;
async function init() {
    template = await TemplateCache.getTemplate("/templates/modal.html");
}
init();

function closeModal() {
    document.querySelectorAll(".modal").forEach(m => m.remove());
}

const modalElementRenderers = {
    btn: ({ id, text, action }) => {
        const btn = document.createElement("button");
        if (id) btn.id = id;
        btn.innerText = text;

        btn.onclick = () => {
            action?.();
            closeModal();
        };

        return btn;
    },

    input: ({ id, text, value }) => {
        const input = document.createElement("input");
        if (id) input.id = id;
        input.placeholder = text || "";
        if (value !== undefined) input.value = value;
        return input;
    },
    number: ({ id, text, value, step, width }) => {
        const input = document.createElement("input");
        if (id) input.id = id;
        input.type = "number"
        input.placeholder = text || "";
        input.value = value
        input.step = step || "500"
        input.style.width = width || "10%"
        return input;
    },
    date: ({ id, text, value }) => {
        const input = document.createElement("input");
        if (id) input.id = id;
        input.type = "date"
        input.placeholder = text || "";
        input.value = value
        return input;
    }
};
let mouseDownInside = false;
function open_modal({ title = "", body = "", controls = [], in_lines = false }) {
    const modalTemplate = document.getElementById("modal-template").content.cloneNode(true);

    const modal = modalTemplate.querySelector(".modal");
    const titleEl = modalTemplate.querySelector(".modal-title");
    const bodyEl = modalTemplate.querySelector(".modal-body");
    const controlsEl = modalTemplate.querySelector(".modal-controls");
    controlsEl.classList.remove("greed");
    controlsEl.classList.remove("row");

    titleEl.innerText = title;
    bodyEl.innerHTML = body.replace(/\n/g, "<br>");

    controls.forEach(control => {
        const renderer = modalElementRenderers[control.type];
        if (!renderer) return;

        const el = renderer(control);
        controlsEl.appendChild(el);
        if (in_lines) {
            controlsEl.classList.add("greed");
            controlsEl.classList.add("row");
        }
    });

    const escHandler = (e) => {
        if (e.key === "Escape") {
            closeModal();
            document.removeEventListener("keydown", escHandler);
        }
    };
    document.addEventListener("keydown", escHandler);


    modal.addEventListener("mousedown", (e) => {
        mouseDownInside = e.target.closest(".modal-content") !== null;
    });
    modal.addEventListener("click", (e) => {
        const clickedOutside = e.target === modal;
        if (clickedOutside && !mouseDownInside) {
            closeModal();
        }

        mouseDownInside = false; // сброс
    });

    document.body.appendChild(modalTemplate);
}


function buttons_set_bed(visitor_id, bed_id, current_arrival_id, money) {
    return [
        { type: "number", id: "money", text: "Пожертвование", value: money },
        { type: "btn", id: "btnBusy", text: "Занять койку", action: () => place(visitor_id, bed_id, "busy", current_arrival_id, document.getElementById("money").value) },
        { type: "btn", id: "btnReserved", text: "Зарезервировать", action: () => place(visitor_id, bed_id, "reserved", current_arrival_id, 0) },
        { type: "btn", id: "btnCancel", text: "Отмена", action: () => { } }
    ];
}
function buttons_update_bed(visitor_id, bed_id, current_arrival_id) {
    return [
        { type: "btn", id: "btnBusy", text: "Перезанять", action: () => update_place(visitor_id, bed_id, "busy", current_arrival_id) },
        { type: "btn", id: "btnReserved", text: "Перерезервировать", action: () => update_place(visitor_id, bed_id, "reserved", current_arrival_id) },
        { type: "btn", id: "btnCancel", text: "Отмена", action: () => { } }
    ];
}

function buttons_reset_bed(placement, ariival_cost) {

    if (placement.money == 0) {
        return [
            { type: "number", id: "money", text: "Пожертвование", value: ariival_cost },
            { type: "btn", id: "btnReBusy", text: "Оплатить", action: (el) => { update_place(placement.visitor_id, placement.bed_id, placement.status, document.getElementById("money").value, placement.arrival_id) } },
            { type: "btn", id: "btnReBusy", text: "Освободить", action: () => { replace(placement.visitor_id, placement.bed_id, placement.arrival_id) } },
            { type: "btn", id: "btnCancel", text: "Отмена", action: () => { } }
        ]
    }
    else {
        return [
            { type: "btn", id: "btnReBusy", text: "Освободить", action: () => { replace(placement.visitor_id, placement.bed_id, placement.arrival_id) } },
            { type: "btn", id: "btnCancel", text: "Отмена", action: () => { } }
        ]
    }

}

function buttons_pay_bed(placement, money) {

    if (placement.money == 0) {
        return [
            { type: "number", id: "money", text: "Пожертвование", value: money },
            { type: "btn", id: "btnReBusy", text: "Заселить", action: (el) => { update_place(placement.visitor_id, placement.bed_id, "busy", document.getElementById("money").value, placement.arrival_id) } },
            { type: "btn", id: "btnReBusy", text: "Оплатить без заселения", action: (el) => { update_place(placement.visitor_id, placement.bed_id, "reserved", document.getElementById("money").value, placement.arrival_id) } },
            { type: "btn", id: "btnReBusy", text: "Освободить", action: () => { replace(placement.visitor_id, placement.bed_id, placement.arrival_id) } },
            { type: "btn", id: "btnCancel", text: "Отмена", action: () => { } }
        ]
    }
    else {
        return [
            { type: "btn", id: "btnReBusy", text: "Заселить", action: (el) => { update_place(placement.visitor_id, placement.bed_id, "busy", placement.money, placement.arrival_id) } },
            { type: "btn", id: "btnReBusy", text: "Освободить", action: () => { replace(placement.visitor_id, placement.bed_id, placement.arrival_id) } },
            { type: "btn", id: "btnCancel", text: "Отмена", action: () => { } }
        ]
    }

}

function buttons_move_bed(new_bed, placement) {

    return [
        {
            type: "btn", id: "btnReBusy", text: "Переместить", action: () => {
                move_place(placement.visitor_id, placement.bed_id, new_bed, placement.arrival_id);
                closeModal();
            }
        },
        {
            type: "btn", id: "btnReBusy", text: "Дублировать", action: () => {
                place(placement.visitor_id, new_bed, placement.status, placement.arrival_id, placement.money);
                closeModal();
            }
        },
        { type: "btn", id: "btnCancel", text: "Отмена", action: () => { } }
    ]
}

function modal_redact_visitor(visitor) {
    return [
        { type: "input", id: "redact_name_visitor", text: "Имя", value: visitor.name },
        { type: "date", id: "redact_dr", text: "Дата рождения (ДД.ММ.ГГГГ)", value: visitor.dr },
        { type: "input", id: "redact_phone", text: "Телефон", value: visitor.phone },
        {
            type: "btn", id: "btnSave", text: "Сохранить", action: () => {
                update_visitor(
                    visitor.id,
                    document.getElementById("redact_name_visitor").value,
                    document.getElementById("redact_dr").value.replace(".", "-"),
                    document.getElementById("redact_phone").value.replace("(", "").replace(")", "").replace("-", ""));
                closeModal();
            }
        },
        { type: "btn", id: "btnCancel", text: "Отмена", action: () => { } }
    ];
}

function modal_delete_visitor(visitor) {
    return [
        {
            type: "btn", id: "btnSave", text: "Удалить", action: () => {
                delete_visitor(visitor.id);
                closeModal();
            }
        },
        { type: "btn", id: "btnCancel", text: "Отмена", action: () => { } }
    ];
}

function buttons_pay_without_bed(visitor, current_arrival_id, money) {
    return [
        { type: "number", id: "money", text: "Пожертвование", value: money, width: "20%" },
        { type: "btn", id: "btnBusy", text: "Оплатить", action: () => place(visitor.id, -1, "busy", current_arrival_id, document.getElementById("money").value) },
    ];
}

