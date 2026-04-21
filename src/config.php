<?php
/**
 * Configuration centralisée pour le système de mailing
 */

// Charger les variables d'environnement
if (file_exists(__DIR__ . '/../.env')) {
    $env = parse_ini_file(__DIR__ . '/../.env');
} else {
    // Configuration par défaut si .env n'existe pas
    $env = [];
}

// Configuration SMTP
define('SMTP_HOST', $env['SMTP_HOST'] ?? 'ssl0.ovh.net');
define('SMTP_PORT', (int)($env['SMTP_PORT'] ?? 465));
define('SMTP_USERNAME', $env['SMTP_USERNAME'] ?? 'contact@cvca-energies.fr');
define('SMTP_PASSWORD', $env['SMTP_PASSWORD'] ?? '');
define('SMTP_FROM_EMAIL', $env['SMTP_FROM_EMAIL'] ?? 'contact@cvca-energies.fr');
define('SMTP_FROM_NAME', $env['SMTP_FROM_NAME'] ?? 'CVCA ENERGIES');

// Emails destinataires
define('RECIPIENT_CONTACT', $env['RECIPIENT_CONTACT'] ?? 'crincketnathan@gmail.com');
define('RECIPIENT_CARRIERE', $env['RECIPIENT_CARRIERE'] ?? 'crincketnathan@gmail.com');

// Sécurité
define('RATE_LIMIT_ENABLED', $env['RATE_LIMIT_ENABLED'] === 'true');
define('RATE_LIMIT_PER_HOUR', (int)($env['RATE_LIMIT_PER_HOUR'] ?? 5));
define('SPAM_CHECK_ENABLED', $env['SPAM_CHECK_ENABLED'] === 'true');
define('LOG_EMAILS', $env['LOG_EMAILS'] === 'true');
define('LOG_PATH', $env['LOG_PATH'] ?? __DIR__ . '/../logs/');

// Créer le dossier de logs s'il n'existe pas
if (LOG_EMAILS && !is_dir(LOG_PATH)) {
    mkdir(LOG_PATH, 0755, true);
}

// Configuration de sécurité
define('MAX_MESSAGE_LENGTH', 5000);
define('MAX_NAME_LENGTH', 100);
define('MAX_EMAIL_LENGTH', 254);
define('MAX_PHONE_LENGTH', 20);
define('ALLOWED_FILE_TYPES', ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']);
define('MAX_FILE_SIZE', 5242880); // 5MB

// URLs autorisées (whitelist pour les formulaires)
define('ALLOWED_ORIGINS', ['https://cvca-energies.fr', 'http://localhost']);
?>
