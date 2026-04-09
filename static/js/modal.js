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

    input: ({ id, placeholder }) => {
        const input = document.createElement("input");
        if (id) input.id = id;
        input.placeholder = placeholder || "";
        return input;
    }
};

function openModal({ title = "", body = "", controls = [] }) {
    const template = document.getElementById("modal-template").content.cloneNode(true);

    const modal = template.querySelector(".modal");
    const titleEl = template.querySelector(".modal-title");
    const bodyEl = template.querySelector(".modal-body");
    const controlsEl = template.querySelector(".modal-controls");

    titleEl.innerText = title;
    bodyEl.innerHTML = body;

    controls.forEach(control => {
        const renderer = modalElementRenderers[control.type];
        if (!renderer) return;

        const el = renderer(control);
        controlsEl.appendChild(el);
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    document.body.appendChild(template);
}

function buttons_set_bed(visitor_id, bed_id, current_arrival_id) {
    return [
        { type: "btn", id: "btnBusy", text: "Занять койку", action: () => place(visitor_id, bed_id, "busy", current_arrival_id) },
        { type: "btn", id: "btnReserved", text: "Зарезервировать", action: () => place(visitor_id, bed_id, "reserved", current_arrival_id) },
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
