document.addEventListener('DOMContentLoaded', function () {
    showInfos("Tertiaire");
    showReferences("Tertiaire");
    var swiper = new Swiper(".secteurs__swipper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 4.5,
        loop: true,
        loopedSlides: 4,
        coverflowEffect: {
          rotate: 20,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
          scale: 0.8,
        },
        //  on: {
        //      beforeInit: function() {
        //          setTimeout(() => {
        //             this.update();
        //              this.slideTo(3, 0, false); // Revenir au premier slide
        //          }, 100); // Ajuste le délai si nécessaire
        //      },
        //  },
    });
    swiper.on('transitionEnd', function(){
        console.log(swiper.slides[swiper.activeIndex].querySelector(".secteurs__icone").alt);
        showInfos(swiper.slides[swiper.activeIndex].querySelector(".secteurs__icone").alt);
        showReferences(swiper.slides[swiper.activeIndex].querySelector(".secteurs__icone").alt);
    })
});

var swiper = new Swiper(".clients__swipper", {
    effect: "none",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 6,
    loop: true,
    loopedSlides: 4,
    spaceBetween: 50,
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        waitForTransition :false,
      },
});

async function showSecteurs(){
    // const reponse = await fetch("http://localhost:1337/api/secteurs?populate=*");
    const reponse = await fetch("../../packages/secteurs.json");
    const secteurs = await reponse.json();

    const swiper = document.querySelector(".swiper-wrapper");

    for (i = 0; i<0 ; i++){
        secteurs.data.forEach(secteur => {
            const slide = document.createElement("div");
            slide.className = "swiper-slide";
    
            const icone = document.createElement("img");
            icone.className = "secteurs__icone";
    
            if(secteur.attributes.Design.data === null){
                alert("Maintenance en cours !");
            }
            else{
                icone.src = "../../my-strapi-project/public" + secteur.attributes.Design.data.attributes.url;
            }
    
            icone.alt = secteur.attributes.NomSecteur;
    
            slide.appendChild(icone);
            swiper.appendChild(slide);
            // TODO : Doubler le nombre de slides pour éviter les bugs 
        })
    }
}

showSecteurs();


async function showInfos(nom){
    // const reponse = await fetch("http://localhost:1337/api/secteurs?populate=*");
    const reponse = await fetch("../../packages/secteurs.json");
    const secteurs = await reponse.json();

    secteurs.data.forEach(secteur => {
        if (secteur.attributes.NomSecteur === nom){
            createInfos(secteur.attributes.Description);
        }
        else {
            
        }
    });
}


function createInfos(descriptionSecteurs){
    const infos = document.querySelector(".infos");
    infos.innerHTML = "";

    const content = document.createElement("div");
    content.className = "content";

    const text = document.createElement("p");
    text.className = "infos__text";
    text.innerText = descriptionSecteurs;

    const button = document.createElement("button");
    button.classList.add("infos__btn");
    button.classList.add("cta");
    button.textContent = "Contactez-nous !";

    content.appendChild(text);
    content.appendChild(button);
    infos.appendChild(content);
}

function getNom(){
        const active = document.querySelector(".swiper-slide-active");
        console.log(active);
        console.log("test");
        if (active) {
            const icone = active.querySelector(".secteurs__icone");
            if (icone) {
                const nom = icone.alt;
                console.log(nom);
                return nom;
            } else {
                console.error("Aucun élément avec la classe 'secteurs__icone' n'a été trouvé dans 'swiper-slide-active'.");
            }
        } else {
            console.error("Aucun élément avec la classe 'swiper-slide-active' n'a été trouvé.");
        }
}


// REFERENCES
const contentRef = document.querySelector(".references__content");

async function showReferences(secteurTheorique){
    // const reponse = await fetch("http://localhost:1337/api/secteurs?populate=*");
    const reponse = await fetch("../../packages/references.json");
    const references = await reponse.json();
    let counter = 0;

    contentRef.innerHTML = "";

    references.data.forEach(reference =>{
        counter = counter + 1;
        const secteur = reference.attributes.secteur.data.attributes.NomSecteur;
        if (secteur === secteurTheorique){
            let nomChantier = reference.attributes.NomChantier;
            let urlImagePrincipal = "../../my-strapi-project/public" + reference.attributes.ImagePrincipale.data.attributes.url;

            createRef(nomChantier,urlImagePrincipal,counter);
            ouverturePopUp();
        }
    })
}

