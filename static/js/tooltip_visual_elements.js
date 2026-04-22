function tooltips_elements(elements_names) {
     let visual_element = document.createElement("div")
     elements_names.forEach(name => {
        let element = document.createElement("div")
        element.classList = "info_tooltip"
        element.innerText = name
        visual_element.appendChild(element)
     });
     return visual_element
}
function v_element(type, text, value) {
     let element = document.createElement(type)
     element.innerText = text
     element.value = value
     return element
}
