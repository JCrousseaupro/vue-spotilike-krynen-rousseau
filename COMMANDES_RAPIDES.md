# ⚡ Commandes Rapides - Spotilike

## 🚀 Démarrage Rapide

### Option 1 : Deux terminaux séparés

**Terminal 1 - Backend :**
```powershell
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\express-spotilike
npm start
```

**Terminal 2 - Frontend :**
```powershell
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\vue-spotilike\spotilike-vue
npm run dev
```

### Option 2 : Un seul terminal (avec jobs en arrière-plan)

```powershell
# Démarrer le backend en arrière-plan
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\express-spotilike
Start-Job -ScriptBlock { npm start }

# Démarrer le frontend
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\vue-spotilike\spotilike-vue
npm run dev
```

## 🔗 URLs importantes

- **Frontend Vue.js** : http://localhost:5173
- **Backend API** : http://localhost:5678
- **API Albums** : http://localhost:5678/api/albums
- **API Artistes** : http://localhost:5678/api/artists
- **API Genres** : http://localhost:5678/api/genres
- **API Users** : http://localhost:5678/api/users

## 🛠️ Commandes NPM - Frontend

```powershell
# Naviguer vers le frontend
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\vue-spotilike\spotilike-vue

# Démarrer le serveur de développement
npm run dev

# Compiler pour la production
npm run build

# Prévisualiser la version de production
npm run preview

# Installer les dépendances
npm install

# Installer une nouvelle dépendance
npm install nom-du-package
```

## 🛠️ Commandes NPM - Backend

```powershell
# Naviguer vers le backend
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\express-spotilike

# Démarrer le serveur
npm start

# Installer les dépendances
npm install
```

## 🔧 Tester l'API avec PowerShell

### Récupérer tous les albums
```powershell
Invoke-RestMethod -Uri "http://localhost:5678/api/albums" -Method GET
```

### Récupérer tous les artistes
```powershell
Invoke-RestMethod -Uri "http://localhost:5678/api/artists" -Method GET
```

### Ajouter un album
```powershell
$body = @{
    title = "Nouvel Album"
    artist_id = 1
    release_date = "2024-01-01"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/api/albums" -Method POST -Body $body -ContentType "application/json"
```

### Supprimer un album
```powershell
Invoke-RestMethod -Uri "http://localhost:5678/api/albums/1" -Method DELETE
```

## 🧹 Nettoyage

### Arrêter les processus

```powershell
# Arrêter tous les processus Node.js
Get-Process node | Stop-Process -Force

# Ou utiliser Ctrl+C dans chaque terminal
```

### Nettoyer les modules et réinstaller

**Frontend :**
```powershell
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\vue-spotilike\spotilike-vue
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

**Backend :**
```powershell
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\express-spotilike
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

## 🐛 Dépannage

### Vérifier si un port est utilisé

```powershell
# Vérifier le port 5678 (backend)
Get-NetTCPConnection -LocalPort 5678 -ErrorAction SilentlyContinue

# Vérifier le port 5173 (frontend)
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
```

### Libérer un port occupé

```powershell
# Trouver le processus sur le port 5678
$port = 5678
$processId = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess
if ($processId) {
    Stop-Process -Id $processId -Force
    Write-Host "Processus $processId arrêté sur le port $port"
}
```

### Vérifier les versions

```powershell
# Version de Node.js
node --version

# Version de npm
npm --version

# Lister les packages installés (frontend)
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\vue-spotilike\spotilike-vue
npm list --depth=0
```

## 📊 Logs et Debugging

### Voir les logs en temps réel

Les logs s'affichent automatiquement dans les terminaux où vous avez lancé les serveurs.

### Console du navigateur

1. Ouvrir http://localhost:5173
2. Appuyer sur F12 ou Ctrl+Shift+I
3. Aller dans l'onglet "Console" pour voir les logs JavaScript
4. Aller dans l'onglet "Network" pour voir les requêtes API

## 🔄 Redémarrer rapidement

```powershell
# Arrêter tous les processus Node.js
Get-Process node | Stop-Process -Force

# Attendre 2 secondes
Start-Sleep -Seconds 2

# Redémarrer le backend
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\express-spotilike
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

# Attendre 3 secondes
Start-Sleep -Seconds 3

# Redémarrer le frontend
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\vue-spotilike\spotilike-vue
npm run dev
```

## 📦 Mise à jour des dépendances

### Vérifier les mises à jour disponibles

```powershell
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\vue-spotilike\spotilike-vue
npm outdated
```

### Mettre à jour toutes les dépendances

```powershell
npm update
```

### Mettre à jour une dépendance spécifique

```powershell
npm update axios
```

## 🎯 Raccourcis VSCode / Cursor

- **Ctrl + `** : Ouvrir/fermer le terminal intégré
- **Ctrl + Shift + `** : Créer un nouveau terminal
- **Ctrl + P** : Recherche rapide de fichiers
- **Ctrl + Shift + F** : Recherche dans tous les fichiers
- **Ctrl + B** : Afficher/masquer la barre latérale
- **F5** : Démarrer le débogueur

## 📝 Notes importantes

1. **Toujours démarrer le backend avant le frontend**
2. **Garder les deux terminaux ouverts** pendant le développement
3. **Vérifier la console navigateur** en cas d'erreur
4. **Sauvegarder régulièrement** votre code
5. **Utiliser Git** pour versionner vos modifications

## 🌐 Tester depuis un autre appareil sur le même réseau

1. Trouver votre adresse IP locale :
```powershell
ipconfig | Select-String "IPv4"
```

2. Mettre à jour l'URL dans `src/services/api.js` :
```javascript
const API_BASE_URL = 'http://VOTRE_IP:5678/api';
```

3. Mettre à jour CORS dans `backend/server.js` :
```javascript
app.use(cors({
    origin: 'http://VOTRE_IP:5173',
    credentials: true
}));
```

---

💡 **Astuce** : Gardez ce fichier ouvert dans un onglet pour un accès rapide aux commandes !

