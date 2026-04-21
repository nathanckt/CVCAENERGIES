<?php

namespace CVCAEnergies;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/**
 * Classe abstraite pour la gestion de l'envoi d'emails
 */
abstract class Mailer
{
    protected $phpMailer;
    protected $errors = [];
    protected $data = [];

    public function __construct()
    {
        $this->phpMailer = new PHPMailer(true);
        $this->configureSMTP();
    }

    /**
     * Configure la connexion SMTP
     */
    protected function configureSMTP()
    {
        try {
            $this->phpMailer->isSMTP();
            $this->phpMailer->Host = SMTP_HOST;
            $this->phpMailer->SMTPAuth = true;
            $this->phpMailer->Username = SMTP_USERNAME;
            $this->phpMailer->Password = SMTP_PASSWORD;
            $this->phpMailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $this->phpMailer->Port = SMTP_PORT;
            $this->phpMailer->CharSet = 'UTF-8';
            $this->phpMailer->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
        } catch (Exception $e) {
            $this->addError("Erreur configuration SMTP: " . $e->getMessage());
        }
    }

    /**
     * Valide les données du formulaire
     */
    protected function validateData()
    {
        // Validation commune
        if (empty($this->data['name']) || strlen($this->data['name']) > MAX_NAME_LENGTH) {
            $this->addError("Le nom est requis et doit être inférieur à " . MAX_NAME_LENGTH . " caractères");
        }

        if (empty($this->data['firstname']) || strlen($this->data['firstname']) > MAX_NAME_LENGTH) {
            $this->addError("Le prénom est requis et doit être inférieur à " . MAX_NAME_LENGTH . " caractères");
        }

        if (empty($this->data['mail']) || !$this->isValidEmail($this->data['mail'])) {
            $this->addError("L'email est invalide");
        }

        if (empty($this->data['message']) || strlen($this->data['message']) > MAX_MESSAGE_LENGTH) {
            $this->addError("Le message est requis et doit être inférieur à " . MAX_MESSAGE_LENGTH . " caractères");
        }

        if (empty($this->data['tel']) || !$this->isValidPhone($this->data['tel'])) {
            $this->addError("Le téléphone est invalide");
        }

        return empty($this->errors);
    }

    /**
     * Valide une adresse email
     */
    protected function isValidEmail($email)
    {
        if (strlen($email) > MAX_EMAIL_LENGTH) {
            return false;
        }
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    /**
     * Valide un numéro de téléphone (format international)
     */
    protected function isValidPhone($phone)
    {
        // Accepte les formats: +33..., 0..., espaces, tirets, points
        $phone = preg_replace('/[\s\-\.]/', '', $phone);
        if (strlen($phone) < 6 || strlen($phone) > MAX_PHONE_LENGTH) {
            return false;
        }
        return preg_match('/^[\+]?[0-9]{6,}$/', $phone) === 1;
    }

    /**
     * Détecte le spam potentiel
     */
    protected function detectSpam()
    {
        if (!SPAM_CHECK_ENABLED) {
            return true;
        }

        $message = $this->data['message'] ?? '';
        $spam_score = 0;

        // Détecteur de spam simple
        $spam_patterns = [
            '/viagra|cialis|casino|poker|lottery|bitcoin|crypto/i' => 5,
            '/<a\s+href/i' => 3, // Liens HTML
            '/\b(http|https|ftp):\/\//i' => 2, // URLs
            '/!{2,}|\?{2,}/i' => 1, // Caractères répétés
            '/[0-9]{4,}[0-9\s\-\(\)]{10,}/i' => 2, // Numéros de carte
        ];

        foreach ($spam_patterns as $pattern => $score) {
            if (preg_match($pattern, $message)) {
                $spam_score += $score;
            }
        }

        // Si score > 5, c'est probablement du spam
        if ($spam_score > 5) {
            $this->addError("Votre message a été détecté comme potentiellement indésirable. Veuillez reformuler.");
            return false;
        }

        return true;
    }

    /**
     * Vérifie le rate limiting
     */
    protected function checkRateLimit()
    {
        if (!RATE_LIMIT_ENABLED) {
            return true;
        }

        $ip = $this->getClientIP();
        $log_file = LOG_PATH . 'rate_limit.log';

        // Initialiser le fichier log
        if (!file_exists($log_file)) {
            file_put_contents($log_file, '');
        }

        $logs = file($log_file);
        $current_time = time();
        $one_hour_ago = $current_time - 3600;
        $ip_count = 0;
        $new_logs = [];

        // Nettoyer les anciens logs et compter les requêtes récentes
        foreach ($logs as $log) {
            $log_data = json_decode(trim($log), true);
            if ($log_data && $log_data['time'] > $one_hour_ago) {
                $new_logs[] = $log;
                if ($log_data['ip'] === $ip) {
                    $ip_count++;
                }
            }
        }

        // Ajouter la nouvelle requête
        $new_logs[] = json_encode(['ip' => $ip, 'time' => $current_time]) . "\n";

        // Sauvegarder les logs
        file_put_contents($log_file, implode('', $new_logs));

        if ($ip_count >= RATE_LIMIT_PER_HOUR) {
            $this->addError("Trop de requêtes. Veuillez réessayer dans une heure.");
            return false;
        }

        return true;
    }

    /**
     * Récupère l'adresse IP du client
     */
    protected function getClientIP()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        }
        return filter_var(trim($ip), FILTER_VALIDATE_IP) ?: 'unknown';
    }

    /**
     * Log l'envoi de mail
     */
    protected function logEmail($recipient, $subject, $success, $error = '')
    {
        if (!LOG_EMAILS) {
            return;
        }

        $log_entry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'ip' => $this->getClientIP(),
            'recipient' => $recipient,
            'subject' => $subject,
            'success' => $success,
            'error' => $error,
            'sender_email' => $this->data['mail'] ?? 'unknown'
        ];

        $log_file = LOG_PATH . 'email_' . date('Y-m-d') . '.log';
        file_put_contents($log_file, json_encode($log_entry) . "\n", FILE_APPEND);
    }

    /**
     * Nettoie et échappe les données
     */
    protected function sanitizeData()
    {
        foreach ($this->data as $key => $value) {
            if (is_string($value)) {
                // Supprimer les caractères nuls et contrôler les caractères
                $this->data[$key] = trim(preg_replace('/[\x00-\x1F\x7F]/', '', $value));
            }
        }
    }

    /**
     * Ajoute une erreur à la liste
     */
    protected function addError($error)
    {
        $this->errors[] = $error;
    }

    /**
     * Retourne les erreurs
     */
    public function getErrors()
    {
        return $this->errors;
    }

    /**
     * Retourne l'instance PHPMailer pour les sous-classes
     */
    protected function getMailer()
    {
        return $this->phpMailer;
    }

    /**
     * Méthode abstraite pour envoyer le mail
     */
    abstract public function send($data);
}
?>
