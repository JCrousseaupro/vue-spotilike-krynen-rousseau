import { reactive, computed } from 'vue';

// Store simple sans dépendance externe (alternative à Pinia)
const state = reactive({
  currentUser: null,
  isAuthenticated: false,
  isLoading: false
});

// Actions
export const authStore = {
  // État
  state,

  // Getters
  get currentUser() {
    return computed(() => state.currentUser);
  },

  get isAuthenticated() {
    return computed(() => state.isAuthenticated);
  },

  get isLoading() {
    return computed(() => state.isLoading);
  },

  // Actions
  setUser(user) {
    state.currentUser = user;
    state.isAuthenticated = !!user;
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  },

  logout() {
    state.currentUser = null;
    state.isAuthenticated = false;
    localStorage.removeItem('currentUser');
  },

  loadUserFromStorage() {
    try {
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        const user = JSON.parse(userJson);
        state.currentUser = user;
        state.isAuthenticated = true;
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      this.logout();
    }
  },

  setLoading(loading) {
    state.isLoading = loading;
  }
};

// Charger l'utilisateur au démarrage
authStore.loadUserFromStorage();

