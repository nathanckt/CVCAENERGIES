<?php

namespace CVCAEnergies;

use PHPMailer\PHPMailer\Exception;

/**
 * Mailer spécialisé pour les candidatures
 */
class CarriereMailer extends Mailer
{
    /**
     * Envoie un email de candidature
     */
    public function send($data)
    {
        // Assigner les données
        $this->data = $data;

        // Étape 1: Nettoyer les données
        $this->sanitizeData();

        // Étape 2: Valider les données
        if (!$this->validateData()) {
            return false;
        }

        // Étape 3: Valider les champs spécifiques à la carrière
        if (empty($this->data['object']) || strlen($this->data['object']) > MAX_MESSAGE_LENGTH) {
            $this->addError("L'objet est requis");
            return false;
        }

        if (empty($this->data['category'])) {
            $this->addError("La catégorie est requise");
            return false;
        }

        // Étape 4: Vérifier le rate limiting
        if (!$this->checkRateLimit()) {
            return false;
        }

        // Étape 5: Détecte le spam
        if (!$this->detectSpam()) {
            return false;
        }

        // Étape 6: Valider et traiter les fichiers joints
        $files_processed = true;
        if (!$this->validateAndAttachFiles()) {
            $files_processed = false;
            // Note: on continue l'envoi même si les fichiers ont des soucis
        }

        try {
            // Configuration du mail
            $this->phpMailer->clearAddresses();
            $this->phpMailer->addAddress(RECIPIENT_CARRIERE);
            $this->phpMailer->addReplyTo($this->data['mail'], $this->data['firstname'] . ' ' . $this->data['name']);

            // Sujet
            $this->phpMailer->Subject = "Nouvelle candidature CVCA ENERGIES - " . htmlspecialchars($this->data['object']);

            // Corps du mail (HTML)
            $html_body = $this->buildHTMLBody();
            $this->phpMailer->isHTML(true);
            $this->phpMailer->Body = $html_body;
            $this->phpMailer->AltBody = $this->buildTextBody();

            // Envoi
            $result = $this->phpMailer->send();

            // Log
            $this->logEmail(RECIPIENT_CARRIERE, $this->phpMailer->Subject, $result);

            return $result;

        } catch (Exception $e) {
            $this->addError("Erreur lors de l'envoi: " . $e->getMessage());
            $this->logEmail(RECIPIENT_CARRIERE, "Candidature", false, $e->getMessage());
            return false;
        }
    }

    /**
     * Valide et attache les fichiers
     */
    private function validateAndAttachFiles()
    {
        $success = true;
        $temp_dir = sys_get_temp_dir();

        // Traitement du CV
        if (isset($_FILES["cv"]) && isset($_FILES["cv"]["error"]) && is_array($_FILES["cv"]["error"])) {
            foreach ($_FILES["cv"]["error"] as $index => $error) {
                if ($error === UPLOAD_ERR_OK) {
                    if (!$this->attachFile(
                        $_FILES["cv"]["tmp_name"][$index],
                        $_FILES["cv"]["name"][$index],
                        "CV"
                    )) {
                        $success = false;
                    }
                }
            }
        }

        // Traitement de la lettre de motivation
        if (isset($_FILES["motivation"]) && isset($_FILES["motivation"]["error"]) && is_array($_FILES["motivation"]["error"])) {
            foreach ($_FILES["motivation"]["error"] as $index => $error) {
                if ($error === UPLOAD_ERR_OK) {
                    if (!$this->attachFile(
                        $_FILES["motivation"]["tmp_name"][$index],
                        $_FILES["motivation"]["name"][$index],
                        "Lettre de motivation"
                    )) {
                        $success = false;
                    }
                }
            }
        }

        return $success;
    }

    /**
     * Attache un fichier au mail
     */
    private function attachFile($tmp_path, $filename, $type)
    {
        try {
            // Vérifier que le fichier existe
            if (!file_exists($tmp_path)) {
                $this->addError("Fichier $type non trouvé");
                return false;
            }

            // Vérifier la taille
            if (filesize($tmp_path) > MAX_FILE_SIZE) {
                $this->addError("Le fichier $type dépasse la taille maximale (" . MAX_FILE_SIZE . " bytes)");
                return false;
            }

            // Vérifier l'extension
            $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
            if (!in_array($ext, ALLOWED_FILE_TYPES)) {
                $this->addError("Type de fichier $type non autorisé: $ext");
                return false;
            }

            // Sécuriser le nom du fichier
            $safe_filename = preg_replace('/[^a-zA-Z0-9._-]/', '_', $filename);
            $safe_filename = time() . '_' . $safe_filename;

            // Attacher le fichier
            $this->phpMailer->addAttachment($tmp_path, $safe_filename);

            return true;

        } catch (Exception $e) {
            $this->addError("Erreur lors du traitement du fichier $type: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Construit le corps HTML du mail
     */
    private function buildHTMLBody()
    {
        return "
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: Arial, sans-serif; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #D32F2F; color: white; padding: 20px; text-align: center; border-radius: 4px; }
                .content { margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #D32F2F; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #D32F2F; }
                .value { margin-top: 5px; }
                .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Nouvelle candidature</h1>
                </div>
                <div class='content'>
                    <div class='field'>
                        <div class='label'>Nom :</div>
                        <div class='value'>" . htmlspecialchars($this->data['name']) . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>Prénom :</div>
                        <div class='value'>" . htmlspecialchars($this->data['firstname']) . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>Téléphone :</div>
                        <div class='value'>" . htmlspecialchars($this->data['tel']) . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>Email :</div>
                        <div class='value'><a href='mailto:" . htmlspecialchars($this->data['mail']) . "'>" . htmlspecialchars($this->data['mail']) . "</a></div>
                    </div>
                    <div class='field'>
                        <div class='label'>Objet :</div>
                        <div class='value'>" . htmlspecialchars($this->data['object']) . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>Catégorie d'offre :</div>
                        <div class='value'>" . htmlspecialchars($this->data['category']) . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>Message :</div>
                        <div class='value'>" . nl2br(htmlspecialchars($this->data['message'])) . "</div>
                    </div>
                </div>
                <div class='footer'>
                    <p>Candidature envoyée depuis le formulaire de carrière du site CVCA ENERGIES</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Construit le corps texte du mail
     */
    private function buildTextBody()
    {
        return "
Nouvelle candidature - CVCA ENERGIES
=====================================

Nom : " . $this->data['name'] . "
Prénom : " . $this->data['firstname'] . "
Téléphone : " . $this->data['tel'] . "
Email : " . $this->data['mail'] . "
Objet : " . $this->data['object'] . "
Catégorie : " . $this->data['category'] . "

Message :
" . $this->data['message'] . "

=====================================
Candidature envoyée depuis le formulaire de carrière du site CVCA ENERGIES
        ";
    }
}
?>
