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

    input: ({ id, text }) => {
        const input = document.createElement("input");
        if (id) input.id = id;
        input.placeholder = text || "";
        return input;
    },
    number: ({ id, text, value }) => {
        const input = document.createElement("input");
        if (id) input.id = id;
        input.type = "number"
        input.placeholder = text || "";
        input.value = value
        return input;
    }
};
let mouseDownInside = false;
function openModal({ title = "", body = "", controls = [] }) {
    const template = document.getElementById("modal-template").content.cloneNode(true);

    const modal = template.querySelector(".modal");
    const titleEl = template.querySelector(".modal-title");
    const bodyEl = template.querySelector(".modal-body");
    const controlsEl = template.querySelector(".modal-controls");

    titleEl.innerText = title;
    bodyEl.innerHTML = body.replace(/\n/g, "<br>");

    controls.forEach(control => {
        const renderer = modalElementRenderers[control.type];
        if (!renderer) return;

        const el = renderer(control);
        controlsEl.appendChild(el);
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

    document.body.appendChild(template);
}

function buttons_set_bed(visitor_id, bed_id, current_arrival_id, money) {
    console.log("Проверка", current_arrival_id)
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

function buttons_reset_bed(bed_id, current_arrival_id) {
    return [
        { type: "btn", id: "btnReBusy", text: "Освободить", action: () => { replace(bed_id, current_arrival_id) } },
        { type: "btn", id: "btnCancel", text: "Отмена", action: () => { } }
    ]
}

function buttons_pay_bed(visitor_id, bed_id, current_arrival_id, money) {
    return [
        { type: "number", id: "money", text: "Пожертвование", value: money },
        { type: "btn", id: "btnReBusy", text: "Заселить", action: (el) => { update_place(visitor_id, bed_id, "busy", document.getElementById("money").value, current_arrival_id) } },
        { type: "btn", id: "btnReBusy", text: "Освободить", action: () => { replace(bed_id, current_arrival_id) } },
        { type: "btn", id: "btnCancel", text: "Отмена", action: () => { } }
    ]
}
