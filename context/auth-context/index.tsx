"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import {
  ReactNode,
  createContext,
  useEffect,
  useState,
  FormEvent,
  Dispatch,
  SetStateAction,
} from "react";

/* ──────────────────────────────
   Types
──────────────────────────────── */
interface User {
  _id: string;
  userName: string;
  userEmail: string;
  role: string;
}

interface AuthState {
  authenticate: boolean;
  user: User | null;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
  signInFormData: typeof initialSignInFormData;
  setSignInFormData: Dispatch<SetStateAction<typeof initialSignInFormData>>;
  signUpFormData: typeof initialSignUpFormData;
  setSignUpFormData: Dispatch<SetStateAction<typeof initialSignUpFormData>>;
  loading: boolean;
  handleRegisterUser: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleLoginUser: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  checkAuthUser: () => Promise<void>;
  resetCredentials: () => void;
}

/* ──────────────────────────────
   Context & Provider
──────────────────────────────── */
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState<AuthState>({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await registerService(signUpFormData);
    // You can handle success/error messages here
  }

  async function handleLoginUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await loginService(signInFormData);

    if (response.success) {
      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(response.data.accessToken)
      );
      setAuth({
        authenticate: true,
        user: response.data.user,
      });
    } else {
      setAuth({ authenticate: false, user: null });
    }
  }

  async function checkAuthUser() {
    try {
      const response = await checkAuthService();
      if (response?.data?.user) {
        setAuth({ authenticate: true, user: response.data.user });
      } else {
        setAuth({ authenticate: false, user: null });
      }
    } catch (error: any) {
      console.error(error);
      setAuth({ authenticate: false, user: null });
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    setAuth({ authenticate: false, user: null });
    sessionStorage.removeItem("accessToken");
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        loading,
        handleRegisterUser,
        handleLoginUser,
        checkAuthUser,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
