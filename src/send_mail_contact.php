<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "crincketnathan@gmail.com";
    $subject = "Nouveau message de contact - CVCA ENERGIES";
    $message = "
        Nom : " . htmlspecialchars($_POST["name"]) . "\n
        Prénom : " . htmlspecialchars($_POST["firstname"]) . "\n
        Entreprise : " . htmlspecialchars($_POST["entreprise"]) . "\n
        Téléphone : " . htmlspecialchars($_POST["tel"]) . "\n
        Email : " . htmlspecialchars($_POST["mail"]) . "\n
        Message : " . htmlspecialchars($_POST["message"]) . "\n
    ";

    $headers = "From: " . htmlspecialchars($_POST["mail"]);

    if (mail($to, $subject, $message, $headers)) {
        header("Location: ../pages/contact.html");
        exit;
    } else {
        echo "Erreur lors de l'envoi du mail. Contactez-nous directement à l'adresse : contact@cvca-energies.fr";
    }
}
?>