# Système de Mailing Sécurisé - CVCA ENERGIES

## 📋 Vue d'ensemble

Ce système remplace l'ancien système de mailing basique par une solution robuste et sécurisée utilisant **PHPMailer** et **SMTP OVH**.

### Fonctionnalités de sécurité

✅ **Validation stricte** des données du formulaire  
✅ **Détection de spam** avec patterns intelligents  
✅ **Rate limiting** : limite du nombre de requêtes par IP/heure  
✅ **Honeypot** : protection contre les bots automatisés  
✅ **Gestion sécurisée des fichiers** : validation d'extension et taille  
✅ **Logs traçables** : journalisation de tous les envois  
✅ **Authentification SMTP** : configuration sécurisée avec OVH  
✅ **Emails HTML** : mises en page professionnelles  

---

## 🚀 Installation sur OVH

### Étape 1 : Cloner/Télécharger le projet

```bash
cd /home/votre_compte/www/cvca-energies
```

### Étape 2 : Installer les dépendances

```bash
composer install
```

Si Composer n'est pas disponible sur votre serveur :

1. [Téléchargez Composer](https://getcomposer.org/download/)
2. Uploadez le fichier `composer.phar` via FTP dans le répertoire racine
3. Exécutez :
```bash
php composer.phar install
```

### Étape 3 : Configuration

1. Copiez le fichier `.env.example` en `.env` :
```bash
cp .env.example .env
```

2. Éditez le fichier `.env` avec vos paramètres OVH :

```env
# Configuration SMTP OVH
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=465
SMTP_USERNAME=contact@cvca-energies.fr
SMTP_PASSWORD=votre_mot_de_passe_ovh
SMTP_FROM_EMAIL=contact@cvca-energies.fr
SMTP_FROM_NAME=CVCA ENERGIES

# Destinataires
RECIPIENT_CONTACT=crincketnathan@gmail.com
RECIPIENT_CARRIERE=crincketnathan@gmail.com

# Sécurité
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_HOUR=5
SPAM_CHECK_ENABLED=true
LOG_EMAILS=true
LOG_PATH=../logs/
```

### Étape 4 : Créer le dossier des logs

```bash
mkdir -p logs
chmod 755 logs
```

### Étape 5 : Vérifier les permissions

```bash
chmod 644 src/config.php
chmod 644 src/*.php
chmod 755 src/
```

---

## 📊 Configuration OVH

### Récupérer les identifiants SMTP

1. Allez dans votre **espace client OVH**
2. Sélectionnez votre **domaine**
3. Allez dans **Email → Comptes**
4. Cliquez sur votre adresse email
5. Notez les paramètres :
   - **Serveur SMTP** : `ssl0.ovh.net`
   - **Port** : `465` (SSL) ou `587` (TLS)
   - **Identifiant** : Votre adresse email complète
   - **Mot de passe** : Celui configuré dans OVH

### Test de connexion

Vous pouvez vérifier que la configuration est correcte en visitant votre page de contact et en envoyant un test.

---

## 🔒 Sécurité et limitations

### Rate Limiting
- Par défaut : **5 envois par heure par IP**
- Modifiable dans `.env` : `RATE_LIMIT_PER_HOUR`

### Validation des fichiers (formulaire carrière)
- **Extensions autorisées** : PDF, DOC, DOCX, JPG, JPEG, PNG
- **Taille maximale** : 5 MB par fichier
- Modifiable dans `src/config.php`

### Détection de spam
- Détecte automatiquement les mots-clés suspects
- Bloque les URLs excessives
- Vérifie le format du contenu

---

## 📝 Logs et diagnostique

### Localisation des logs
```
logs/
├── email_2026-04-21.log    # Logs des emails envoyés
└── rate_limit.log           # Historique du rate limiting
```

### Format des logs email
```json
{
  "timestamp": "2026-04-21 14:30:45",
  "ip": "192.168.1.1",
  "recipient": "contact@cvca-energies.fr",
  "subject": "Nouveau message de contact",
  "success": true,
  "error": "",
  "sender_email": "user@example.com"
}
```

---

## 🛠️ Dépannage

### "Erreur de connexion SMTP"
**Solution** :
1. Vérifiez vos identifiants dans `.env`
2. Vérifiez que le port 465 est accessible sur votre serveur
3. Vérifiez que votre compte OVH n'est pas suspendu

### "Mails rejetés en spam"
**Solution** :
1. Vérifiez que SPF/DKIM sont configurés sur OVH
2. Utilisez un domaine valide dans `SMTP_FROM_NAME`
3. Évitez les sujets avec trop d'exclamations

### "Erreur de permission sur les logs"
**Solution** :
```bash
chmod 777 logs/
chown www-data:www-data logs/  # Ou votre utilisateur web
```

---

## 📦 Structure des fichiers

```
src/
├── config.php              # Configuration centralisée
├── Mailer.php              # Classe abstraite de base
├── ContactMailer.php       # Mailer pour formulaire contact
├── CarriereMailer.php      # Mailer pour formulaire carrière
├── send_mail_contact.php   # Endpoint pour contact
└── send_mail_carriere.php  # Endpoint pour carrière

logs/                        # Dossier des logs (créé automatiquement)
.env                         # Configuration locale (à créer)
.env.example                 # Template de configuration
composer.json               # Gestion des dépendances
.gitignore                  # Fichiers à ignorer dans Git
```

---

## 🔄 Mise à jour future

Pour mettre à jour les dépendances PHP :

```bash
composer update
```

Pour revenir à une version spécifique de PHPMailer :

```bash
composer require phpmailer/phpmailer:^6.8
```

---

## 📧 Support

En cas de problème, consultez :
- [Documentation PHPMailer](https://github.com/PHPMailer/PHPMailer)
- [Support OVH Email](https://help.ovh.com/)
- Vérifiez les logs dans le dossier `logs/`

---

## License

Système personnalisé pour CVCA ENERGIES
