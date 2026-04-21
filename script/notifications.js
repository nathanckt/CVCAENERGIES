/**
 * Système de notification pour les formulaires
 * Affiche les messages de succès/erreur
 */

document.addEventListener('DOMContentLoaded', function() {
    // Récupérer les messages de session depuis le localStorage ou les attributs data
    const successMessage = sessionStorage.getItem('success_message');
    const errorMessage = sessionStorage.getItem('error_message');

    if (successMessage) {
        showNotification(successMessage, 'success');
        sessionStorage.removeItem('success_message');
    }

    if (errorMessage) {
        showNotification(errorMessage, 'error');
        sessionStorage.removeItem('error_message');
    }
});

/**
 * Affiche une notification à l'écran
 * @param {string} message - Le message à afficher
 * @param {string} type - 'success', 'error', 'warning', 'info'
 */
function showNotification(message, type = 'info') {
    // Créer le conteneur de notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    // Ajouter l'icône et le message
    const icon = getIconForType(type);
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__icon">${icon}</span>
            <span class="notification__message">${message}</span>
            <button class="notification__close" aria-label="Fermer la notification" onclick="this.parentElement.parentElement.remove()">
                ×
            </button>
        </div>
    `;

    // Injecter dans le DOM
    document.body.insertBefore(notification, document.body.firstChild);

    // Auto-fermer après 6 secondes pour les succès, 8 pour les erreurs
    const timeout = type === 'success' ? 6000 : 8000;
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, timeout);
}

/**
 * Retourne l'icône appropriée selon le type
 */
function getIconForType(type) {
    const icons = {
        'success': '✓',
        'error': '✕',
        'warning': '⚠',
        'info': 'ℹ'
    };
    return icons[type] || icons['info'];
}

/**
 * Gère la soumission des formulaires
 */
function initFormHandlers() {
    const forms = document.querySelectorAll('form[data-async="true"]');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const action = form.getAttribute('action');

            try {
                const response = await fetch(action, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    // Le serveur redirige, donc on le laisse faire
                    showNotification('Formulaire envoyé avec succès!', 'success');
                    form.reset();
                } else if (response.status === 400) {
                    // Erreur de validation
                    const errorData = await response.json();
                    showNotification(errorData.message, 'error');
                } else {
                    showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
                }
            } catch (error) {
                console.error('Erreur lors de l\'envoi:', error);
                showNotification('Erreur de connexion. Veuillez réessayer.', 'error');
            }
        });
    });
}

// Initialiser les handlers au chargement
initFormHandlers();
