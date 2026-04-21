<?php
/**
 * Traitement du formulaire de candidature
 * 
 * Utilise le système sécurisé de mailing avec PHPMailer
 */

// Configuration de base
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/Mailer.php';
require_once __DIR__ . '/CarriereMailer.php';

use CVCAEnergies\CarriereMailer;

// Vérifier que c'est une requête POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Méthode non autorisée");
}

// Récupérer et préparer les données du formulaire
$data = [
    'name' => $_POST['name'] ?? '',
    'firstname' => $_POST['firstname'] ?? '',
    'tel' => $_POST['tel'] ?? '',
    'mail' => $_POST['mail'] ?? '',
    'object' => $_POST['object'] ?? '',
    'category' => $_POST['category'] ?? '',
    'message' => $_POST['message'] ?? '',
    'terms' => isset($_POST['terms']) ? $_POST['terms'] : false,
];

// Vérifier que les conditions d'utilisation sont acceptées
if (!$data['terms']) {
    $_SESSION['error'] = "Vous devez accepter la politique de confidentialité";
    header("Location: ../pages/carriere.html");
    exit;
}

// Créer l'instance du mailer
$mailer = new CarriereMailer();

// Envoyer le mail
if ($mailer->send($data)) {
    // Succès
    $_SESSION['success'] = "Votre candidature a été envoyée avec succès. Merci de votre intérêt !";
    header("Location: ../pages/carriere.html");
    exit;
} else {
    // Erreur
    $errors = $mailer->getErrors();
    $_SESSION['error'] = "Erreur lors de l'envoi de votre candidature : " . implode(", ", $errors);
    header("Location: ../pages/carriere.html");
    exit;
}
?>