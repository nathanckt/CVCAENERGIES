function envoiForm(){
    document.getElementById('contactForm').addEventListener('submit', async (e) => {
        e.preventDefault();
      
        const name = document.getElementById('name').value;
        const firstname = document.getElementById('firstname').value;
        const tel = document.getElementById('tel').value;
        const mail = document.getElementById('mail').value;
        const entreprise = document.getElementById('entreprise').value;
        const messageForm = document.getElementById('message').value;
            
        try { 
            // Créer une nouvelle entrée avec les données du formulaire
            const entryData = {
                data: {
                    Nom: name,
                    Prenom: firstname,
                    Entreprise: entreprise,
                    Telephone: tel,
                    Mail: mail,
                    Message: messageForm,
                }
            };
      
            const createResponse = await fetch('https://rational-flowers-37168cb5d5.strapiapp.com/api/messages', { // Remplace "your-content-type" par ton content-type
                method: 'POST',
                headers: {
                    // 'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entryData)
            });
      
            if (createResponse.ok) {
                alert("Message envoyé !");
                // Réinitialiser le formulaire après envoi
                document.getElementById('contactForm').reset();
            } else {
                throw new Error('Erreur lors de l\'envoi du message');
            }
      
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire :', error);
        }
      });
}

function resetForm(){
    document.getElementById('name').textContent = "";
    document.getElementById('firstname').textContent = "";
    document.getElementById('tel').textContent = "";
    document.getElementById('email').textContent = "";
    document.getElementById('entreprise').textContent = "";
    document.getElementById('message').textContent = "";
}
envoiForm();