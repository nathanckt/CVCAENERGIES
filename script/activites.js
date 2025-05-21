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
        breakpoints: {
            0: {
              slidesPerView: 2.5,
            },
            750: {
              slidesPerView: 4.5,
            },
          },
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

let countmodal = 0;

// L'objectif de cette fonction est de pouvoir modifier les icones depuis Strapi
// Pour le moment elle n'est pas en fonctionnement 
async function showSecteurs(){
    const reponse = await fetch("https://rational-flowers-37168cb5d5.strapiapp.com/api/secteurs?populate=*");
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
        })
    }
}



// Cette fonction récupère le texte de chaque secteur sur Strapi pour l'afficher 
async function showInfos(nom){
    const reponse = await fetch("https://rational-flowers-37168cb5d5.strapiapp.com/api/secteurs?populate=*");
    const secteurs = await reponse.json();

    secteurs.data.forEach(secteur => {
        if (secteur.attributes.NomSecteur === nom){
            createInfos(secteur.attributes.Description);
        }
    });
}

// Cette fonction manipule le DOM pour afficher les infos des secteurs
function createInfos(descriptionSecteurs){
    const infos = document.querySelector(".infos");
    infos.innerHTML = "";

    const content = document.createElement("div");
    content.className = "content";

    const text = document.createElement("p");
    text.className = "infos__text";
    text.innerText = descriptionSecteurs;

    const button = document.createElement("a");
    button.classList.add("infos__btn");
    button.classList.add("cta");
    button.href = "../contact.html";
    button.textContent = "Contactez-nous !";

    content.appendChild(text);
    content.appendChild(button);
    infos.appendChild(content);
}

