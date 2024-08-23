async function MajChiffres() {
    const reponse = await fetch("https://rational-flowers-37168cb5d5.strapiapp.com/api/chiffre");
    const chiffres = await reponse.json();

    const annee = document.querySelector(".chiffres__annees");
    const employe = document.querySelector(".chiffres__employes");
    const chantier = document.querySelector(".chiffres__chantiers");
    const agence = document.querySelector(".chiffres__agences");
    
    annee.textContent = chiffres.data.attributes.NombreAnnees;
    employe.textContent = chiffres.data.attributes.NombreEmployes;
    chantier.textContent = chiffres.data.attributes.NombreChantiers;
    agence.textContent = chiffres.data.attributes.NombreAgences;
}

MajChiffres();


async function ShowReferences(){
    const reponse = await fetch("https://rational-flowers-37168cb5d5.strapiapp.com/api/references?populate=*");
    const references = await reponse.json();

    references.data.forEach(reference => {
        const verif = reference.attributes.PremierePage;
        if (verif){
            let nomChantier = reference.attributes.NomChantier;
            //let urlImagePrincipal = "../../my-strapi-project/public" + reference.attributes.Premiere.data.attributes.url;
            let urlImagePrincipal = "../../assets/maintenance-site.png"
            createRef(nomChantier,urlImagePrincipal);
            ouverturePopUp();
        }
    });
}

ShowReferences();


function createRef(nom,url){
    const contentRef = document.querySelector(".wrapper__ref");


    const divRef = document.createElement("div");
    divRef.classList.add("references__card");
    divRef.classList.add("swiper-slide");

    const titleRef = document.createElement("h1");
    titleRef.className = "references__title";
    titleRef.innerText = nom;

    const imageRef = document.createElement("img");
    imageRef.className = "references__img";
    imageRef.src = url;
    imageRef.alt = nom;

    const buttonRef = document.createElement("button");
    buttonRef.classList.add("references__btn");
    buttonRef.classList.add("cta");
    buttonRef.classList.add("modal-trigger-entry");
    buttonRef.textContent = "En savoir plus";

    divRef.appendChild(titleRef);
    divRef.appendChild(imageRef);
    divRef.appendChild(buttonRef);
    contentRef.appendChild(divRef);
}


