import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '../../hooks/useNotifications';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export const NotificationsPage = () => {
  const { data: notifications, isLoading } = useNotifications({ page: 0, size: 50 });
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const handleMarkAsRead = (id) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id) => {
    deleteNotification.mutate(id);
    toast.success('Notification deleted');
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const notificationList = notifications?.data?.content || [];

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="View and manage your notifications"
      />

      {notificationList.length > 0 && (
        <div className="mb-4">
          <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Notification List</CardTitle>
        </CardHeader>
        <CardContent>
          {notificationList.length > 0 ? (
            <div className="space-y-4">
              {notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.isRead
                      ? 'bg-muted/30 border-border'
                      : 'bg-primary/10 border-primary/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                        <h3 className="font-semibold">{notification.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(notification.createdAt), 'MMMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notification.isRead && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={markAsRead.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(notification.id)}
                        disabled={deleteNotification.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
