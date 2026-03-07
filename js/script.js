const links = document.querySelectorAll("nav a")
const panels = document.querySelectorAll(".panel")

links.forEach(link=>{

link.addEventListener("click",e=>{

e.preventDefault()

const id = link.getAttribute("href").substring(1)

panels.forEach(panel=>{
panel.classList.remove("active")
})

document.getElementById(id).classList.add("active")

})

})

/* Dark Mode */

const toggle = document.getElementById("themeToggle")

toggle.onclick=()=>{
document.body.classList.toggle("light")
}

/* Loading Screen */

window.onload=()=>{

setTimeout(()=>{

document.getElementById("loader").style.display="none"

},1500)

}

/* Particles */

const canvas=document.getElementById("particles")
const ctx=canvas.getContext("2d")

canvas.width=window.innerWidth
canvas.height=window.innerHeight

let particleCount = window.innerWidth < 600 ? 40 : 80

let particles=[]

for(let i=0;i<particleCount;i++){

particles.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2,
speed:Math.random()*0.5

})

}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height)

particles.forEach(p=>{

ctx.fillStyle="rgba(255,255,255,0.5)"

ctx.beginPath()

ctx.arc(p.x,p.y,p.size,0,Math.PI*2)

ctx.fill()

p.y+=p.speed

if(p.y>canvas.height)p.y=0

})

requestAnimationFrame(animate)

}

animate()
