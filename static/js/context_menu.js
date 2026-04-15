function open_menu(e, menuItems) {
	const menu = document.getElementById("contextMenu");

	// Очищаем предыдущие элементы меню
	menu.innerHTML = "";
	// Добавляем новые элементы меню
	menuItems.forEach(({ text, action }) => {
		console.log(text);
		const menuItem = document.createElement("div");
		menuItem.classList.add("item");
		menuItem.textContent = text;
		menuItem.onclick = (ev) => { action(); };
		menu.appendChild(menuItem);
		const menuLine = document.createElement("div");
		menuLine.classList.add("line");
		menu.appendChild(menuLine);
	});
	menu.removeChild(menu.lastElementChild);

	menu.style.display = "block";
	menu.style.left = (e.pageX) + "px";
	menu.style.top = (e.pageY) + "px";

	// скрытие при клике
	document.addEventListener("click", () => {
		menu.style.display = "none";
	});
}
function visitor_menu(visitor, hasPlacements) {
	console.log(hasPlacements)
	menu = [
		{
			"text": "Редактировать", action: () => {
				open_modal({ "title": "Редактор посетителя", "body": "", "controls": modal_redact_visitor(visitor), "in_lines": true });
			}
		}
	]
	if (!hasPlacements) menu.push({
		"text": "Удалить", action: () => {

			open_modal({ "title": "Удаление посетителя", "body": "Вы уверены что хотите удалить посетителя " + visitor.name + "?", "controls": modal_delete_visitor(visitor) });
			console.log("нажата кнопка удалить")

		}
	})
	return menu
}