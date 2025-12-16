# 📖 Exemples d'Utilisation - Spotilike Vue.js

## 🎯 Comment utiliser les services API

### 1. Récupérer et afficher des données

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { albumsService } from './services/api';

const albums = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchAlbums = async () => {
  try {
    loading.value = true;
    const response = await albumsService.getAllAlbums();
    albums.value = response.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAlbums();
});
</script>

<template>
  <div v-if="loading">Chargement...</div>
  <div v-else-if="error">Erreur : {{ error }}</div>
  <div v-else>
    <div v-for="album in albums" :key="album.id">
      {{ album.title }}
    </div>
  </div>
</template>
```

### 2. Ajouter un album (avec le formulaire)

#### Dans App.vue ou un autre composant parent :

```vue
<script setup>
import AddAlbumForm from './components/AddAlbumForm.vue';
import AlbumsList from './components/AlbumsList.vue';
import { ref } from 'vue';

const albumsListRef = ref(null);

const handleAlbumAdded = (newAlbum) => {
  console.log('Nouvel album ajouté:', newAlbum);
  // Vous pouvez rafraîchir la liste ici si nécessaire
  // ou émettre un événement pour forcer le rechargement
};
</script>

<template>
  <div>
    <AddAlbumForm @album-added="handleAlbumAdded" />
    <AlbumsList ref="albumsListRef" />
  </div>
</template>
```

### 3. Récupérer un album spécifique

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { albumsService } from './services/api';

const albumId = ref(1); // ID de l'album à récupérer
const album = ref(null);

const fetchAlbum = async () => {
  try {
    const response = await albumsService.getAlbumById(albumId.value);
    album.value = response.data;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

onMounted(() => {
  fetchAlbum();
});
</script>

<template>
  <div v-if="album">
    <h1>{{ album.title }}</h1>
    <p>Artiste ID: {{ album.artist_id }}</p>
  </div>
</template>
```

### 4. Mettre à jour un album

```vue
<script setup>
import { albumsService } from './services/api';

const updateAlbum = async (albumId, newData) => {
  try {
    const response = await albumsService.updateAlbum(albumId, {
      title: newData.title,
      artist_id: newData.artist_id,
      release_date: newData.release_date
    });
    
    console.log('Album mis à jour:', response.data);
    alert('Album mis à jour avec succès !');
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    alert('Erreur lors de la mise à jour');
  }
};

// Exemple d'utilisation
const handleUpdate = () => {
  updateAlbum(1, {
    title: 'Nouveau titre',
    artist_id: 2,
    release_date: '2024-01-01'
  });
};
</script>
```

### 5. Supprimer un album

```vue
<script setup>
import { albumsService } from './services/api';

const deleteAlbum = async (albumId) => {
  // Demander confirmation
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) {
    return;
  }

  try {
    await albumsService.deleteAlbum(albumId);
    alert('Album supprimé avec succès !');
    // Rafraîchir la liste des albums
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    alert('Erreur lors de la suppression');
  }
};
</script>

<template>
  <button @click="deleteAlbum(1)" class="delete-btn">
    🗑️ Supprimer
  </button>
</template>
```

## 🔄 Utilisation avec plusieurs services

### Récupérer artistes et albums ensemble

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { albumsService, artistsService } from './services/api';

const albums = ref([]);
const artists = ref([]);
const loading = ref(true);

