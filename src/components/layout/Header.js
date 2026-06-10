import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/contexts/useNotification";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger, } from "@/components/ui/menubar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
export function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { unreadCount, reset } = useNotification();
    function handleLogout() {
        logout();
        navigate("/login");
    }
    async function handleOpenMessages() {
        await reset();
        navigate("/messages");
    }
    return (_jsx("header", { className: "relative z-50 w-full bg-[#F8F8F8] border-b shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto flex items-center justify-between px-6 py-3", children: [_jsx(Link, { to: "/", className: "text-3xl font-bold text-[#5067AA]", children: "OralSync" }), _jsxs(Menubar, { className: "bg-transparent border-none shadow-none", children: [_jsxs(MenubarMenu, { children: [_jsx(MenubarTrigger, { className: "text-[#5067AA] text-lg font-medium", children: "Cadastros" }), _jsxs(MenubarContent, { className: "z-[100] bg-white shadow-md border rounded-md", children: [_jsx(MenubarItem, { asChild: true, className: "text-base", children: _jsx(Link, { to: "/signup-dentist", children: "Cadastrar Dentista" }) }), _jsx(MenubarItem, { asChild: true, className: "text-base", children: _jsx(Link, { to: "/signup-patient", children: "Cadastrar Paciente" }) })] })] }), _jsxs(MenubarMenu, { children: [_jsx(MenubarTrigger, { className: "text-[#5067AA] text-lg font-medium", children: "Dashboards" }), _jsxs(MenubarContent, { className: "z-[100] bg-white shadow-md border rounded-md", children: [_jsx(MenubarItem, { asChild: true, className: "text-base", children: _jsx(Link, { to: "/dashboard-dentist", children: "Dashboard Dentista" }) }), _jsx(MenubarItem, { asChild: true, className: "text-base", children: _jsx(Link, { to: "/daily-form", children: "Formul\u00E1rio Paciente" }) })] })] })] }), user && (_jsxs(DropdownMenu, { children: [_jsxs(DropdownMenuTrigger, { className: "relative flex items-center gap-3 cursor-pointer outline-none", children: [_jsxs("div", { className: "relative", children: [_jsxs(Avatar, { className: "h-9 w-9", children: [_jsx(AvatarImage, { src: user.avatarUrl || "/avatars/avatar.png", alt: user.name }), _jsx(AvatarFallback, { children: user.name[0].toUpperCase() })] }), unreadCount > 0 && (_jsx(Badge, { className: "absolute -top-1 -right-2 text-xs px-1.5 py-0.5 rounded-full bg-[#86A6DE] text-white shadow", children: unreadCount }))] }), _jsx("span", { className: "hidden sm:block text-base font-medium text-[#5067AA]", children: user.name })] }), _jsxs(DropdownMenuContent, { className: "z-[200] bg-white border shadow-md", children: [_jsx(DropdownMenuItem, { asChild: true, className: "text-base", children: _jsx(Link, { to: "/profile", children: "Perfil" }) }), _jsx(DropdownMenuItem, { onClick: handleOpenMessages, className: "text-base", children: "Mensagens" }), _jsx(DropdownMenuItem, { onClick: handleLogout, className: "text-base text-red-600 focus:text-red-600", children: "Sair" })] })] }))] }) }));
}
