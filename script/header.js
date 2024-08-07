const toggler = document.querySelector(".hamburger");
const navLinksContainers = document.querySelector(".navlinks-container");

const toggleNav = e =>{
    toggler.classList.toggle("open");
    navLinksContainers.classList.toggle("open");
}

toggler.addEventListener("click", toggleNav)