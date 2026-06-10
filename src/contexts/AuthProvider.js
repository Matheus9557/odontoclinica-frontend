import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { AuthContext } from "./authContext";
import { socket } from "@/services/socket";
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        if (savedToken && savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setToken(savedToken);
            setUser(parsedUser);
            api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
            // 🔌 Conecta socket ao recarregar sessão
            socket.connect();
            socket.emit("join", {
                userId: parsedUser.id,
                role: parsedUser.role,
            });
        }
    }, []);
    async function login(email, password, role) {
        const res = await api.post("/auth/login", {
            email,
            password,
            role,
        });
        const loggedUser = {
            id: res.data.user.id,
            name: res.data.user.name,
            email: res.data.user.email,
            role: res.data.role,
            avatarUrl: res.data.user.avatar ?? null,
        };
        setToken(res.data.token);
        setUser(loggedUser);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        // 🔌 SOCKET LOGIN
        socket.connect();
        socket.emit("join", {
            userId: loggedUser.id,
            role: loggedUser.role,
        });
    }
    function logout() {
        socket.disconnect();
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete api.defaults.headers.common["Authorization"];
    }
    function updateUser(updated) {
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
    }
    return (_jsx(AuthContext.Provider, { value: { user, token, login, logout, updateUser }, children: children }));
}
