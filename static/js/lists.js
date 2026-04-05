function fillArrivals(arrivals) {
    let select = document.getElementById("currentArrival")
    let current_selection = select.value
    select.innerHTML = ""

    arrivals.forEach(b => {
        let opt = document.createElement("option")
        opt.value = b.id
        opt.innerText = b.name
        select.appendChild(opt)
    })
    if (current_selection) select.value = current_selection
    else select.value = arrivals[0].id
}
function fillSities(sities) {

}