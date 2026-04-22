import { Bell, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useNotifications';
import { Link } from 'react-router-dom';

export const TopBar = () => {
  const { user } = useAuth();
  const { data: unreadCount } = useUnreadCount();

  const initials = user?.name
    ?.split(' ')
    ?.map((n) => n[0])
    ?.join('')
    ?.toUpperCase() || 'U';

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Smart Campus Operations Hub
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount && unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline-block text-sm font-medium">
                {user?.name}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/notifications">Notifications</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/bookings">My Bookings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/tickets">My Tickets</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
