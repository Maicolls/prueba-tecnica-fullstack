//Client for Better Auth
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
});

export const { 
  signIn, // This login function
  signOut,  // This logout function
  signUp, // This register function
  useSession // To get user data
} = authClient;