// Cette fonctionne récupère le nom du secteur actuellement au centre du carousel
function getNom(){
        const active = document.querySelector(".swiper-slide-active");
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

// Cette fonction gère l'affichage des réfèrences et de leurs popups associés
async function showReferences(secteurTheorique){
    const reponse = await fetch("https://rational-flowers-37168cb5d5.strapiapp.com/api/references?populate=*"); 
    const references = await reponse.json();
    let counter = 0;

    let hasReferences = false;

    contentRef.innerHTML = "";

    references.data.forEach(reference =>{
        counter = counter + 1;
        const secteur = reference.attributes.secteur.data.attributes.NomSecteur;
        if (secteur === secteurTheorique){
            let nomChantier = reference.attributes.NomChantier;
            let urlImagePrincipal = reference.attributes.Premiere.data.attributes.url; 
            hasReferences = true;

            createRef(nomChantier,urlImagePrincipal,counter);
            ouverturePopUp();
            fermeturePopUp();

        }
    })

    if (!hasReferences) {
        const noRefMessage = document.createElement("p");
        const noRefMessage2 = document.createElement("p");
        noRefMessage.className = "no-references-message";
        noRefMessage.textContent = "Pour le moment, aucune référence disponible pour ce secteur d'activité sur le site.";
        noRefMessage2.textContent = "Contactez-nous pour les découvrir !";
        contentRef.appendChild(noRefMessage);
        contentRef.appendChild(noRefMessage2);
    }
}


// Cette fonction manipule le DOM pour afficher une référence sur la page 
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

// Cette fonction crée le contenu du PopUp selon la référence demandée 
async function createModal(nomChantier){
    const modalContent = document.querySelector(".modal__content");
    const reponse = await fetch("https://rational-flowers-37168cb5d5.strapiapp.com/api/references?populate=*");
    const references = await reponse.json();

    for (let reference of references.data) {
        const referenceData = reference.attributes;
        if (referenceData.NomChantier === nomChantier) {
            const hero = document.createElement("div");

            // Hero 
            hero.className = "modal__hero";

            const chantier = document.createElement("h2");
            chantier.className = "modal__title";
            chantier.textContent = nomChantier + " - " + reference.attributes.LocalisationChantier;
            hero.appendChild(chantier);

            const sousTitre = document.createElement("h2");
            sousTitre.className = "modal__subtitle";
            sousTitre.textContent = reference.attributes.SousTitre;
            hero.appendChild(sousTitre);
            
            const lot = document.createElement("h2");
            lot.className = "modal__lot";
            lot.textContent = reference.attributes.Lot;
            hero.appendChild(lot);

            const baniere = document.createElement("img");
            baniere.className = "modal__baniere";
            baniere.src = reference.attributes.Baniere.data.attributes.url; // CHANGER CLOUD
            hero.appendChild(baniere);

            modalContent.appendChild(hero);
            

            // DESCRIPTION
            const titreDescript = document.createElement("h4");
            titreDescript.className = "modal__info--title";
            titreDescript.textContent = "Objet du marché : ";
            modalContent.appendChild(titreDescript); 

            const descript = document.createElement("p");
            descript.className = "modal__descript";
            descript.innerHTML = reference.attributes.Description;
            modalContent.appendChild(descript);

            // INFOS
            const infos = document.createElement("div");
            infos.className = "modal__infos";

            const infosG = document.createElement("div");
            infosG.className = "modal__infos--gauche";
            
            const infosD = document.createElement("div");
            infosD.className = "modal__infos--droite";
            
            const titreMontant = document.createElement("h4");
            titreMontant.className = "modal__info--title";
            titreMontant.textContent = "Montant du projet : " ;
            infosD.appendChild(titreMontant);

            const montant = document.createElement("p");
            montant.className = "modal__info";
            montant.textContent = reference.attributes.MontantChantier;
            infosD.appendChild(montant);
            
            const titreMaitre = document.createElement("h4");
            titreMaitre.className = "modal__info--title";
            titreMaitre.textContent = "Maître d'ouvrage : ";
            infosG.appendChild(titreMaitre); 
            
            const maitre = document.createElement("p");
            maitre.className = "modal__info";
            maitre.textContent = reference.attributes.MaitreOuvrage;
            infosG.appendChild(maitre); 
            
            const titreArchi = document.createElement("h4");
            titreArchi.className = "modal__info--title";
            titreArchi.textContent = "Architecte : ";
            infosG.appendChild(titreArchi); 
            
            const archi = document.createElement("p");
            archi.className = "modal__info";
            archi.textContent = reference.attributes.Architecte;
            infosG.appendChild(archi);
            
            const titreEtude = document.createElement("h4");
            titreEtude.className = "modal__info--title";
            titreEtude.textContent = "Bureau d'Etudes : ";
            infosG.appendChild(titreEtude); 
            
            const etude = document.createElement("p");
            etude.className = "modal__info";
            etude.textContent = reference.attributes.BureauEtude;
            infosG.appendChild(etude);
            
            const titreDate = document.createElement("h4");
            titreDate.className = "modal__info--title";
            titreDate.textContent = "Date de Livraison : ";
            infosD.appendChild(titreDate); 
            
            const date = document.createElement("p");
            date.className = "modal__info";
            date.textContent = reference.attributes.DateLivraison;
            infosD.appendChild(date);
            
            const titreDuree = document.createElement("h4");
            titreDuree.className = "modal__info--title";
            titreDuree.textContent = "Durée de l'intervention : ";
            infosD.appendChild(titreDuree); 

            const duree = document.createElement("p");
            duree.className = "modal__info";
            duree.textContent = reference.attributes.DureeChantier;
            infosD.appendChild(duree);

            infos.appendChild(infosG);
            infos.appendChild(infosD);
            
            const imageContent = document.createElement("div");
            imageContent.className = "modal__images";
            reference.attributes.Photos.data.forEach(image =>{
                const img = document.createElement("img");
                img.className = "modal__image";
                img.src =  image.attributes.url;
                imageContent.appendChild(img);
            })
            
            modalContent.appendChild(infos);
            
            const titreMissions = document.createElement("h4");
            titreMissions.className = "modal__info--title";
            titreMissions.textContent = "Missions CVCA Energies : ";
            modalContent.appendChild(titreMissions); 

            const missions = document.createElement("p");
            missions.className = "modal__info--mission";
            missions.innerHTML = reference.attributes.MissionsCVCA;
            modalContent.appendChild(missions);
            modalContent.appendChild(imageContent);
            break;
        }
    }
}

// Cette fonctionne gère l'ouverture du PopUp
function ouverturePopUp(){
    const modal = document.querySelector(".references__modal"); 
    
    const modalTriggersEntry = document.querySelectorAll(".modal-trigger-entry"); 
    const navbar = document.querySelector(".navbar"); // Sélectionnez la navbar

    
    console.log("test");
    modalTriggersEntry.forEach(trigger => {
        trigger.addEventListener("click", () => {
            console.log("test2");
            const reference = trigger.closest(".reference");
            const nomChantier = reference.querySelector(".reference__title").textContent.trim();
            modal.classList.add("active");

            const hexa = document.querySelector(".secteurs");
            hexa.classList.add("hidden");

            if (navbar) {
                navbar.classList.add("hidden"); // Cachez la navbar
            }

            if(countmodal==0){
                createModal(nomChantier);
                countmodal = 1;
            }
        });
    });
}


// Cette fonction ferme le PopUp quand on clique à côté
function fermeturePopUp(){
    const modalTriggersExit = document.querySelectorAll(".modal-trigger"); 
    const modal = document.querySelector(".references__modal");
    const navbar = document.querySelector(".navbar"); // Sélectionnez la navbar

    modalTriggersExit.forEach(trigger => {
        trigger.addEventListener("click", () => {
            modal.classList.remove("active");
            deleteModal();
            countmodal = 0;

            if (navbar) {
                navbar.classList.remove("hidden"); // Réaffichez la navbar
            }
        });
    });
}


// Cette fonction supprime le contenu du PopUp une fois fermé
function deleteModal(){
    const hexa = document.querySelector(".secteurs");
    hexa.classList.remove("hidden");
    const modalContent = document.querySelector(".modal__content");
    modalContent.innerHTML = '';
}