import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  HelpCircle,
  Menu,
  PanelLeftClose,
  PanelLeft,
  Play,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '@/hooks/use-app';
import { useGuidedDemo } from '@/hooks/use-guided-demo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Logo } from '@/components/Logo';
import { Sidebar, type NavItem } from '@/components/Sidebar';
import { HelpDialog } from '@/components/HelpDialog';
import { DemoBanner } from '@/components/DemoBanner';

import {
  LayoutDashboard,
  Microscope,
  GraduationCap,
  QrCode,
  Lightbulb,
  BarChart3,
  FilePlus2,
  Upload,
  Workflow,
  Info,
  UserCircle,
} from 'lucide-react';

const navItems: NavItem[] = [
  { label: 'Visão Geral', icon: LayoutDashboard, path: '/dashboard', roles: ['gestor'] },
  { label: 'Minha Área', icon: UserCircle, path: '/minha-area', roles: ['funcionario'] },
  { label: 'Equipamentos', icon: Microscope, path: '/equipamentos' },
  { label: 'Treinamentos', icon: GraduationCap, path: '/treinamentos' },
  { label: 'Leitor de QR Code', icon: QrCode, path: '/qr-code' },
  { label: 'Necessidades de Capacitação', icon: Lightbulb, path: '/necessidades', roles: ['gestor'] },
  { label: 'Indicadores', icon: BarChart3, path: '/indicadores', roles: ['gestor'] },
  { label: 'Cadastrar Equipamento', icon: FilePlus2, path: '/equipamentos/novo', roles: ['gestor'] },
  { label: 'Importar Dados', icon: Upload, path: '/importar', roles: ['gestor'] },
  { label: 'Metodologia', icon: Workflow, path: '/metodologia' },
  { label: 'Sobre o Projeto', icon: Info, path: '/sobre' },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout, switchRole, notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useApp();
  const demo = useGuidedDemo();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  if (!user) return null;

  const filteredItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user.role)
  );

  const handleLogout = () => {
    demo.stopDemo();
    logout();
    navigate('/login');
  };

  const roleLabel = user.role === 'gestor' ? 'Gestor' : 'Funcionário';
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          items={filteredItems}
          activePath={location.pathname}
          collapsed={collapsed}
          onNavigate={() => {}}
        />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>
              <Logo size="sm" />
            </SheetTitle>
          </SheetHeader>
          <Sidebar
            items={filteredItems}
            activePath={location.pathname}
            collapsed={false}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center gap-2 border-b bg-card px-4 lg:px-6">
          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop collapse toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </Button>

          <div className="flex items-center gap-2 lg:hidden">
            <Logo showText={false} size="sm" />
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {/* Guided demo */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (demo.active) demo.stopDemo();
                      else demo.startDemo();
                    }}
                    className="gap-1.5"
                  >
                    <Play className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {demo.active ? 'Parar demo' : 'Demonstração'}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Iniciar demonstração guiada</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Role switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <span className="hidden sm:inline">{roleLabel}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Alternar perfil</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    switchRole('funcionario');
                    navigate('/minha-area');
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Funcionário
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    switchRole('gestor');
                    navigate('/dashboard');
                  }}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Gestor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2">
                  <span className="text-sm font-semibold">Notificações</span>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllNotificationsRead} className="h-7 text-xs">
                      Marcar todas como lidas
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Nenhuma notificação
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <DropdownMenuItem
                      key={n.id}
                      className="flex flex-col items-start gap-1 p-3"
                      onClick={() => markNotificationRead(n.id)}
                    >
                      <div className="flex w-full items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            n.type === 'warning'
                              ? 'bg-warning'
                              : n.type === 'success'
                              ? 'bg-success'
                              : 'bg-primary'
                          }`}
                        />
                        <span className="text-sm font-medium">{n.title}</span>
                        {!n.read && <Badge variant="secondary" className="ml-auto text-[10px]">Nova</Badge>}
                      </div>
                      <span className="text-xs text-muted-foreground">{n.message}</span>
                      <span className="text-[10px] text-muted-foreground">{n.date}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help */}
            <Button variant="ghost" size="icon" onClick={() => setHelpOpen(true)}>
              <HelpCircle className="h-5 w-5" />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-accent transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col text-left leading-none">
                    <span className="text-xs font-semibold">{user.name}</span>
                    <span className="text-[10px] text-muted-foreground">{roleLabel}</span>
                  </div>
                  <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair da demonstração
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Demo banner */}
        {demo.active && <DemoBanner />}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>

      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}
