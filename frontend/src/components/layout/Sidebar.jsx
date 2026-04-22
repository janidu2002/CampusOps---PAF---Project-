import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Calendar, 
  Ticket, 
  Bell, 
  Users, 
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Resources', href: '/resources', icon: Building2 },
  { name: 'Bookings', href: '/bookings', icon: Calendar },
  { name: 'My Tickets', href: '/tickets', icon: Ticket },
  { name: 'Notifications', href: '/notifications', icon: Bell },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const filteredNavigation = isAdmin 
    ? [...navigation, { name: 'Admin', href: '/admin/users', icon: Users }]
    : navigation;

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center justify-center border-b border-border">
        <h1 className={`text-xl font-bold text-primary ${collapsed ? 'hidden' : 'block'}`}>
          Smart Campus
        </h1>
        {collapsed && <span className="text-xl font-bold text-primary">SC</span>}
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Button
          onClick={logout}
          variant="ghost"
          className={`w-full justify-start ${collapsed ? 'px-2' : ''}`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-border transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 hidden rounded-full bg-primary p-1 text-primary-foreground md:block"
        >
          {collapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="absolute left-4 top-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};
