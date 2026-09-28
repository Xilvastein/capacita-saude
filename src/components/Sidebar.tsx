import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  roles?: ('funcionario' | 'gestor')[];
}

interface SidebarProps {
  items: NavItem[];
  activePath: string;
  collapsed: boolean;
  onNavigate: () => void;
}

export function Sidebar({ items, activePath, collapsed, onNavigate }: SidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex flex-col border-r bg-card transition-all duration-300',
          collapsed ? 'w-[68px]' : 'w-64'
        )}
      >
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-4">
          <ul className="space-y-1">
            {items.map((item) => {
              const isActive =
                activePath === item.path ||
                (item.path !== '/' && activePath.startsWith(item.path));
              const Icon = item.icon;
              const link = (
                <Link
                  to={item.path}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive && 'bg-primary/10 text-primary font-semibold',
                    !isActive && 'text-muted-foreground',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {isActive && !collapsed && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
              return (
                <li key={item.path}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    link
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        {!collapsed && (
          <div className="border-t p-3">
            <div className="rounded-lg bg-accent/50 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Protótipo demonstrativo</p>
              <p className="mt-1">Dados simulados para apresentação. Não utilizar em ambiente de produção sem validação.</p>
            </div>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
