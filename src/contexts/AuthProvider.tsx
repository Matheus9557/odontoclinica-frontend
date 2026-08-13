import {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import { api } from "@/services/api";

import {
  AuthContext,
  type User,
  type UserRole,
} from "./authContext";

import {
  connectSocket,
  disconnectSocket,
} from "@/services/socket";

interface LoginResponse {
  token: string;
  role: UserRole;

  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
}

interface DentistProfileResponse {
  id: string;
  name: string;
  email: string;
  cro: string;
  avatar: string | null;

  patients: Array<{
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  }>;
}

interface PatientProfileResponse {
  id: string;
  name: string;
  email: string;
  dentistId: string;
  avatar: string | null;
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const setAuthorizationHeader = useCallback(
    (authToken: string) => {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${authToken}`;
    },
    []
  );

  const clearSession = useCallback(() => {
    disconnectSocket();

    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete api.defaults.headers.common[
      "Authorization"
    ];
  }, []);

  const persistSession = useCallback(
    (
      authToken: string,
      authUser: User
    ) => {
      setToken(authToken);
      setUser(authUser);

      localStorage.setItem(
        "token",
        authToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(authUser)
      );

      setAuthorizationHeader(authToken);
    },
    [setAuthorizationHeader]
  );

  const restoreSession = useCallback(
    async () => {
      const savedToken =
        localStorage.getItem("token");

      const savedUser =
        localStorage.getItem("user");

      if (!savedToken || !savedUser) {
        setIsLoading(false);
        return;
      }

      try {
        const parsedUser =
          JSON.parse(savedUser) as User;

        /*
         * Primeiro configura o token no Axios.
         * Assim /dentists/me ou /patients/me
         * será chamado com Authorization: Bearer <token>.
         */
        setAuthorizationHeader(savedToken);

        let restoredUser: User;

        if (parsedUser.role === "dentist") {
          const response =
            await api.get<DentistProfileResponse>(
              "/dentists/me"
            );

          restoredUser = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            role: "dentist",
            avatarUrl:
              response.data.avatar ?? null,
          };
        } else {
          const response =
            await api.get<PatientProfileResponse>(
              "/patients/me"
            );

          restoredUser = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            role: "patient",
            avatarUrl:
              response.data.avatar ?? null,
          };
        }

        /*
         * O backend é a fonte de verdade
         * para os dados atuais do usuário.
         */
        persistSession(
          savedToken,
          restoredUser
        );

        connectSocket(
          savedToken,
          restoredUser
        );
      } catch {
        /*
         * Token inválido, expirado ou usuário
         * inexistente: encerra a sessão local.
         */
        clearSession();
      } finally {
        setIsLoading(false);
      }
    },
    [
      clearSession,
      persistSession,
      setAuthorizationHeader,
    ]
  );

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  async function login(
    email: string,
    password: string,
    role: UserRole
  ) {
    const response =
      await api.post<LoginResponse>(
        "/auth/login",
        {
          email,
          password,
          role,
        }
      );

    const loggedUser: User = {
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
      role: response.data.role,
      avatarUrl:
        response.data.user.avatar ?? null,
    };

    persistSession(
      response.data.token,
      loggedUser
    );

    connectSocket(
      response.data.token,
      loggedUser
    );
  }

  function logout() {
    clearSession();
  }

  function updateUser(
    updatedUser: User
  ) {
    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}