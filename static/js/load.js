function show_loading() {
    const loader = document.getElementById("global-loader");
    loader.classList.remove("invisible")
}
function hide_loading() {
    const loader = document.getElementById("global-loader");
    loader.classList = "invisible"
}