<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="logo" @click="handleLogoClick">Spotilike</h1>
    </div>

    <nav class="sidebar-nav" v-if="authStore.isAuthenticated.value">
      <div class="nav-item" :class="{ active: activeView === 'home' }" @click="emit('navigate', 'home')">
        <span class="label">Accueil</span>
      </div>
      <div class="nav-item" :class="{ active: activeView === 'genres' }" @click="emit('navigate', 'genres')">
      <span class="label">Genres</span>
      </div>
      <div class="nav-item" :class="{ active: activeView === 'albums' }" @click="emit('navigate', 'albums')">
        <span class="label">Albums</span>
      </div>

      <div class="nav-item" :class="{ active: activeView === 'artists' }" @click="emit('navigate', 'artists')">
        <span class="label">Artistes</span>
      </div>

      <div class="nav-item" :class="{ active: activeView === 'songs' }" @click="emit('navigate', 'songs')">
        <span class="label">Songs</span>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div v-if="authStore.isAuthenticated.value" class="user-info">
        <p class="username">{{ authStore.currentUser.value?.username }}</p>
        <button @click="handleLogout" class="btn-logout-sidebar">
          Déconnexion
        </button>
      </div>
      <div v-else class="auth-buttons-sidebar">
        <button @click="$emit('show-login')" class="btn-login-sidebar">
          Connexion
        </button>
        <button @click="$emit('show-register')" class="btn-register-sidebar">
          Inscription
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { authStore } from '../../stores/authStore';
import { authService } from '../../services/authService';

const props = defineProps({
  activeView: { type: String, default: 'home' }
});

const emit = defineEmits(['show-login', 'show-register', 'logout', 'go-home', 'navigate']);

const handleLogout = () => {
  authService.logout();
  emit('logout');
};

const handleLogoClick = () => {
  if (authStore.isAuthenticated.value) {
    emit('go-home');
  } else {
    emit('show-login');
  }
};
</script>

<style scoped src="./Sidebar.css"></style>