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

    let select = document.getElementById("visitorSity")
    
    sities.forEach((val, id) => {
        let option = new Option(val.name, "value" + id);
        select.add(option);
        console.log(option)
        option.addEventListener('click', (e) => {
            console.log(e)
            search.value = e.target.textContent;
        })
    });
}