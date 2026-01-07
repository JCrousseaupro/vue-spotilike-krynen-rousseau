<script setup>
import { ref, onMounted, watch } from 'vue';
import Sidebar from './components/Sidebar/Sidebar.vue';
import Login from './components/Login/Login.vue';
import Register from './components/Register/Register.vue';
import AlbumsList from './components/AlbumsList/AlbumsList.vue';
import ArtistsList from './components/ArtistsList/ArtistsList.vue';
import { authStore } from './stores/authStore';
import apiClient, { albumsService, artistsService } from './services/api';

const currentView = ref('home'); // 'home', 'login', 'register', 'albums', 'artists', 'songs'

const statsLoading = ref(false);
const albumsCount = ref(null);
const artistsCount = ref(null);
const songsCount = ref(null);

const fetchHomeStats = async () => {
  if (!authStore.isAuthenticated.value) return;

  statsLoading.value = true;
  try {
    const [albumsRes, artistsRes] = await Promise.all([
      albumsService.getAllAlbums(),
      artistsService.getAllArtists()
    ]);

    const albums = albumsRes.data?.data || albumsRes.data || [];
    const artists = artistsRes.data?.data || artistsRes.data || [];

    albumsCount.value = Array.isArray(albums) ? albums.length : 0;
    artistsCount.value = Array.isArray(artists) ? artists.length : 0;

    // Songs count: try dedicated endpoint first; fallback to summing per-album songs.
    try {
      const songsRes = await apiClient.get('/songs');
      const songs = songsRes.data?.data || songsRes.data || [];
      songsCount.value = Array.isArray(songs) ? songs.length : 0;
    } catch {
      const songLists = await Promise.all(
        (Array.isArray(albums) ? albums : []).map((a) =>
          albumsService
            .getAlbumSongs(a.id)
            .then((r) => r.data?.data || r.data || [])
            .catch(() => [])
        )
      );
      songsCount.value = songLists.reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
    }
  } finally {
    statsLoading.value = false;
  }
};

const setView = (view) => {
  // sécurité: si pas connecté, on force login
  if (!authStore.isAuthenticated.value && view !== 'login' && view !== 'register') {
    currentView.value = 'login';
    return;
  }
  currentView.value = view;
};

const showLogin = () => {
  currentView.value = 'login';
};

const showRegister = () => {
  currentView.value = 'register';
};

const showHome = () => {
  currentView.value = 'home';
};

const handleLoginSuccess = (user) => {
  console.log('Utilisateur connecté:', user);
  currentView.value = 'home';
};

const handleRegisterSuccess = (user) => {
  console.log('Utilisateur inscrit:', user);
};

const handleLogout = () => {
  currentView.value = 'home';
};

watch(
  () => [authStore.isAuthenticated.value, currentView.value],
  ([isAuth, view]) => {
    if (isAuth && view === 'home') fetchHomeStats();
  },
  { immediate: true }
);

onMounted(() => {
  if (authStore.isAuthenticated.value && currentView.value === 'home') fetchHomeStats();
});
</script>

<template>
  <div class="app-container">
    <Sidebar :active-view="currentView" @navigate="setView" @show-login="showLogin" @show-register="showRegister"
      @logout="handleLogout" @go-home="showHome" />

    <div class="main-wrapper">
      <!-- Vue Login -->
      <div v-if="currentView === 'login'" class="auth-page">
        <Login @login-success="handleLoginSuccess" @switch-to-register="showRegister" />
      </div>

      <!-- Vue Register -->
      <div v-else-if="currentView === 'register'" class="auth-page">
        <Register @register-success="handleRegisterSuccess" @switch-to-login="showLogin" />
      </div>


      <!-- Vue Home (Contenu principal) -->
      <div v-else class="content-area">
        <!-- Si connecté : afficher la bibliothèque -->
        <div v-if="authStore.isAuthenticated.value">

          <main class="main-content">
            <!-- HOME -->
            <div v-if="currentView === 'home'" class="home-grid">
              <div class="welcome-section">
                <h1 class="welcome-title">Bonjour {{ authStore.currentUser.value?.username }} !</h1>
                <p class="subtitle">Bienvenue sur Spotilike</p>
              </div>

              <button class="home-tile" type="button" @click="setView('albums')">
                <span class="material-symbols-outlined home-icon">album</span>
                <div class="home-title">Albums</div>
                <div class="home-subtitle">Parcourir la collection</div>
              </button>

              <button class="home-tile" type="button" @click="setView('artists')">
                <span class="material-symbols-outlined home-icon">person</span>
                <div class="home-title">Artistes</div>
                <div class="home-subtitle">Voir les artistes</div>
              </button>

              <div class="stats-title">
                <div class="stats-title-row">
                  <span class="material-symbols-outlined stats-icon">monitoring</span>
                  <h2 class="stats-heading">Statistiques générales</h2>
                </div>
                <p class="stats-subheading">Un aperçu rapide de ta bibliothèque</p>
              </div>

              <div class="home-stats">
                <div class="stat-card">
                  <div class="stat-label">Albums</div>
                  <div class="stat-value">{{ statsLoading ? '…' : (albumsCount ?? '—') }}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-label">Artistes</div>
                  <div class="stat-value">{{ statsLoading ? '…' : (artistsCount ?? '—') }}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-label">Songs</div>
                  <div class="stat-value">{{ statsLoading ? '…' : (songsCount ?? '—') }}</div>
                </div>
              </div>
            </div>

            <!-- VUES -->
            <AlbumsList v-else-if="currentView === 'albums'" />
            <ArtistsList v-else-if="currentView === 'artists'" />

            <!-- TODO Songs -->
            <div v-else-if="currentView === 'songs'" class="todo-view">
              <h2>Songs</h2>
              <p>TODO: supprimer Songs et afficher les songs depuis un album (au clic).</p>
            </div>
          </main>
        </div>

        <!-- Si NON connecté : message d'accueil -->
        <div v-else class="welcome-guest">
          <div class="guest-content">
            <div class="guest-title-container">
              <img class="brand-logo" src="./assets/logo.svg" alt="Spotilike" />
              <h1 class="guest-title">Bienvenue sur Spotilike</h1>
            </div>
            <p class="guest-message">Connectez-vous pour accéder à votre bibliothèque musicale</p>
            <div class="guest-actions">
              <button @click="showLogin" class="btn-guest-login">Se connecter</button>
              <button @click="showRegister" class="btn-guest-register">Créer un compte</button>
            </div>
          </div>
        </div>

      </div>

      <footer class="footer">
        <p>© 2025 Spotilike</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background: #0f0f0f;
  color: white;
}

