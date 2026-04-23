function show_loading() {
    const loader = document.getElementById("global-loader");
    loader.classList.remove("invisible")
    loader.classList.add('global-loader')

}
function hide_loading() {
    const loader = document.getElementById("global-loader");
    loader.classList.add("invisible")
    loader.classList.remove('global-loader')
}