import apiClient from './api';
import { authStore } from '../stores/authStore';

export const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(userData) {
    try {
      authStore.setLoading(true);
      const response = await apiClient.post('/users/signup', userData);
      return {
        success: true,
        user: response.data.data,
        message: response.data.message || 'Inscription réussie'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'inscription'
      };
    } finally {
      authStore.setLoading(false);
    }
  },

  /**
   * Connexion d'un utilisateur
   */
  async login(email, password) {
    try {
      authStore.setLoading(true);
      
      const response = await apiClient.post('/users/login', {
        email,
        password
      });
      
      console.log('Réponse login:', response.data);
      
      if (response.data.success) {
        const user = response.data.user;
        const token = response.data.token;
        
        console.log('Token reçu:', token);
        
        // Sauvegarder le token
        localStorage.setItem('token', token);
        
        console.log('Token sauvegardé dans localStorage:', localStorage.getItem('token'));
        
        // Sauvegarder l'utilisateur
        authStore.setUser(user);
        
        return {
          success: true,
          user: user,
          token: token,
          message: response.data.message || `Bienvenue ${user.username} !`
        };
      } else {
        console.error('Login échoué:', response.data);
        return {
          success: false,
          message: response.data.message || 'Erreur lors de la connexion'
        };
      }
    } catch (error) {
      console.error('Erreur login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la connexion'
      };
    } finally {
      authStore.setLoading(false);
    }
  },

  /**
   * Déconnexion
   */
  logout() {
    authStore.logout();
    localStorage.removeItem('token');
    return {
      success: true,
      message: 'Déconnexion réussie'
    };
  },

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated() {
    return authStore.state.isAuthenticated;
  },

  /**
   * Obtenir l'utilisateur actuel
   */
  getCurrentUser() {
    return authStore.state.currentUser;
  },

  /**
   * Obtenir le token JWT
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(userId, userData) {
    try {
      authStore.setLoading(true);
      const token = this.getToken();
      
      const response = await apiClient.put(`/users/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Mettre à jour l'utilisateur dans le store
      authStore.setUser(response.data.data || response.data);
      
      return {
        success: true,
        user: response.data.data || response.data,
        message: 'Profil mis à jour'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la mise à jour'
      };
    } finally {
      authStore.setLoading(false);
    }
  }
};

