async function MajChiffres() {
    const reponse = await fetch("http://localhost:1337/api/chiffre");
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