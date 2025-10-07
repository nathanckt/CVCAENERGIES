<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "crincketnathan@gmail.com";
    $subject = "Nouvelle candidature - " . htmlspecialchars($_POST["object"]);
    $message = "
        Nom : " . htmlspecialchars($_POST["name"]) . "\n
        Prénom : " . htmlspecialchars($_POST["firstname"]) . "\n
        Téléphone : " . htmlspecialchars($_POST["tel"]) . "\n
        Email : " . htmlspecialchars($_POST["mail"]) . "\n
        Objet : " . htmlspecialchars($_POST["object"]) . "\n
        Message : " . htmlspecialchars($_POST["message"]) . "\n
        Offre : " . htmlspecialchars($_POST["category"]) . "\n
    ";

    $headers = "From: " . htmlspecialchars($_POST["mail"]);

    // Gestion des fichiers joints
    $boundary = md5(uniqid());
    $headers .= "\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=\"$boundary\"";

    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=\"utf-8\"\r\n\r\n";
    $body .= $message . "\r\n";

    // CV
    if (isset($_FILES["cv"]) && $_FILES["cv"]["error"][0] == UPLOAD_ERR_OK) {
        $cv_tmp = $_FILES["cv"]["tmp_name"][0];
        $cv_name = $_FILES["cv"]["name"][0];
        $cv_type = $_FILES["cv"]["type"][0];
        $cv_data = chunk_split(base64_encode(file_get_contents($cv_tmp)));
        $body .= "--$boundary\r\n";
        $body .= "Content-Type: $cv_type; name=\"$cv_name\"\r\n";
        $body .= "Content-Disposition: attachment; filename=\"$cv_name\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= $cv_data . "\r\n";
    }

    // Lettre de motivation
    if (isset($_FILES["motivation"]) && $_FILES["motivation"]["error"][0] == UPLOAD_ERR_OK) {
        $mot_tmp = $_FILES["motivation"]["tmp_name"][0];
        $mot_name = $_FILES["motivation"]["name"][0];
        $mot_type = $_FILES["motivation"]["type"][0];
        $mot_data = chunk_split(base64_encode(file_get_contents($mot_tmp)));
        $body .= "--$boundary\r\n";
        $body .= "Content-Type: $mot_type; name=\"$mot_name\"\r\n";
        $body .= "Content-Disposition: attachment; filename=\"$mot_name\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= $mot_data . "\r\n";
    }

    $body .= "--$boundary--";

    if (mail($to, $subject, $body, $headers)) {
        echo "Votre candidature a bien été envoyée.";
    } else {
        echo "Erreur lors de l'envoi du mail.";
    }
}
?>