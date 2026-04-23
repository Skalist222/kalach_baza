function puzzle(informations_elements,base_element_class) {
     const visual_element = document.createElement("div")
     visual_element.classList = base_element_class
     informations_elements.forEach(el => {
        if(!el.class) el.class = ""  
        const child = document.createElement("div")
        child.classList = el.class
        child.innerHTML = el.text
        visual_element.appendChild(child)
     });
     return visual_element
}
function tooltips_elements(elements_names) {
     let visual_element = document.createElement("div")
     elements_names.forEach(name => {
        let element = document.createElement("div")
        element.classList = "info_tooltip"
        element.innerHTML = name
        visual_element.appendChild(element)
     });
     return visual_element
}
function v_element(type, text, value) {
     let element = document.createElement(type)
     element.innerHTML = text
     element.value = value
     return element
}
