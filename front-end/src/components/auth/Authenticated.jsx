import React, { useEffect, useState } from 'react'
import {useAuth} from '../../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom';

export const Authenticated = (props) => {
    const { children } = props;
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isVerified, setIsVerified] = useState(false);
  

    useEffect(() => {
      if (auth.isInitialized) {
        if (!auth.isAuthenticated) {
          navigate("/", { replace: true, state: { from: location } });
        } else {
          setIsVerified(true);
        }
      }
    }, [auth.isAuthenticated, auth.isInitialized, location, navigate]);
    
    if (!auth.isInitialized || !isVerified) {
      return null; // Or show a loading spinner
    }
    
    return <>{children}</>;    
  };
