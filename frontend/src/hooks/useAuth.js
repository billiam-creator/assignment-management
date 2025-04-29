import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken')); // Initialize based on token presence
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true); 
      try {
        const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
        setUser({ id: decodedToken.user.id, role: decodedToken.user.role });
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true); 
    localStorage.setItem('authToken', newToken);
    console.log('Login successful in useAuth:', { token: newToken, user: userData, isAuthenticated: true }); // Debugging log
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false); 
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};