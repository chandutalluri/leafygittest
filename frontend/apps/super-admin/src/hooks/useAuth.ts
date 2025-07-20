import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
};
