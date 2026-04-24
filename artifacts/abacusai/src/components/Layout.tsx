import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, Settings, CreditCard, Users, BookOpen, BarChart3, Medal, GraduationCap } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return <>{children}</>;

  const getNavItems = () => {
    switch (user.role) {
      case 'STUDENT':
        return [
          { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
          { href: '/progress', label: 'My Progress', icon: BarChart3 },
          { href: '/leaderboard', label: 'Leaderboard', icon: Medal },
        ];
      case 'PARENT':
        return [
          { href: '/parent', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/subscription', label: 'Billing', icon: CreditCard },
        ];
      case 'TEACHER':
        return [
          { href: '/teacher', label: 'Classes', icon: Users },
          { href: '/progress', label: 'Reports', icon: BarChart3 },
        ];
      case 'ADMIN':
        return [
          { href: '/admin', label: 'Overview', icon: LayoutDashboard },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-primary">AbacusAI</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-secondary/20 hover:text-foreground'}`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full p-2 hover:bg-secondary/20 rounded-xl transition-colors">
                <Avatar>
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-bold truncate max-w-[120px]">{user.name}</span>
                  <span className="text-muted-foreground text-xs">{user.role}</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-6 md:p-8 flex-1 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
