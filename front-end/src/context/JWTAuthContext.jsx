import {createContext, useEffect, useReducer} from 'react'
import {setSession, resetSession} from '../utils/session'
import axiosInstance from '../services/axios'
import {validateToken} from  '../utils/jwt'
import Cookies from "js-cookie";

const initialState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
  };
  
  export const AuthContext = createContext({
    ...initialState,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    setUser: () => Promise.resolve(),
  });
  
  const handlers = {
    INITIALIZE: (state, action) => {
      const { isAuthenticated, user } = action.payload;
  
      return {
        ...state,
        isAuthenticated,
        isInitialized: true,
        user,
      };
    },
    LOGIN: (state, action) => {
      const { user } = action.payload;
  
      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    },
    LOGOUT: (state) => {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    },
  };
  
  const reducer = (state, action) =>
    handlers[action.type] ? handlers[action.type](state, action) : state;
  
  export const AuthProvider = (props) => {
    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initialState);
    
  
    useEffect(() => {
      const initialize = async () => {
        try {
          const accessToken = Cookies.get("accessToken");
          if (accessToken && validateToken(accessToken)) {
            setSession(accessToken); // Ensure Axios headers are set here
    
            // Fetch the user details from the backend
            const response = await axiosInstance.get("/user/me");
            const { data: user } = response;
    
            // Update the authentication state
            dispatch({
              type: "INITIALIZE",
              payload: {
                isAuthenticated: true,
                user,
              },
            });
          } else {
            // If no valid token, reset session
            dispatch({
              type: "INITIALIZE",
              payload: {
                isAuthenticated: false,
                user: null,
              },
            });
          }
        } catch (error) {
          console.error("Error during auth initialization:", error);
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      };
    
      initialize();
    }, []);
    
  
    const getTokens = async (email, password) => {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);
      try {
        const response = await axiosInstance.post("/auth/login", formData);
        setSession(response.data.access_token, response.data.refresh_token);
      } catch (error) {
        throw error;
      }
    };
  
    const login = async (email, password) => {
      try {
        await getTokens(email, password);
        const response = await axiosInstance.get("/user/me");
        const { data: user } = response;
        dispatch({
          type: "LOGIN",
          payload: {
            user,
          },
        });
      } catch (err) {
        return Promise.reject(err);
      }
    };
  
    const logout = () => {
      resetSession();
      dispatch({ type: "LOGOUT" });
    };
  
    const setUser = (user) => {
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    };
  
    return (
      <AuthContext.Provider
        value={{
          ...state,
          login,
          logout,
          setUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const AuthConsumer = AuthContext.Consumer;