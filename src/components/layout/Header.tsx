import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/contexts/useNotification";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  return (
    <header className="relative z-50 w-full bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-bold text-primary"
        >
          OralSync
        </Link>

        {/* MENUS CENTRAIS */}
        <Menubar className="bg-transparent border-none shadow-none">
          <MenubarMenu>
            <MenubarTrigger className="text-foreground text-lg font-medium hover:text-primary">
              Cadastros
            </MenubarTrigger>

            <MenubarContent className="z-[100] bg-popover text-popover-foreground shadow-md border border-border rounded-md">
              <MenubarItem asChild className="text-base">
                <Link to="/signup-dentist">
                  Cadastrar Dentista
                </Link>
              </MenubarItem>

              <MenubarItem asChild className="text-base">
                <Link to="/signup-patient">
                  Cadastrar Paciente
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="text-foreground text-lg font-medium hover:text-primary">
              Dashboards
            </MenubarTrigger>

            <MenubarContent className="z-[100] bg-popover text-popover-foreground shadow-md border border-border rounded-md">
              <MenubarItem asChild className="text-base">
                <Link to="/dashboard-dentist">
                  Dashboard Dentista
                </Link>
              </MenubarItem>

              <MenubarItem asChild className="text-base">
                <Link to="/daily-form">
                  Formulário Paciente
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        {/* USUÁRIO */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex items-center gap-3 cursor-pointer outline-none">
              <div className="relative">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.avatarUrl || "/avatars/avatar.png"}
                    alt={user.name}
                  />

                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-2 text-xs px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground shadow">
                    {unreadCount}
                  </Badge>
                )}
              </div>

              <span className="hidden sm:block text-base font-medium text-foreground">
                {user.name}
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="z-[200] bg-popover text-popover-foreground border-border shadow-md">
              <DropdownMenuItem asChild className="text-base">
                <Link to="/profile">
                  Perfil
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleOpenMessages}
                className="text-base"
              >
                Mensagens
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-base text-destructive focus:text-destructive"
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

      </div>
    </header>
  );
}