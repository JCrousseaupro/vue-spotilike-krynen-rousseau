# Endpoints corrigés - Frontend Vue.js

## Résumé des changements

J'ai corrigé le fichier `src/services/api.js` pour utiliser **EXACTEMENT** les 15 endpoints du backend.

## Endpoints disponibles par service

### Albums (7 endpoints)
1. ✅ `getAllAlbums()` → GET /api/albums
2. ✅ `getAlbumById(id)` → GET /api/albums/:id
3. ✅ `getAlbumSongs(id)` → GET /api/albums/:id/songs
4. ✅ `createAlbum(data)` → POST /api/albums
5. ✅ `addSongToAlbum(id, songData)` → POST /api/albums/:id/songs
6. ✅ `updateAlbum(id, data)` → PUT /api/albums/:id
7. ✅ `deleteAlbum(id)` → DELETE /api/albums/:id

### Artists (3 endpoints)
1. ✅ `getArtistSongs(id)` → GET /api/artists/:id/songs
2. ✅ `updateArtist(id, data)` → PUT /api/artists/:id
3. ✅ `deleteArtist(id)` → DELETE /api/artists/:id

**⚠️ Important** : Il n'y a PAS d'endpoint pour :
- Récupérer tous les artistes
- Récupérer un artiste par ID
- Créer un artiste

### Genres (2 endpoints)
1. ✅ `getAllGenres()` → GET /api/genres
2. ✅ `updateGenre(id, data)` → PUT /api/genres/:id

**⚠️ Important** : Il n'y a PAS d'endpoint pour :
- Récupérer un genre par ID
- Créer un genre
- Supprimer un genre

### Users (1 endpoint dans api.js)
1. ✅ `deleteUser(id)` → DELETE /api/users/:id

**Note** : signup et login sont gérés par `authService.js`

## Améliorations ajoutées

### Intercepteur JWT
Ajout d'un intercepteur axios qui ajoute automatiquement le token JWT à toutes les requêtes :

```javascript
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

## Problème avec ArtistsList.vue

Le composant `ArtistsList.vue` ne peut PAS fonctionner actuellement car :
- Il essaie d'appeler `getAllArtists()` 
- Cet endpoint n'existe PAS dans le backend

### Solutions possibles :

**Option 1** : Désactiver le composant ArtistsList
- Retirer ArtistsList de App.vue temporairement

**Option 2** : Modifier ArtistsList pour afficher les artistes d'une autre manière
- Par exemple, récupérer les artistes à partir des albums

**Option 3** : Demander au prof d'ajouter l'endpoint GET /api/artists

## Test des endpoints

Tous les endpoints fonctionnent maintenant AVEC authentification JWT.

Pour tester :
1. S'inscrire : POST /api/users/signup
2. Se connecter : POST /api/users/login (récupère un token)
3. Le token est automatiquement envoyé dans les autres requêtes

## Statut

✅ **api.js corrigé** - Utilise exactement les 15 endpoints
✅ **JWT automatique** - Token envoyé automatiquement
⚠️ **ArtistsList** - Ne peut pas fonctionner (pas d'endpoint)
✅ **AlbumsList** - Fonctionne
✅ **GenresList** - Fonctionne
✅ **Login/Register** - Fonctionne

