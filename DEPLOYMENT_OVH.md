# 🚀 Guide de Déploiement sur OVH

## Étapes rapides de déploiement

### 1. Via FTP/SFTP

```bash
# Depuis votre machine locale, synchronisez les fichiers:
# - composer.json
# - src/*.php (tous les fichiers PHP du dossier src)
# - .env.example (renommez-le en .env et remplissez les données)
# - .gitignore (optionnel, mais recommandé)
# - script/notifications.js
# - style/notifications.css
# - test_mailing.php
# - MAILING_SETUP.md
```

### 2. Installation des dépendances sur le serveur

Via SSH/Terminal OVH:

```bash
cd /home/votre_compte/www/votre_domaine

# Option A: Si Composer est installé
composer install

# Option B: Si Composer n'est pas disponible
# Téléchargez https://getcomposer.org/download/composer.phar
php composer.phar install
```

### 3. Configuration du fichier .env

```bash
# Copier et éditer le fichier de configuration
cp .env.example .env
nano .env  # ou éditez via FTP
```

**À remplir avec vos données OVH :**
```env
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=465
SMTP_USERNAME=contact@cvca-energies.fr
SMTP_PASSWORD=motdepasse_ovh
SMTP_FROM_EMAIL=contact@cvca-energies.fr
SMTP_FROM_NAME=CVCA ENERGIES
RECIPIENT_CONTACT=crincketnathan@gmail.com
RECIPIENT_CARRIERE=crincketnathan@gmail.com
RATE_LIMIT_ENABLED=true
SPAM_CHECK_ENABLED=true
LOG_EMAILS=true
```

### 4. Créer le dossier des logs

```bash
mkdir -p logs
chmod 755 logs
```

### 5. Test de configuration

```bash
php test_mailing.php
```

Vous devriez voir un email de test arriver dans votre boîte mail.

---

## 🔧 Vérification après déploiement

### 1. Les formulaires fonctionnent-ils ?

Testez manuellement les formulaires de contact et carrière sur votre site.

### 2. Les emails arrivent-ils correctement ?

Vérifiez que les emails arrivent dans votre boîte entrante (pas le spam).

### 3. Les logs se créent-ils ?

```bash
ls -la logs/
cat logs/email_*.log
```

### 4. Avez-vous des erreurs ?

```bash
# Vérifier les permissions
ls -la src/
ls -la logs/

# Vérifier que PHP peut écrire
touch logs/test.txt
rm logs/test.txt
```

---

## 📧 Configuration SPF/DKIM sur OVH

Pour éviter que vos emails ne finissent pas en spam, configurez SPF et DKIM :

### SPF (Sender Policy Framework)

1. Allez dans l'espace client OVH
2. Sélectionnez votre domaine
3. Onglet **DNS**
4. Créez un enregistrement TXT :
   - **Zone** : @
   - **TTL** : 3600
   - **Cible** : `v=spf1 include:mx.ovh.com ~all`

### DKIM (DomainKeys Identified Mail)

OVH configure généralement cela automatiquement. Vérifiez dans :
1. Domaine → Email → Comptes
2. Sélectionnez votre adresse email
3. DKIM devrait être "Activé"

---

## 🆘 Dépannage courant

### "Failed to connect to server"
- Vérifiez que le port 465 est ouvert sur votre serveur
- Vérifiez vos identifiants SMTP
- Testez avec Telnet : `telnet ssl0.ovh.net 465`

### "Email rejected as spam"
- Assurez-vous que SPF/DKIM sont configurés
- Vérifiez que votre adresse email OVH n'est pas suspendue
- Attendez 24-48h après la configuration SPF/DKIM

### "Permission denied" sur les logs
```bash
chmod 777 logs/
# ou si vous connaissez l'utilisateur web:
chown -R www-data:www-data logs/
```

### Composer n'existe pas

Téléchargez et installez Composer :
```bash
# Télécharger composer.phar
curl https://getcomposer.org/download/latest-stable/composer.phar -o composer.phar

# Utiliser composer.phar
php composer.phar install
```

---

## 📚 Ressources utiles

- [Documentation PHPMailer](https://github.com/PHPMailer/PHPMailer/wiki)
- [Support OVH Email](https://help.ovh.com/fr/mail/)
- [MXToolbox - Test SPF/DKIM](https://mxtoolbox.com/)
- [Gmail Test Deliverability](https://toolbox.googleapps.com/apps/checkmx/)

---

## ✅ Checklist avant production

- [ ] Composer et dépendances installés (`vendor/` présent)
- [ ] Fichier `.env` créé et configuré
- [ ] Dossier `logs/` créé et accessible en écriture
- [ ] Test email envoyé et reçu (`php test_mailing.php`)
- [ ] SPF/DKIM configurés sur OVH
- [ ] Tous les formulaires testés manuellement
- [ ] `.env` ajouté à `.gitignore` (pour ne pas versionner les mots de passe)
- [ ] Logs vérifiés pour les erreurs

---

## 🔐 Points de sécurité importants

✅ Ne commitez JAMAIS le fichier `.env` avec les mots de passe  
✅ Conservez les backups de votre configuration  
✅ Vérifiez régulièrement les logs pour détecter les tentatives de spam  
✅ Maintenant PHPMailer à jour : `composer update`  

---

Bon déploiement ! 🎉
