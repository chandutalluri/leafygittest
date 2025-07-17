import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem('leafyhealth-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Create a guest user by default
      const guestUser = {
        id: 'guest-' + Date.now(),
        email: 'guest@leafyhealth.com',
        name: 'Guest User',
        role: 'customer'
      };
      setUser(guestUser);
      localStorage.setItem('leafyhealth-user', JSON.stringify(guestUser));
    }
    setIsLoading(false);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
