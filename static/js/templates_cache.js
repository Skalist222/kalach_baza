// templates_cache.js
const TemplateCache = (() => {
	const cache = {};

	// Получение шаблона по URL с кэшированием
	async function getTemplate(url) {
		if (!cache[url]) {
			const response = await fetch(url);
			if (!response.ok) throw new Error(`Не удалось загрузить шаблон: ${url}`);
			const text = await response.text();
			const templateWrapper = document.createElement('template');
			templateWrapper.innerHTML = text.trim();
			cache[url] = templateWrapper.content; // сохраняем только содержимое
		}
		return cache[url].cloneNode(true);
	}

	return { getTemplate };
})();