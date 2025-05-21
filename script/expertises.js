document.addEventListener('DOMContentLoaded', function () {
    showInfos("Chauffage");
    showReferences("Chauffage");
    var swiper = new Swiper(".domaines__swipper", {
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
        showInfos(swiper.slides[swiper.activeIndex].querySelector(".domaines__icone").alt);
        showReferences(swiper.slides[swiper.activeIndex].querySelector(".domaines__icone").alt);
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
    // const reponse = await fetch("https://rational-flowers-37168cb5d5.strapiapp.com/api/secteurs?populate=*");
    const reponse = await fetch("../packages/references.json");
    const secteurs = await reponse.json();

    const swiper = document.querySelector(".swiper-wrapper");

    for (i = 0; i<0 ; i++){
        secteurs.data.forEach(secteur => {
            const slide = document.createElement("div");
            slide.className = "swiper-slide";

            const icone = document.createElement("img");
            icone.className = "domaines__icone";

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

// showSecteurs();


async function showInfos(nom){
    const reponse = await fetch("../../packages/expertises.json");
    const expertises = await reponse.json();

    expertises.data.forEach(exper =>{
        if(exper.attributes.expertise === nom){
            createInfos(exper.attributes.titreExpertise, exper.attributes.paragraphe1, exper.attributes.paragraphe2, exper.attributes.titreSaviez, exper.attributes.paragraphe3, exper.attributes.paragraphe4, exper.attributes.srcImage1, exper.attributes.srcImage2);
        }
    })

}

function createInfos(titre1, paragraphe1, paragraphe2, titre2, paragraphe3, paragraphe4, srcImage1, srcImage2){
    const infos = document.querySelector(".infos");
    infos.innerHTML="";

    const top = document.createElement("div");
    top.classList.add("infos__content");

    const textContainer1 = document.createElement("div");
    textContainer1.classList.add("infos__text");

    const tit1 = document.createElement("h4");
    tit1.textContent = titre1;

    const para1 = document.createElement("p");
    para1.textContent = paragraphe1;
    
    const para2 = document.createElement("p");
    para2.textContent = paragraphe2;

    const img1 = document.createElement("img");
    img1.classList.add("infos__image");
    img1.src = srcImage1;
    img1.alt = "Photographie représentant le domaine d'expertise";

    textContainer1.appendChild(tit1);
    textContainer1.appendChild(para1);
    textContainer1.appendChild(para2);
    top.appendChild(textContainer1);
    top.appendChild(img1);
    infos.appendChild(top);
    
    const bottom = document.createElement("div");
    bottom.classList.add("infos__content");
    bottom.classList.add("infos__content--bottom");

    const textContainer2 = document.createElement("div");
    textContainer2.classList.add("infos__text");
    textContainer2.classList.add("infos__text--bottom");

    const tit2 = document.createElement("h4");
    tit2.textContent = titre2;

    const para3 = document.createElement("p");
    para3.textContent = paragraphe3;
    
    const para4 = document.createElement("p");
    para4.textContent = paragraphe4;

    const img2 = document.createElement("img");
    img2.classList.add("infos__image");
    img2.classList.add("infos__image--bottom");
    img2.src = srcImage2;
    img2.alt = "Photographie représentant le domaine d'expertise";

    textContainer2.appendChild(tit2);
    textContainer2.appendChild(para3);
    textContainer2.appendChild(para4);
    bottom.appendChild(img2);
    bottom.appendChild(textContainer2);
    infos.appendChild(bottom);
}




function getNom(){
        const active = document.querySelector(".swiper-slide-active");
        if (active) {
            const icone = active.querySelector(".domaines__icone");
            if (icone) {
                const nom = icone.alt;
                return nom;
            } else {
                console.error("Aucun élément avec la classe 'domaines__icone' n'a été trouvé dans 'swiper-slide-active'.");
            }
        } else {
            console.error("Aucun élément avec la classe 'swiper-slide-active' n'a été trouvé.");
        }
}


// REFERENCES
const contentRef = document.querySelector(".references__content");

async function showReferences(domaineTheorique){
    const reponse = await fetch("https://rational-flowers-37168cb5d5.strapiapp.com/api/references?populate=*");
    const references = await reponse.json();

    contentRef.innerHTML = "";

    let hasReferences = false;

    references.data.forEach(reference =>{
        const domaines = reference.attributes.domaines.data;
        
        domaines.forEach(domaine =>{
            if (domaine.attributes.NomDomaine === domaineTheorique){
                hasReferences = true;   
                let nomChantier = reference.attributes.NomChantier;
                // let urlImagePrincipal = "../../my-strapi-project/public" + reference.attributes.Premiere.data.attributes.url;
                let urlImagePrincipal = "../../assets/IMG_5095.jpg";
    
                createRef(nomChantier,urlImagePrincipal);
                ouverturePopUp();
                fermeturePopUp();
            }
        })
    })

    if (!hasReferences) {
        const noRefMessage = document.createElement("p");
        const noRefMessage2 = document.createElement("p");
        noRefMessage.className = "no-references-message";
        noRefMessage.textContent = "Pour le moment, aucune référence disponible pour ce domaine sur le site.";
        noRefMessage2.textContent = "Contactez-nous pour les découvrir !";
        contentRef.appendChild(noRefMessage);
        contentRef.appendChild(noRefMessage2);
    }
}

function createRef(nom,url){
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

    const reponse = await fetch("https://rational-flowers-37168cb5d5.strapiapp.com/api/references?populate=*");
    const references = await reponse.json();

    for (let reference of references.data) {
        const referenceData = reference.attributes;
        console.log(nomChantier);
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
            baniere.src =  reference.attributes.Baniere.data.attributes.url; // CHANGER CLOUD
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
                img.src = image.attributes.url;
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

let countmodal = 0 ;
function ouverturePopUp(){
    const modal = document.querySelector(".references__modal");
    const navbar = document.querySelector(".navbar"); 

    const modalTriggersEntry = document.querySelectorAll(".modal-trigger-entry");


    modalTriggersEntry.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const reference = trigger.closest(".reference");
            const nomChantier = reference.querySelector(".reference__title").textContent.trim();
            modal.classList.add("active");

            const hexa = document.querySelector(".domaines");
            hexa.classList.add("hidden");

            // Jusqu'à ça c'est good
            if(countmodal==0){
                createModal(nomChantier);
                countmodal = 1;
            }

            if (navbar) {
                navbar.classList.add("hidden"); // Cachez la navbar
            }
        });
    });
}

function fermeturePopUp(){
    const modalTriggersExit = document.querySelectorAll(".modal-trigger");
    const modal = document.querySelector(".references__modal");
    const navbar = document.querySelector(".navbar"); 


    modalTriggersExit.forEach(trigger => {
        trigger.addEventListener("click", () => {
            modal.classList.remove("active");
            deleteModal();
            countmodal = 0;

            if (navbar) {
                navbar.classList.remove("hidden");
            }
        });
    });
}

function deleteModal(){
    const hexa = document.querySelector(".domaines");
    hexa.classList.remove("hidden");
    const modalContent = document.querySelector(".modal__content");
    modalContent.innerHTML = '';
}