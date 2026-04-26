import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../../api/bookingApi';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Check, X, Clock } from 'lucide-react';

export const BookingsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, user } = useAuth();
  const [activeTab, setActiveTab] = useState(isAdmin ? 'all' : 'my');
  const [filters, setFilters] = useState({ status: '', date: '', resourceId: '' });

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', activeTab, filters],
    queryFn: () => bookingApi.getAll({
      userId: activeTab === 'my' ? user?.id : undefined,
      ...filters,
    }).then(res => res.data),
  });

  const { data: pendingBookings } = useQuery({
    queryKey: ['bookings', 'pending'],
    queryFn: () => bookingApi.getAll({ status: 'PENDING' }).then(res => res.data),
    enabled: isAdmin,
  });

  const approveMutation = useMutation({
    mutationFn: (id) => bookingApi.approve(id, ''),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      toast.success('Booking approved successfully');
    },
    onError: () => {
      toast.error('Failed to approve booking');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => bookingApi.reject(id, 'Rejected by admin'),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      toast.success('Booking rejected successfully');
    },
    onError: () => {
      toast.error('Failed to reject booking');
    },
  });

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="Manage resource bookings and requests"
        action
        actionText="New Booking"
        onAction={() => navigate('/bookings/new')}
      />

      {isAdmin && pendingBookings?.data?.content?.length > 0 && (
        <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Pending Approvals ({pendingBookings.data.content.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingBookings.data.content.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium">{booking.resourceName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(booking.bookingDate), 'MMM dd, yyyy')} • {booking.startTime} - {booking.endTime}
                    </p>
                    <p className="text-sm text-muted-foreground">By: {booking.userName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate(booking.id)}
                      disabled={approveMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectMutation.mutate(booking.id)}
                      disabled={rejectMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Link to={`/bookings/${booking.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="my">My Bookings</TabsTrigger>
          {isAdmin && <TabsTrigger value="all">All Bookings</TabsTrigger>}
        </TabsList>
      </Tabs>

      <div className="mb-6 flex gap-4">
        <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : bookings?.data?.content?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.data.content.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.resourceName}</TableCell>
                    <TableCell>{format(new Date(booking.bookingDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      {booking.startTime} - {booking.endTime}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} type="booking" />
                    </TableCell>
                    <TableCell>
                      <Link to={`/bookings/${booking.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No bookings found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

