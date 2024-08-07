// async function fetchTemoignages() {
//     try {
//         const response = await fetch('http://localhost:1337/api/temoignages?populate=*');
//         const data = await response.json();
//         return data.data; // Assumant que les témoignages sont sous la clé 'data'
//     } catch (error) {
//         console.error('Erreur lors de la récupération des données:', error);
//     }
// }


// // Fonction pour insérer les données dans le DOM
// function displayTemoignages(temoignages) {
//     const temoignageContent = document.getElementById('temoignages-content');

//     temoignages.slice(0, 3).forEach(temoignage => { // Limiter à 3 témoignages
//         const temoignageDiv = document.createElement('div');
//         temoignageDiv.className = 'temoignage';

//         const img = document.createElement('img');
//         img.src = temoignage.attributes.PhotoProfil; // Construire l'URL absolue
//         img.alt = 'Photo de la personne';

//         const poste = document.createElement('h5');
//         poste.textContent = temoignage.attributes.Poste;

//         const entreprise = document.createElement('h5');
//         entreprise.textContent = temoignage.attributes.Entreprise;

//         const commentaire = document.createElement('p');
//         commentaire.textContent = temoignage.attributes.Commentaire;

//         temoignageDiv.appendChild(img);
//         temoignageDiv.appendChild(poste);
//         temoignageDiv.appendChild(entreprise);
//         temoignageDiv.appendChild(commentaire);

//         temoignageContent.appendChild(temoignageDiv);
//     });
// }

// // Récupérer et afficher les témoignages
// fetchTemoignages().then(temoignages => {
//     if (temoignages) {
//         displayTemoignages(temoignages);
//     }
// });

// SWIPER TEMOIGNAGE
var swiper = new Swiper(".temoignages__swiper", {
    slidesPerView: 3,
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
  });




// Récupération de la position des temoignages
const temoignagesDiv = document.querySelector(".swiper-wrapper");


// Fonctionne pour afficher les différentes offres
async function createTemoignage(){
    // Récupération des données 
    const reponse = await fetch("http://localhost:1337/api/temoignages?populate=*");
    const temoignagnes = await reponse.json();

    
    verifData(temoignagnes);
    
    temoignagnes.data.forEach(tem => {
        // Récupération des données nécéssaires
        const data = tem.attributes;
        
        // Création de la temoignage
        const temoignage = document.createElement('div');
        temoignage.className = "swiper-slide";
        
        const imageTem = document.createElement('img');
        imageTem.className = "temoignages__pp";
        if (data.PhotoProfil.data === null){
            imageTem.src = "../../assets/carrieres/design-seul.png"
        } 
        else{            
            imageTem.src = "../../my-strapi-project/public" + data.PhotoProfil.data.attributes.formats.thumbnail.url;
        }
        imageTem.alt = data.Poste;
        temoignage.appendChild(imageTem);

        const nom = document.createElement('h4');
        nom.className = "temoignage__subtitle";
        nom.textContent = data.Nom;
        temoignage.appendChild(nom);

        const poste = document.createElement('p');
        poste.className = "temoignage__poste";
        poste.textContent = data.Poste;
        temoignage.appendChild(poste);

        const entreprise = document.createElement('p');
        entreprise.className = "temoignage__entreprise";
        entreprise.textContent = data.Entreprise;
        temoignage.appendChild(entreprise);

        const comment = document.createElement('p');
        comment.className = "temoignage__text";
        comment.textContent = data.Commentaire;
        temoignage.appendChild(comment);

        temoignagesDiv.appendChild(temoignage);
    })
}

function verifData(data){
    if (data.meta.pagination.total === 0){
        document.querySelector(".temoignages__title").innerHTML = "";
    }
}

createTemoignage();