async function createModal(nomChantier){
    const modalContent = document.querySelector(".modal__content");
    const reponse = await fetch("https://rational-flowers-37168cb5d5.strapiapp.com/api/references?populate=*");
    const references = await reponse.json();


    const baniere = document.createElement("img");
    baniere.className = "modal__baniere";
    baniere.src = "assets/maintenance-site.png"; // CHANGER CLOUD
    modalContent.appendChild(baniere);


    // for (let reference of references.data) {
    //     const referenceData = reference.attributes;
    //     if (referenceData.NomChantier === nomChantier) {
    //         const hero = document.createElement("div");

    //         // Hero 
    //         hero.className = "modal__hero";

    //         const chantier = document.createElement("h2");
    //         chantier.className = "modal__title";
    //         chantier.textContent = nomChantier + " - " + reference.attributes.LocalisationChantier;
    //         hero.appendChild(chantier);

    //         const sousTitre = document.createElement("h2");
    //         sousTitre.className = "modal__subtitle";
    //         sousTitre.textContent = reference.attributes.SousTitre;
    //         hero.appendChild(sousTitre);
            
    //         const lot = document.createElement("h2");
    //         lot.className = "modal__lot";
    //         lot.textContent = reference.attributes.Lot;
    //         hero.appendChild(lot);

    //         const baniere = document.createElement("img");
    //         baniere.className = "modal__baniere";
    //         baniere.src = "../../my-strapi-project/public" + reference.attributes.Baniere.data.attributes.url; // CHANGER CLOUD
    //         hero.appendChild(baniere);

    //         modalContent.appendChild(hero);
            

    //         // DESCRIPTION
    //         const titreDescript = document.createElement("h4");
    //         titreDescript.className = "modal__info--title";
    //         titreDescript.textContent = "Objet du marché : ";
    //         modalContent.appendChild(titreDescript); 

    //         const descript = document.createElement("p");
    //         descript.className = "modal__descript";
    //         descript.innerHTML = reference.attributes.Description;
    //         modalContent.appendChild(descript);

    //         // INFOS
    //         const infos = document.createElement("div");
    //         infos.className = "modal__infos";

    //         const infosG = document.createElement("div");
    //         infosG.className = "modal__infos--gauche";
            
    //         const infosD = document.createElement("div");
    //         infosD.className = "modal__infos--droite";
            
    //         const titreMontant = document.createElement("h4");
    //         titreMontant.className = "modal__info--title";
    //         titreMontant.textContent = "Montant du projet : " ;
    //         infosD.appendChild(titreMontant);

    //         const montant = document.createElement("p");
    //         montant.className = "modal__info";
    //         montant.textContent = reference.attributes.MontantChantier;
    //         infosD.appendChild(montant);
            
    //         const titreMaitre = document.createElement("h4");
    //         titreMaitre.className = "modal__info--title";
    //         titreMaitre.textContent = "Maître d'ouvrage : ";
    //         infosG.appendChild(titreMaitre); 
            
    //         const maitre = document.createElement("p");
    //         maitre.className = "modal__info";
    //         maitre.textContent = reference.attributes.MaitreOuvrage;
    //         infosG.appendChild(maitre); 
            
    //         const titreArchi = document.createElement("h4");
    //         titreArchi.className = "modal__info--title";
    //         titreArchi.textContent = "Architecte : ";
    //         infosG.appendChild(titreArchi); 
            
    //         const archi = document.createElement("p");
    //         archi.className = "modal__info";
    //         archi.textContent = reference.attributes.Architecte;
    //         infosG.appendChild(archi);
            
    //         const titreEtude = document.createElement("h4");
    //         titreEtude.className = "modal__info--title";
    //         titreEtude.textContent = "Bureau d'Etudes : ";
    //         infosG.appendChild(titreEtude); 
            
    //         const etude = document.createElement("p");
    //         etude.className = "modal__info";
    //         etude.textContent = reference.attributes.BureauEtude;
    //         infosG.appendChild(etude);
            
    //         const titreDate = document.createElement("h4");
    //         titreDate.className = "modal__info--title";
    //         titreDate.textContent = "Date de Livraison : ";
    //         infosD.appendChild(titreDate); 
            
    //         const date = document.createElement("p");
    //         date.className = "modal__info";
    //         date.textContent = reference.attributes.DateLivraison;
    //         infosD.appendChild(date);
            
    //         const titreDuree = document.createElement("h4");
    //         titreDuree.className = "modal__info--title";
    //         titreDuree.textContent = "Durée de l'intervention : ";
    //         infosD.appendChild(titreDuree); 

    //         const duree = document.createElement("p");
    //         duree.className = "modal__info";
    //         duree.textContent = reference.attributes.DureeChantier;
    //         infosD.appendChild(duree);

    //         infos.appendChild(infosG);
    //         infos.appendChild(infosD);
            
    //         const imageContent = document.createElement("div");
    //         imageContent.className = "modal__images";
    //         reference.attributes.Photos.data.forEach(image =>{
    //             const img = document.createElement("img");
    //             img.className = "modal__image";
    //             img.src = "../../my-strapi-project/public" + image.attributes.url;
    //             imageContent.appendChild(img);
    //         })
            
    //         modalContent.appendChild(infos);
            
    //         const titreMissions = document.createElement("h4");
    //         titreMissions.className = "modal__info--title";
    //         titreMissions.textContent = "Missions CVCA Energies : ";
    //         modalContent.appendChild(titreMissions); 

    //         const missions = document.createElement("p");
    //         missions.className = "modal__info--mission";
    //         missions.innerHTML = reference.attributes.MissionsCVCA;
    //         modalContent.appendChild(missions);
    //         modalContent.appendChild(imageContent);
    //         break;
    //     }
    // }
}

// Cette fonctionne gère l'ouverture du PopUp
function ouverturePopUp(){
    const modal = document.querySelector(".references__modal"); 
    
    const modalTriggersEntry = document.querySelectorAll(".modal-trigger-entry"); 
    
    modalTriggersEntry.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const reference = trigger.closest(".references__card");
            const nomChantier = reference.querySelector(".references__title").textContent.trim();
            modal.classList.add("active");

            const ref = document.querySelector(".wrapper__ref");
            console.log(ref);
            ref.classList.add("hidden");

            //createModal(nomChantier);
        })
    });
}


// Cette fonction ferme le PopUp quand on clique à côté
function fermeturePopUp(){
    const modalTriggersExit = document.querySelectorAll(".modal-trigger"); 
    const modal = document.querySelector(".references__modal");

    modalTriggersExit.forEach(trigger => {
        trigger.addEventListener("click", () => {
            modal.classList.remove("active");
            const ref = document.querySelector(".wrapper__ref");
            ref.classList.remove("hidden");
            //deleteModal();
        });
    });
}


// Cette fonction supprime le contenu du PopUp une fois fermé
function deleteModal(){
    const modalContent = document.querySelector(".modal__content");
    modalContent.innerHTML = '';
}

fermeturePopUp();