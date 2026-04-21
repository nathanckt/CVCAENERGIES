<?php

namespace CVCAEnergies;

use PHPMailer\PHPMailer\Exception;

/**
 * Mailer spécialisé pour les formulaires de contact
 */
class ContactMailer extends Mailer
{
    /**
     * Envoie un email de contact
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

        // Étape 3: Valider le téléphone et l'entreprise spécifiques au contact
        if (empty($this->data['entreprise']) || strlen($this->data['entreprise']) > MAX_NAME_LENGTH) {
            $this->addError("L'entreprise est requise");
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

        try {
            // Configuration du mail
            $this->phpMailer->clearAddresses();
            $this->phpMailer->addAddress(RECIPIENT_CONTACT);
            $this->phpMailer->addReplyTo($this->data['mail'], $this->data['firstname'] . ' ' . $this->data['name']);

            // Sujet
            $this->phpMailer->Subject = "Nouveau message de contact - CVCA ENERGIES";

            // Corps du mail (HTML)
            $html_body = $this->buildHTMLBody();
            $this->phpMailer->isHTML(true);
            $this->phpMailer->Body = $html_body;
            $this->phpMailer->AltBody = $this->buildTextBody();

            // Envoi
            $result = $this->phpMailer->send();

            // Log
            $this->logEmail(RECIPIENT_CONTACT, $this->phpMailer->Subject, $result);

            return $result;

        } catch (Exception $e) {
            $this->addError("Erreur lors de l'envoi: " . $e->getMessage());
            $this->logEmail(RECIPIENT_CONTACT, "Contact", false, $e->getMessage());
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
                    <h1>Nouveau message de contact</h1>
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
                        <div class='label'>Entreprise :</div>
                        <div class='value'>" . htmlspecialchars($this->data['entreprise']) . "</div>
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
                        <div class='label'>Message :</div>
                        <div class='value'>" . nl2br(htmlspecialchars($this->data['message'])) . "</div>
                    </div>
                </div>
                <div class='footer'>
                    <p>Message envoyé depuis le formulaire de contact du site CVCA ENERGIES</p>
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
Nouveau message de contact - CVCA ENERGIES
============================================

Nom : " . $this->data['name'] . "
Prénom : " . $this->data['firstname'] . "
Entreprise : " . $this->data['entreprise'] . "
Téléphone : " . $this->data['tel'] . "
Email : " . $this->data['mail'] . "

Message :
" . $this->data['message'] . "

============================================
Message envoyé depuis le formulaire de contact du site CVCA ENERGIES
        ";
    }
}
?>
