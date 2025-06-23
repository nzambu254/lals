import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase';
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  
  // State
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const isAuthenticated = computed(() => user.value !== null);
  const currentUserEmail = computed(() => user.value?.email || '');
  const isAdmin = computed(() => currentUserEmail.value === 'alvn4407@gmail.com');

  // Actions
  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
      
      // Redirect based on role
      if (isAdmin.value) {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
      return true;
    } catch (err) {
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      user.value = null;
      router.push('/login');
    } catch (err) {
      error.value = err.message;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      error.value = err.message;
      return false;
    }
  };

  // Initialize auth state listener
  const init = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser;
        resolve();
      });
    });
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    currentUserEmail,
    isAdmin,
    login,
    logout,
    resetPassword,
    init
  };
});