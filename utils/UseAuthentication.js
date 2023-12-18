// useAuthentication.js
import { useState, useEffect } from 'react';
import { auth } from '../config/firebase'; 

const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsAuthenticated(false);

    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };



  //Riportare gli altri metodi utilizzati in EmailLoginScreen in modo
  //da gestire tutti i metodi di firebase quì dentro e da poterli utilizzare
  //ovunque all'interno della nostra app senza doverli sempre ridefinire.

  //I metodi sono stati segnati per il momento solo per la funzione
  //handleLogin successivamente faremo lo stesso con il metodo di registrazione.


  return { isAuthenticated, isLoading, handleLogout };
};


export default useAuthentication;
