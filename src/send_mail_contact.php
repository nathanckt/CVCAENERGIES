<?php
/**
 * Traitement du formulaire de contact
 * 
 * Utilise le système sécurisé de mailing avec PHPMailer
 */

// Configuration de base
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/Mailer.php';
require_once __DIR__ . '/ContactMailer.php';

use CVCAEnergies\ContactMailer;

// Vérifier que c'est une requête POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Méthode non autorisée");
}

// Récupérer et préparer les données du formulaire
$data = [
    'name' => $_POST['name'] ?? '',
    'firstname' => $_POST['firstname'] ?? '',
    'entreprise' => $_POST['entreprise'] ?? '',
    'tel' => $_POST['tel'] ?? '',
    'mail' => $_POST['mail'] ?? '',
    'message' => $_POST['message'] ?? '',
    'terms' => isset($_POST['terms']) ? $_POST['terms'] : false,
];

// Vérifier que les conditions d'utilisation sont acceptées
if (!$data['terms']) {
    $_SESSION['error'] = "Vous devez accepter la politique de confidentialité";
    header("Location: ../pages/contact.html");
    exit;
}

// Créer l'instance du mailer
$mailer = new ContactMailer();

// Envoyer le mail
if ($mailer->send($data)) {
    // Succès
    $_SESSION['success'] = "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.";
    header("Location: ../pages/contact.html");
    exit;
} else {
    // Erreur
    $errors = $mailer->getErrors();
    $_SESSION['error'] = "Erreur lors de l'envoi du message : " . implode(", ", $errors);
    header("Location: ../pages/contact.html");
    exit;
}
?>