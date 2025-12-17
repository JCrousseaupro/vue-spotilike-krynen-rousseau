<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="logo" @click="handleLogoClick">Spotilike</h1>
    </div>

    <nav class="sidebar-nav" v-if="authStore.isAuthenticated.value">
      <div class="nav-item active">
        <span class="label">Accueil</span>
      </div>
      <div class="nav-item">
        <span class="label">Genres</span>
      </div>
      <div class="nav-item">
        <span class="label">Albums</span>
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

const emit = defineEmits(['show-login', 'show-register', 'logout', 'go-home']);

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