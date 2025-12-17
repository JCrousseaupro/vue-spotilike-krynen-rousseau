<script setup>
import { ref } from 'vue';
import Sidebar from './components/Sidebar/Sidebar.vue';
import Login from './components/Login/Login.vue';
import Register from './components/Register/Register.vue';
import AlbumsList from './components/AlbumsList/AlbumsList.vue';
import ArtistsList from './components/ArtistsList/ArtistsList.vue';
import GenresList from './components/GenresList/GenresList.vue';
import { authStore } from './stores/authStore';

const currentView = ref('home'); // 'home', 'login', 'register'

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
</script>

<template>
  <div class="app-container">
    <Sidebar
    :active-view="currentView"
    @navigate="setView"
    @show-login="showLogin"
    @show-register="showRegister"
    @logout="handleLogout"
    @go-home="showHome"
    />

    <div class="main-wrapper">
      <!-- Vue Login -->
      <Login
        v-if="currentView === 'login'"
        @login-success="handleLoginSuccess"
        @switch-to-register="showRegister"
      />

      <!-- Vue Register -->
      <Register
        v-else-if="currentView === 'register'"
        @register-success="handleRegisterSuccess"
        @switch-to-login="showLogin"
      />

      <!-- Vue Home (Contenu principal) -->
      <div v-else class="content-area">
        <!-- Si connecté : afficher la bibliothèque -->
        <div v-if="authStore.isAuthenticated.value">
          <div class="welcome-section">
            <h1 class="welcome-title">Bonjour {{ authStore.currentUser.value?.username }} !</h1>
            <p class="subtitle">Bienvenue sur Spotilike</p>
          </div>

          <main class="main-content">
            <GenresList v-if="currentView === 'genres'" />
            <AlbumsList v-if="currentView === 'albums'" />
            <ArtistsList v-if="currentView === 'artists'" />
            <SongsList v-if="currentView === 'songs'" />
          </main>
        </div>

        <!-- Si NON connecté : message d'accueil -->
        <div v-else class="welcome-guest">
          <div class="guest-content">
            <h1 class="guest-title">Bienvenue sur Spotilike</h1>
            <p class="guest-message">Connectez-vous pour accéder à votre bibliothèque musicale</p>
            <div class="guest-actions">
              <button @click="showLogin" class="btn-guest-login">Se connecter</button>
              <button @click="showRegister" class="btn-guest-register">Créer un compte</button>
            </div>
          </div>
        </div>

        <footer class="footer">
          <p>© 2025 Spotilike - Made with Vue.js</p>
        </footer>
      </div>
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

.main-wrapper {
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%);
  overflow-x: hidden;
  height: 100vh;
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

.footer {
  text-align: center;
  /* Full width of the right side (ignore content padding) */
  margin-left: -40px;
  margin-right: -40px;
  padding: 12px 40px;
  background: rgba(0, 0, 0, 0.35);
  margin-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
  position: sticky;
  bottom: 0;
  z-index: 2;
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
</style>
