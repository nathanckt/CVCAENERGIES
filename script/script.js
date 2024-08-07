//Bouton de menu
const hamburgerToggler = document.querySelector(".hamburger");
const navLinksContainer = document.querySelector(".navlinks-container");

const toggleNav = () =>{
    hamburgerToggler.classList.toggle("open")

    const arieToggle = hamburgerToggler.getAttribute("aria-expeanded") === "true" ? "false" : "true";
    hamburgerToggler.setAttribute("aria.expanded", arieToggle)

    navLinksContainer.classList.toggle("open")
}
hamburgerToggler.addEventListener("click", toggleNav)


new ResizeObserver(entries => {
    if (entries[0].contentRect.width <= 900){
      navLinksContainer.style.transition = "transform 0.3s ease-out";
    } else {
      navLinksContainer.style.transition = "none";
    }
  }).observe(document.body)


const reponse = await fetch("http://localhost:1337/api/reference");
const references = await reponse.json();

const reference = references[0];

const titreElement = document.createElement("h1");
titreElement.innerText = "test";

const descriptElement = document.createElement("p");
descriptElement.innerText = reference.Description;
