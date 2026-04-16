function set_style(style_path) {
	var cssLink = document.createElement('link');
	cssLink.rel = 'stylesheet';
	cssLink.href = style_path;
	document.head.appendChild(cssLink);
}

function old_styles() {
	set_style("/static/styles/old_styles/style.css");
	set_style("/static/styles/old_styles/map_style.css");
	set_style("/static/styles/old_styles/modal.css");
	set_style("/static/styles/old_styles/search.css");
	set_style("/static/styles/old_styles/animation.css");
	set_style("/static/styles/old_styles/visitors.css");
	set_style("/static/styles/old_styles/arrival_info.css");
	set_style("/static/styles/old_styles/context_menu.css");
}
function new_styles() {
	set_style("/static/styles/new_styles/core.css");
	set_style("/static/styles/new_styles/map.css");
	set_style("/static/styles/new_styles/modal.css");
	set_style("/static/styles/new_styles/search.css");
	set_style("/static/styles/new_styles/animation.css");
	set_style("/static/styles/new_styles/visitors.css");
	set_style("/static/styles/new_styles/arrival_info.css");
	set_style("/static/styles/new_styles/context_menu.css");
	set_style("/static/styles/new_styles/bed.css");
}

