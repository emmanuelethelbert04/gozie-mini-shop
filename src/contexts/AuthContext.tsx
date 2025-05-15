
import React, { createContext, useState, useEffect, useContext } from "react";
import { 
  User,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { auth, database } from "@/lib/firebase";
import { toast } from "sonner";

interface AuthContextProps {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function register(email: string, password: string, name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store additional user info in the database
      await set(ref(database, `users/${user.uid}`), {
        name,
        email,
        role: "customer",
        createdAt: new Date().toISOString()
      });
      
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create an account");
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to log in");
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Check if user is admin
        try {
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setIsAdmin(userData.email === "admin@gmail.com" || userData.role === "admin");
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
