# 🎧 Guide de Démarrage - Spotilike Vue.js

## 📋 Prérequis

- Node.js (v20.19.0 ou >= 22.12.0)
- NPM ou Yarn
- Backend Express Spotilike en cours d'exécution

## 🚀 Installation

### 1. Backend Express (API)

```bash
# Aller dans le dossier du backend
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\express-spotilike

# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer le serveur (par défaut sur le port 5678)
npm start
```

Le serveur devrait afficher :
```
🚀 Serveur démarré sur http://localhost:5678
```

### 2. Frontend Vue.js

```bash
# Aller dans le dossier frontend
cd c:\Users\Jean-Charles\Documents\Cour\projet-spotilike\vue-spotilike\spotilike-vue

# Installer les dépendances (déjà fait)
npm install

# Démarrer l'application Vue.js
npm run dev
```

L'application devrait se lancer sur : `http://localhost:5173`

## 📁 Structure du Projet

```
spotilike-vue/
├── src/
│   ├── components/
│   │   ├── AlbumsList.vue      # Affichage des albums
│   │   ├── ArtistsList.vue     # Affichage des artistes
│   │   └── GenresList.vue      # Affichage des genres
│   ├── services/
│   │   └── api.js              # Service API centralisé
│   ├── App.vue                 # Composant principal
│   └── main.js                 # Point d'entrée
```

## 🔧 Configuration API

### Service API (`src/services/api.js`)

Le service API expose les méthodes suivantes :

#### Albums
- `getAllAlbums()` - Récupérer tous les albums
- `getAlbumById(id)` - Récupérer un album par ID
- `createAlbum(data)` - Créer un nouvel album
- `updateAlbum(id, data)` - Mettre à jour un album
- `deleteAlbum(id)` - Supprimer un album

#### Artistes
- `getAllArtists()` - Récupérer tous les artistes
- `getArtistById(id)` - Récupérer un artiste par ID
- `createArtist(data)` - Créer un nouvel artiste
- `updateArtist(id, data)` - Mettre à jour un artiste
- `deleteArtist(id)` - Supprimer un artiste

#### Genres
- `getAllGenres()` - Récupérer tous les genres
- `getGenreById(id)` - Récupérer un genre par ID
- `createGenre(data)` - Créer un nouveau genre
- `updateGenre(id, data)` - Mettre à jour un genre
- `deleteGenre(id)` - Supprimer un genre

#### Utilisateurs
- `getAllUsers()` - Récupérer tous les utilisateurs
- `getUserById(id)` - Récupérer un utilisateur par ID
- `createUser(data)` - Créer un nouvel utilisateur
- `updateUser(id, data)` - Mettre à jour un utilisateur
- `deleteUser(id)` - Supprimer un utilisateur

### Exemple d'utilisation dans un composant

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { albumsService } from '../services/api';

const albums = ref([]);
const loading = ref(true);

const fetchAlbums = async () => {
  try {
    const response = await albumsService.getAllAlbums();
    albums.value = response.data;
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAlbums();
});
</script>
```

## 🎨 Composants

### AlbumsList.vue
Affiche tous les albums dans une grille responsive avec :
- Titre de l'album
- ID de l'artiste
- Date de sortie
- Design moderne avec dégradés

### ArtistsList.vue
Affiche tous les artistes avec :
- Avatar avec initiale
- Nom de l'artiste
- Biographie (tronquée)
- Design élégant

### GenresList.vue
Affiche les genres musicaux sous forme de tags colorés.

## 🔄 Modification de l'URL de l'API

Si votre API est sur un autre port ou domaine, modifiez `src/services/api.js` :

```javascript
const API_BASE_URL = 'http://localhost:VOTRE_PORT/api';
```

## ⚠️ Dépannage

### Erreur CORS
Si vous rencontrez des erreurs CORS, vérifiez que :
1. Le backend Express a le middleware CORS installé et configuré
2. L'URL du frontend correspond dans la configuration CORS du backend

### L'API ne répond pas
Vérifiez que :
1. Le serveur Express est bien démarré
2. La base de données est accessible
3. Les ports ne sont pas déjà utilisés

### Les données ne s'affichent pas
1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs réseau
3. Testez l'API directement : `http://localhost:5678/api/albums`

## 📝 Scripts NPM disponibles

```bash
# Lancer le serveur de développement
npm run dev

# Compiler pour la production
npm run build

# Prévisualiser la version de production
npm run preview
```

## 🎯 Prochaines étapes

Fonctionnalités à ajouter :
- [ ] Système de recherche
- [ ] Filtrage par genre/artiste
- [ ] Pagination des résultats
- [ ] Formulaires d'ajout/modification
- [ ] Lecture audio
- [ ] Système d'authentification
- [ ] Gestion des playlists

## 💡 Conseils

1. **Gardez le backend et le frontend en cours d'exécution** dans deux terminaux séparés
2. **Vérifiez les logs** de la console navigateur pour débugger
3. **Utilisez Vue DevTools** pour inspecter l'état des composants
4. **Testez l'API avec Postman ou curl** avant d'implémenter dans le frontend

---

Bon développement ! 🚀

