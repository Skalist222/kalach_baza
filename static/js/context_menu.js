function open_menu(e, menuItems) {
	if (menuItems.length == 0) return;
	const menu = document.getElementById("contextMenu");

	menu.innerHTML = "";

	menuItems.forEach(({ text, action }) => {
		const menuItem = document.createElement("div");
		menuItem.classList.add("item");
		menuItem.textContent = text;
		menuItem.onclick = () => {
			action();
			menu.style.display = "none";
		};
		menu.appendChild(menuItem);

		const menuLine = document.createElement("div");
		menuLine.classList.add("line");
		menu.appendChild(menuLine);
	});

	if (menu.lastElementChild) menu.removeChild(menu.lastElementChild);

	menu.style.display = "block";
	menu.style.left = e.pageX + "px";
	menu.style.top = e.pageY + "px";

	// 👇 ВАЖНО — один обработчик
	document.onclick = () => {
		menu.style.display = "none";
	};
}
function visitor_menu(visitor, placements, current_arrival, arrival_cost) {
	const hasPlacements = placements.length > 0
	menu = [
		{
			"text": "Редактировать", action: () => {
				open_modal({ "title": "Редактор посетителя", "body": "", "controls": modal_redact_visitor(visitor), "in_lines": true });
			}
		}
	]
	if (!hasPlacements) {
		menu.push({
			"text": "Удалить", action: () => {

				open_modal({ "title": "Удаление посетителя", "body": "Вы уверены что хотите удалить посетителя " + visitor.name + "?", "controls": modal_delete_visitor(visitor) });
				console.log("нажата кнопка удалить")

			}
		});
		menu.push({
			"text": "Без заселения", action: () => {
				open_modal({ "title": "Взнос без заселения", "body": "Точно посетитель " + visitor.name + " не будет заселяться?", "controls": buttons_pay_without_bed(visitor, current_arrival, arrival_cost) });
				console.log("нажата кнопка удалить")
			}
		});
	}
	else {
		if (placements.find(el => el.arrival_id == current_arrival && el.bed_id == -1)) {
			menu.push({
				"text": "Вернуть оплату", action: () => { replace(placements[0].visitor_id,-1,current_arrival) }
			});
		}
		console.log(placements)
	}
	return menu
}
function bed_menu(placement, arrival_cost) {
	let menu = []
	if (!placement) return []


	if (placement.status == "busy") {


	}
	else if (placement.status == "reserved") {

	}
	if (placement.money == 0) {
		menu = [
			{
				"text": "Оплатили", action: () => {
					update_place(placement.visitor_id, placement.bed_id, placement.status, arrival_cost, placement.arrival_id)
				}
			}
		]
	}
	menu.push(
		{
			"text": "Освободить", action: () => {
				replace(placement.visitor_id,placement.bed_id, placement.arrival_id)
			}
		})
	return menu
}

function arrival_menu(arrival, placements) {
	menu = []
	const current_placements = placements.filter(el => el.arrival_id == arrival.id)
	console.log(current_placements)

	if (current_placements.length == 0) {
		menu.push({
			"text": "Удалить", action: () => {
				open_modal({ "title": "Удаление заезда", "body": "Вы уверены, что хотите удалить заезд (" + arrival.name + ")?", "controls": modal_delete_arrival(arrival) });
			}
		})
	}
	return menu

}