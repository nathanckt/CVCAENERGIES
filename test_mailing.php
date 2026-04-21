<?php
/**
 * Script de test du système de mailing
 * À utiliser avant la mise en production
 * 
 * Usage: php test_mailing.php
 */

// Configuration de base
require_once __DIR__ . '/src/config.php';
require_once __DIR__ . '/src/Mailer.php';
require_once __DIR__ . '/src/ContactMailer.php';

use CVCAEnergies\ContactMailer;

echo "=== TEST DU SYSTÈME DE MAILING ===\n\n";

// Test 1: Vérifier la configuration
echo "1️⃣  Vérification de la configuration...\n";
echo "   SMTP_HOST: " . SMTP_HOST . "\n";
echo "   SMTP_PORT: " . SMTP_PORT . "\n";
echo "   SMTP_USERNAME: " . SMTP_USERNAME . "\n";
echo "   SMTP_FROM_EMAIL: " . SMTP_FROM_EMAIL . "\n";
echo "   RECIPIENT_CONTACT: " . RECIPIENT_CONTACT . "\n";
echo "   ✅ Configuration chargée\n\n";

// Test 2: Vérifier PHPMailer
echo "2️⃣  Vérification de PHPMailer...\n";
if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
    echo "   ✅ PHPMailer est installé\n\n";
} else {
    echo "   ❌ PHPMailer n'est pas trouvé!\n";
    echo "   Exécutez: composer install\n\n";
    exit(1);
}

// Test 3: Vérifier les permissions des dossiers
echo "3️⃣  Vérification des dossiers...\n";
if (is_writable(LOG_PATH)) {
    echo "   ✅ Dossier logs accessible\n";
} else {
    echo "   ⚠️  Dossier logs non accessible\n";
    echo "   Exécutez: mkdir -p " . LOG_PATH . " && chmod 755 " . LOG_PATH . "\n";
}
echo "\n";

// Test 4: Envoyer un email de test
echo "4️⃣  Test d'envoi d'email...\n";

$test_data = [
    'name' => 'Test',
    'firstname' => 'User',
    'entreprise' => 'Test Company',
    'tel' => '0123456789',
    'mail' => 'test@example.com',
    'message' => 'Ceci est un email de test du système de mailing.',
    'terms' => true
];

$mailer = new ContactMailer();

if ($mailer->send($test_data)) {
    echo "   ✅ Email de test envoyé avec succès!\n";
    echo "   Vérifiez votre boîte mail: " . RECIPIENT_CONTACT . "\n";
} else {
    echo "   ❌ Erreur lors de l'envoi:\n";
    $errors = $mailer->getErrors();
    foreach ($errors as $error) {
        echo "      - " . $error . "\n";
    }
}

echo "\n";
echo "=== FIN DU TEST ===\n";
echo "\nℹ️  Note: Consultez les logs dans le dossier 'logs/' pour plus de détails.\n";
?>