const fetchData = async () => {
  try {
    loading.value = true;
    
    // Appels parallèles
    const [albumsResponse, artistsResponse] = await Promise.all([
      albumsService.getAllAlbums(),
      artistsService.getAllArtists()
    ]);
    
    albums.value = albumsResponse.data;
    artists.value = artistsResponse.data;
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
```

### Trouver l'artiste d'un album

```vue
<script setup>
import { ref, computed } from 'vue';

const albums = ref([
  { id: 1, title: 'Album 1', artist_id: 1 },
  { id: 2, title: 'Album 2', artist_id: 2 }
]);

const artists = ref([
  { id: 1, name: 'Artiste A' },
  { id: 2, name: 'Artiste B' }
]);

const getArtistName = (artistId) => {
  const artist = artists.value.find(a => a.id === artistId);
  return artist ? artist.name : 'Inconnu';
};

const albumsWithArtists = computed(() => {
  return albums.value.map(album => ({
    ...album,
    artistName: getArtistName(album.artist_id)
  }));
});
</script>

<template>
  <div v-for="album in albumsWithArtists" :key="album.id">
    <h3>{{ album.title }}</h3>
    <p>Par {{ album.artistName }}</p>
  </div>
</template>
```

## 🎨 Créer un composant de détails d'album

```vue
<!-- AlbumDetail.vue -->
<template>
  <div class="album-detail" v-if="album">
    <div class="album-header">
      <h1>{{ album.title }}</h1>
      <p class="artist-name">{{ artistName }}</p>
      <p class="release-date">
        📅 {{ formatDate(album.release_date) }}
      </p>
    </div>

    <div class="album-actions">
      <button @click="handleEdit" class="btn-edit">
        ✏️ Modifier
      </button>
      <button @click="handleDelete" class="btn-delete">
        🗑️ Supprimer
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { albumsService, artistsService } from '../services/api';

const props = defineProps({
  albumId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['deleted', 'updated']);

const album = ref(null);
const artist = ref(null);

const artistName = computed(() => {
  return artist.value ? artist.value.name : 'Chargement...';
});

const formatDate = (date) => {
  if (!date) return 'Date inconnue';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const fetchAlbumDetails = async () => {
  try {
    const albumResponse = await albumsService.getAlbumById(props.albumId);
    album.value = albumResponse.data;

    if (album.value.artist_id) {
      const artistResponse = await artistsService.getArtistById(album.value.artist_id);
      artist.value = artistResponse.data;
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
};

const handleEdit = () => {
  // Ouvrir un formulaire d'édition
  console.log('Édition de l\'album:', album.value);
};

const handleDelete = async () => {
  if (!confirm(`Supprimer "${album.value.title}" ?`)) return;

  try {
    await albumsService.deleteAlbum(props.albumId);
    emit('deleted', props.albumId);
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
  }
};

onMounted(() => {
  fetchAlbumDetails();
});
</script>

<style scoped>
.album-detail {
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
}

.album-header h1 {
  font-size: 2.5em;
  margin: 0 0 10px 0;
}

.artist-name {
  font-size: 1.3em;
  opacity: 0.9;
  margin: 10px 0;
}

.release-date {
  opacity: 0.7;
  margin: 10px 0;
}

.album-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  transition: transform 0.2s ease;
}

button:hover {
  transform: scale(1.05);
}

.btn-edit {
  background: #1db954;
  color: white;
}

.btn-delete {
  background: #ff4444;
  color: white;
}
</style>
```

## 🔍 Créer une barre de recherche

```vue
<!-- SearchBar.vue -->
<template>
  <div class="search-container">
    <input
      v-model="searchQuery"
      @input="handleSearch"
      type="text"
      placeholder="🔍 Rechercher un album, artiste ou genre..."
      class="search-input"
    />
    
    <div v-if="searchQuery && results.length > 0" class="results">
      <div
        v-for="result in results"
        :key="result.id"
        @click="selectResult(result)"
        class="result-item"
      >
        {{ result.title || result.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { albumsService, artistsService } from '../services/api';

const searchQuery = ref('');
const results = ref([]);
const emit = defineEmits(['result-selected']);

let searchTimeout = null;

const handleSearch = async () => {
  // Debounce la recherche
  clearTimeout(searchTimeout);
  
  if (!searchQuery.value.trim()) {
    results.value = [];
    return;
  }

  searchTimeout = setTimeout(async () => {
    try {
      const [albumsRes, artistsRes] = await Promise.all([
        albumsService.getAllAlbums(),
        artistsService.getAllArtists()
      ]);

      const query = searchQuery.value.toLowerCase();
      
      const filteredAlbums = albumsRes.data.filter(album =>
        album.title?.toLowerCase().includes(query)
      );
      
      const filteredArtists = artistsRes.data.filter(artist =>
        artist.name?.toLowerCase().includes(query)
      );

      results.value = [...filteredAlbums, ...filteredArtists].slice(0, 10);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    }
  }, 300);
};

const selectResult = (result) => {
  emit('result-selected', result);
  searchQuery.value = '';
  results.value = [];
};
</script>

<style scoped>
.search-container {
  position: relative;
  margin: 20px 0;
}

.search-input {
  width: 100%;
  padding: 15px 20px;
  font-size: 1.1em;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #1db954;
  background: rgba(255, 255, 255, 0.08);
}

.results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 10px;
  background: rgba(30, 30, 30, 0.98);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 100;
}

.result-item {
  padding: 15px 20px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background: rgba(29, 185, 84, 0.2);
}
</style>
```

## 🎵 Intégrer tout dans App.vue

```vue
<!-- App.vue - Version complète -->
<script setup>
import { ref } from 'vue';
import AlbumsList from './components/AlbumsList.vue';
import ArtistsList from './components/ArtistsList.vue';
import GenresList from './components/GenresList.vue';
import AddAlbumForm from './components/AddAlbumForm.vue';

const showAddForm = ref(false);
const albumsListRef = ref(null);

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
};

const handleAlbumAdded = (newAlbum) => {
  console.log('Nouvel album:', newAlbum);
  showAddForm.value = false;
  // Rafraîchir la liste si nécessaire
};
</script>

<template>
  <div class="app-container">
    <header class="header">
      <h1>🎧 Spotilike</h1>
      <p class="subtitle">Votre bibliothèque musicale</p>
      
      <button @click="toggleAddForm" class="btn-add-album">
        {{ showAddForm ? '❌ Fermer' : '➕ Ajouter un album' }}
      </button>
    </header>

    <main class="main-content">
      <AddAlbumForm
        v-if="showAddForm"
        @album-added="handleAlbumAdded"
      />
      
      <GenresList />
      <ArtistsList />
      <AlbumsList ref="albumsListRef" />
    </main>

    <footer class="footer">
      <p>© 2025 Spotilike - Made with Vue.js ❤️</p>
    </footer>
  </div>
</template>

<style>
/* ... styles existants ... */

.btn-add-album {
  margin-top: 15px;
  padding: 12px 30px;
  background: white;
  color: #1db954;
  border: none;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1em;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-add-album:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}
</style>
```

---

## 💡 Conseils supplémentaires

1. **Gestion des erreurs** : Toujours entourer les appels API de try/catch
2. **Loading states** : Afficher des indicateurs de chargement
3. **Feedback utilisateur** : Confirmer les actions (ajout, suppression)
4. **Validation** : Valider les données avant envoi
5. **Réactivité** : Utiliser `ref` et `reactive` pour la réactivité Vue

Bon développement ! 🚀