.auth-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.main-wrapper {
  flex: 1;
  min-width: 0;
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%);
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.content-area {
  width: 100%;
  padding: 0 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.welcome-section {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 60px 30px;
  background: linear-gradient(180deg, rgba(29, 185, 84, 0.1) 0%, transparent 100%);
  border-radius: 10px;
  margin: 20px 0;
}

.welcome-title {
  font-size: 2.5em;
  margin: 0 0 10px 0;
  color: #1db954;
  font-weight: 700;
}

.brand-logo {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.subtitle {
  font-size: 1.3em;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
}

.welcome-guest {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 60px;
  flex: 1;
}

.guest-content {
  text-align: center;
  max-width: 600px;
}

.guest-title {
  font-size: 3em;
  margin: 0 0 20px 0;
  color: #1db954;
  font-weight: 800;
}

.guest-message {
  font-size: 1.3em;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 40px 0;
}

.guest-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn-guest-login,
.btn-guest-register {
  padding: 16px 40px;
  border: none;
  border-radius: 30px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-guest-login {
  background: #1db954;
  color: white;
}

.btn-guest-login:hover {
  background: #1ed760;
  transform: translateY(-2px);
}

.btn-guest-register {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-guest-register:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.main-content {
  padding: 20px 0 60px;
}

.home-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 18px;
  margin-top: 10px;
}

.home-stats {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, minmax(160px, 1fr));
  gap: 14px;
}

.stats-title {
  grid-column: 1 / -1;
  margin-top: 4px;
}

.stats-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stats-icon {
  color: #1db954;
  font-size: 22px;
}

.stats-heading {
  margin: 0;
  color: #ffffff;
  font-size: 1.2em;
  font-weight: 900;
  letter-spacing: -0.3px;
}

.stats-subheading {
  margin: 6px 0 0 0;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.95em;
}

.stat-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
}

.stat-label {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.9em;
  margin-bottom: 6px;
}

.stat-value {
  color: #ffffff;
  font-size: 1.6em;
  font-weight: 900;
  letter-spacing: -0.5px;
}

.home-tile {
  text-align: left;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(29, 185, 84, 0.18);
  border-radius: 14px;
  padding: 18px;
  color: #fff;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.home-tile:hover {
  transform: translateY(-3px);
  border-color: rgba(29, 185, 84, 0.5);
  box-shadow: 0 16px 46px rgba(0, 0, 0, 0.38), 0 0 22px rgba(29, 185, 84, 0.16);
}

.home-icon {
  font-size: 34px;
  color: #1db954;
  display: inline-block;
  margin-bottom: 10px;
}

.home-title {
  font-size: 1.15em;
  font-weight: 800;
  margin-bottom: 6px;
}

.home-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95em;
}

.todo-view h2 {
  color: #1db954;
  margin-bottom: 10px;
}

.todo-view p {
  color: rgba(255, 255, 255, 0.7);
}

.footer {
  text-align: center;
  padding: 12px 40px;
  background: rgba(0, 0, 0, 0.35);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.footer p {
  margin: 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85em;
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    padding: 40px 30px;
  }

  .welcome-section {
    padding: 40px 30px 30px;
  }

  .footer {
    margin-left: -40px;
    margin-right: -40px;
    padding: 12px 30px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px;
  }

  .welcome-section {
    padding: 40px 20px 20px;
  }

  .subtitle {
    font-size: 1.5em;
  }

  .content-area {
    padding: 0 20px;
  }

  .footer {
    margin-left: -20px;
    margin-right: -20px;
    padding: 10px 20px;
  }
}

@media (max-width: 1024px) {
  .home-grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }

  .home-stats {
    grid-template-columns: repeat(3, minmax(160px, 1fr));
  }
}

@media (max-width: 640px) {
  .home-grid {
    grid-template-columns: 1fr;
  }

  .home-stats {
    grid-template-columns: 1fr;
  }
}
</style>
