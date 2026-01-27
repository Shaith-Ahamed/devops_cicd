
import { createContext, useContext, useState, useEffect } from 'react';
import http from '../services/http'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  


  useEffect(() => {

    const hasCleared = sessionStorage.getItem('cleared');
    if (!hasCleared) {
      localStorage.clear();
      sessionStorage.setItem('cleared', 'true');
    }
    
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        
        if (parsedUser && parsedUser.userId && parsedUser.email) {
          setCurrentUser(parsedUser);
        } else {
          
          localStorage.removeItem('user');
          setCurrentUser(null);
        }
      } catch (error) {
        
        localStorage.removeItem('user');
        setCurrentUser(null);
      }
    }
    setLoading(false);
  }, []);



 
  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);

      
      const { data: users } = await http.get('/users/getAllUsers');

   
      const user = (users || []).find(
        (u) => u?.email?.toLowerCase() === email.toLowerCase() && u?.password === password
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError('Failed to log in: ' + msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  
  const register = async (name, email, password) => {
    try {
      setError('');
      setLoading(true);

      const [firstName, ...rest] = (name || '').trim().split(' ');
      const lastName = rest.join(' ');

      const { data } = await http.post('/users/addUser', {
        firstName: firstName || name || '',
        lastName: lastName || '',
        email,
        password,
      });

      return data; 
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError('Failed to register: ' + msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  
  const value = { currentUser,login, register, logout, loading, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



export const useAuth = () => useContext(AuthContext);
export default AuthContext;
