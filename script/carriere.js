// Récupération de la position des cards
const cards = document.querySelector(".offers__cards");


// Fonctionne pour afficher les différentes offres
async function createCard() {
    // Récupération des données
    const response = await fetch("http://localhost:1337/api/offres?populate=*");
    const offers = await response.json();

    // Vérification s'il y a des offres disponibles
    if (offers.data.length === 0) {
        // Si aucune offre n'est trouvée, afficher une image
        const noOffersImage = document.createElement('img');
        noOffersImage.src = "../assets/carrieres/no-offers.png"; // Chemin de l'image à afficher en cas d'absence d'offres
        noOffersImage.alt = "Aucune offre disponible";
        noOffersImage.className = "no-offers-image"; // Ajoutez une classe si vous souhaitez styliser l'image

        // Ajout de l'image dans le HTML
        cards.appendChild(noOffersImage);
    } else {
        // Sinon, parcourir les offres et créer les cartes
        offers.data.forEach(job => {
            // Récupération des données nécessaires
            const jobData = job.attributes;

            // Création de la card
            const card = document.createElement('div');
            card.className = "card";

            const imageOffre = document.createElement('img');
            imageOffre.className = "card__img";
            if (jobData.Image.data === null) {
                imageOffre.src = "../assets/carrieres/design-seul.png";
            } else {
                // Utiliser l'image de l'offre si disponible
                imageOffre.src = "../assets/carrieres/design-seul.png"; 
                // Vous pouvez changer ceci pour utiliser l'URL réelle de l'image de l'offre
            }
            imageOffre.alt = jobData.NomOffre;
            card.appendChild(imageOffre);

            const nomOffre = document.createElement('h4');
            nomOffre.className = "card__title";
            nomOffre.textContent = jobData.NomOffre;
            card.appendChild(nomOffre);

            const miniResume = document.createElement('p');
            miniResume.className = "card__sumary";
            miniResume.textContent = jobData.MiniResume;
            card.appendChild(miniResume);

            const applyButton = document.createElement('button');
            applyButton.className = "card__btn modal-trigger-entry";
            applyButton.textContent = "En savoir plus";
            card.appendChild(applyButton);

            applyButton.addEventListener("click", () => {
                const card = applyButton.closest(".card");
                const offreTitle = card.querySelector(".card__title").textContent.trim();
                toggleModal(offreTitle);
            });

            // Ajout de la card dans le html
            cards.appendChild(card);
            lienObject();
        });
    }
}

createCard();
envoiForm();


function createModal(imageSource, titleText, resumeText, infosText){
    const modalContent = document.querySelector(".modal__content");

    const divTop = document.createElement("div");
    divTop.className = "modal__top";

    const divRight = document.createElement("div");
    divRight.className = "modal__right";

    const exit = document.createElement("button");
    exit.className = "modal__close modal-trigger";
    exit.textContent = "X";

    const image = document.createElement("img");
    image.className = "modal__image";
    image.src = imageSource;

    const title = document.createElement("h4");
    title.className = "modal__title";
    title.textContent = titleText;

    const resume = document.createElement("p");
    resume.textContent = resumeText;
    resume.className = "modal__resume";

    const infos = document.createElement("p");
    // infos.innerHTML = infosText.replace("\n", '<br>');
    infos.className = "modal__infos";

    const postule = document.createElement("button");
    postule.className = "modal__send modal-trigger cta";
    postule.textContent = "Postulez !";

    divRight.appendChild(title);
    divRight.appendChild(resume);
    divTop.appendChild(image);
    divTop.appendChild(divRight)
    modalContent.appendChild(exit);
    modalContent.appendChild(divTop);
    modalContent.appendChild(infos);
    modalContent.appendChild(postule);
}





// Récupération de la fênetre pop-up
const modal = document.querySelector(".offers__modal"); 

// Récupération des éléments qui changent l'état de la fenêtre
const modalTriggersEntry = document.querySelectorAll(".modal-trigger-entry"); 

// On écoute tout les éléments trigger
// modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));
modalTriggersEntry.forEach(trigger => {
    trigger.addEventListener("click", () => {
        console.log("test");
        const card = trigger.closest(".card");
        
        // Récupérez le titre de l'offre à partir de l'élément h4 dans cette div card
        const offreTitle = card.querySelector(".card__title").textContent.trim();
        
        // Utilisez le titre récupéré comme argument pour toggleModal
        toggleModal(offreTitle);
    });
});


// Fonction qui fait apparaitre le pop-up
function toggleModal(titleText){
    modal.classList.toggle("active");
    recupDonnees(titleText);
    
}


