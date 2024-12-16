import { jwtDecode } from "jwt-decode";

export const validateToken = (token) => {
    if (!token) return false; // If there's no token, it's invalid.
    
    try {
        const now = Math.round(new Date().getTime() / 1000); // Get current time in seconds
        const decodedToken = jwtDecode(token); // Decode the JWT token
        
        // Ensure the token has an expiration field and check expiration
        if (decodedToken && decodedToken.exp) {
            const isValid = now < decodedToken.exp; // Check if token is valid (expiration check)
            return isValid;
        } else {
            return false; // If there's no expiration in the token, it's invalid
        }
    } catch (e) {
        // If decoding fails (e.g., invalid JWT), treat it as invalid
        return false;
    }
};