function createRef(nom,url,count){
    const divRef = document.createElement("div");
    divRef.className = "reference";

    const titleRef = document.createElement("h3");
    titleRef.className = "reference__title";
    titleRef.innerText = nom;

    const imageRef = document.createElement("img");
    imageRef.className = "reference__image--principal"
    imageRef.src = url;
    imageRef.alt = nom;

    const buttonRef = document.createElement("button");
    buttonRef.classList.add("reference__button");
    buttonRef.classList.add("cta");
    buttonRef.classList.add("modal-trigger-entry");
    buttonRef.textContent = "Découvrir !";
    
    divRef.appendChild(titleRef);
    divRef.appendChild(imageRef);
    divRef.appendChild(buttonRef);
    contentRef.appendChild(divRef);
}


// POPUP REFERENCES

async function createModal(nomChantier){
    const modalContent = document.querySelector(".modal__content");

    const reponse = await fetch("http://localhost:1337/api/reference?populate=*");
    const references = await reponse.json();

    for (let reference of references.data) {
        console.log("test");
        const referenceData = reference.attributes;
        if (referenceData.NomOffre === nomChantier) {
            const hero = document.createElement("div");
            hero.className = "modal__hero";

            const chantier = document.createElement("h2");
            chantier.className = "modal__title";
            chantier.textContent = nomChantier & "-" & reference.attributes.LocalisationChantier;
            hero.appendChild(chantier);

            const sousTitre = document.createElement("h2");
            sousTitre.className = "modal__subtitle";
            sousTitre.textContent = reference.attributes.SousTitre;
            hero.appendChild(sousTitre);
            
            const baniere = document.createElement("img");
            baniere.className = "modal__baniere";
            baniere.textContent = "../../my-strapi-project/public" + reference.attributes.Baniere.data.attributes.url;
            hero.appendChild(baniere);

            modalContent.appendChild(hero);
            
            const descript = document.createElement("p");
            descript.className = "modal__descript";
            descript.textContent = reference.attributes.Description;
            modalContent.appendChild(descript);

            const infos = document.createElement("div");
            infos.className = "modal__infos";

            const infosG = document.createElement("div");
            infosG.className = "modal__infos--gauche";
            
            const infosD = document.createElement("div");
            infosD.className = "modal__infos--droite";

            const montant = document.createElement("p");
            montant.className = "modal__info";
            montant.textContent = "Montant du projet : " & reference.attributes.MontantChantier;
            infosD.appendChild(montant);

            const maitre = document.createElement("p");
            maitre.className = "modal__info";
            maitre.textContent = "Maître d'ouvrage : " & reference.attributes.MaitreOuvrage;
            infosG.appendChild(maitre); 

            const archi = document.createElement("p");
            archi.className = "modal__info";
            archi.textContent = "Architecte : " & reference.attributes.Architecte;
            infosG.appendChild(archi);
            
            const etude = document.createElement("p");
            etude.className = "modal__info";
            etude.textContent = "Bureau d'Etudes : " & reference.attributes.BureauEtude;
            infosG.appendChild(etude);
            
            const date = document.createElement("p");
            date.className = "modal__info";
            date.textContent = "Date de livraison : " & reference.attributes.DateLivraison;
            infosD.appendChild(date);
            
            const duree = document.createElement("p");
            duree.className = "modal__info";
            duree.textContent = "Intervention CVCA Energies : " & reference.attributes.DureeChantier;
            infosD.appendChild(duree);

            infos.appendChild(infosG);
            infos.appendChild(infosD);

            const imageContent = document.createElement("div");
            imageContent.className = "modal__images";
            reference.attributes.ImagesSecondaires.forEach(image =>{
                const img = document.createElement("img");
                img.className = "modal__image";
                img.url = "../../my-strapi-project/public" + image.data.attributes.url;
                imageContent.appendChild(img);
            })
            
            modalContent.appendChild(infos);
            modalContent.appendChild(imageContent);
            break;
        }
    }
}

function ouverturePopUp(){
    const modal = document.querySelector(".references__modal"); 
    
    const modalTriggersEntry = document.querySelectorAll(".modal-trigger-entry"); 
    console.log(modalTriggersEntry);
    
    modalTriggersEntry.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const reference = trigger.closest(".reference");
            const nomChantier = reference.querySelector(".reference__title").textContent.trim();
            modal.classList.add("active");

            // Jusqu'à ça c'est good
            createModal(nomChantier);
        });
    });
}

function fermeturePopUp(){
    const modalTriggersExit = document.querySelectorAll(".modal-trigger"); 

    modalTriggersExit.forEach(trigger => {
        trigger.addEventListener("click", () => {
            modal.classList.toggle("active");
            deleteModal();
        });
    });
}

function deleteModal(){
    const modalContent = document.querySelector(".modal__content");
    modalContent.innerHTML = '';
}