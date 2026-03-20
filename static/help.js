let sortVisitorElement = document.getElementById("sortVisitors")
sortVisitorElement.addEventListener("input",(e)=>{
    loadVisitors()
})


async function alert_element(e)
{
    color = e.style.backgroundColor
    e.style.backgroundColor = "#f09292"
    e.addEventListener("click",(el)=>{
        e.style.backgroundColor = color
        e.removeEventListener("click",()=>{})
    })    
}