// FERMETURE DU POP-UP
function fermeturePopUp(){
    const modalTriggersExit = document.querySelectorAll(".modal-trigger"); 

    modalTriggersExit.forEach(trigger => {
        trigger.addEventListener("click", () => {
            modal.classList.toggle("active");
            deleteModal();
        });
    });
}


// SUPPRESSION DES DONNEES DANS LE MODAL
function deleteModal(){
    const modalContent = document.querySelector(".modal__content");
    modalContent.innerHTML = '';
}

async function recupDonnees(offreTitle) {
    const reponse = await fetch("http://localhost:1337/api/offres?populate=*");
    const offers = await reponse.json();
    
    let src, resum, infos;

    for (let offer of offers.data) {
        console.log("test");
        const offerData = offer.attributes;
        if (offerData.NomOffre === offreTitle) {
            resum = offerData.Resume;
            infos = offerData.InfosComplementaire;
            // src = "../my-strapi-project/public" + offerData.Image.data.attributes.formats.thumbnail.url; //CLOUD
            src = "../assets/carrieres/design-seul.png";
            break;
        }
    }

    createModal(src, offreTitle, resum, infos);
    fermeturePopUp();
}


// MISE A JOUR DEROULANT

function optionsMenu (nomOffre, idOffre){
    const field = document.querySelector(".form__select");

    const option = document.createElement("option");
    option.value = idOffre;
    option.textContent = nomOffre;

    field.appendChild(option);
}

function lienObject() {
    const selectField = document.getElementById("category");
    const objectInput = document.getElementById("object");

    selectField.addEventListener("change", () => {
        if(selectField.options[selectField.selectedIndex].text !== "Candidature Spontanée"){
            objectInput.value = selectField.options[selectField.selectedIndex].text;
            objectInput.readOnly = true;
            objectInput.classList.add("form__input--blocked");
        }
        else{
            objectInput.value = "";
            objectInput.classList.remove("form__input--blocked");
        }
    });
}


function envoiForm(){
    document.getElementById('applyForm').addEventListener('submit', async (e) => {
        e.preventDefault();
      
        const name = document.getElementById('name').value;
        const firstname = document.getElementById('firstname').value;
        const tel = document.getElementById('tel').value;
        const mail = document.getElementById('mail').value;
        const object = document.getElementById('object').value;
        const messageForm = document.getElementById('message').value;
        const cv = document.getElementById('cv').files[0];
        const motivation = document.getElementById('motivation').files[0];
      
        // const token = 'YOUR_TOKEN'; // Remplace avec ton token
      
        try {
            // Upload des fichiers
            const formData = new FormData();
            formData.append('files', cv);
            formData.append('files', motivation);
      
            const uploadResponse = await fetch('http://localhost:1337/api/upload', {
                method: 'POST',
                // headers: {
                //     'Authorization': `Bearer ${token}`
                // },
                body: formData
            });
      
            const uploadedFiles = await uploadResponse.json();
      
            const cvId = uploadedFiles[0].id;
            const motivationId = uploadedFiles[1].id;
      
            // Créer une nouvelle entrée avec les données du formulaire
            const entryData = {
                data: {
                    nom: name,
                    prenom: firstname,
                    email: mail,
                    tel: tel,
                    objet: object,
                    message: messageForm,
                    cv: cvId,
                    motiv: motivationId
                }
            };
      
            const createResponse = await fetch('http://localhost:1337/api/candidatures', { // Remplace "your-content-type" par ton content-type
                method: 'POST',
                headers: {
                    // 'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entryData)
            });
      
            const newEntry = await createResponse.json();
            alert("Candidature envoyée !");
      
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire :', error);
        }
      });
}


// CONTROLE DU FICHIER

const fileField = document.querySelectorAll(".form__field--file");

fileField.forEach(field =>{
    const fileInput = field.querySelector('.form__file');
    
    // Sélection du label à modifier
    const fileLabel = field.querySelector('.form__file--btn');
    
    // Écoute de l'événement change sur l'input file
    fileInput.addEventListener('change', function() {
        // Vérifier si des fichiers sont sélectionnés
        if (fileInput.files.length > 0) {
            let fileName = fileInput.value.split('\\').pop(); 
            let fileExtension = fileName.split('.').pop();
            if (fileName.length > 20) {
                fileName = fileName.substr(0,15) + " ... " + fileExtension; // Limite à 30 caractères à partir de la fin
                
            }
            // Mettre à jour le label avec le nom du fichier
            fileLabel.textContent = fileName;
            // Appliquer la classe qui change la couleur du label
            fileLabel.classList.add('file-attached');
        } else {
            // Retirer la classe si aucun fichier n'est sélectionné
            fileLabel.classList.remove('file-attached');
        }
    });
})


// CONTROLE INPUT 
