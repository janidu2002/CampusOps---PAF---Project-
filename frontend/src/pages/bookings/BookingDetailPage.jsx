import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../../api/bookingApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeft, Check, X, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

export const BookingDetailPage = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.getById(id).then(res => res.data.data),
    enabled: !!id,
  });

  const approveMutation = useMutation({
    mutationFn: () => bookingApi.approve(id, ''),
    onSuccess: () => {
      queryClient.invalidateQueries(['booking', id]);
      queryClient.invalidateQueries(['bookings']);
      toast.success('Booking approved successfully');
    },
    onError: () => {
      toast.error('Failed to approve booking');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => bookingApi.reject(id, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries(['booking', id]);
      queryClient.invalidateQueries(['bookings']);
      setRejectDialogOpen(false);
      toast.success('Booking rejected successfully');
    },
    onError: () => {
      toast.error('Failed to reject booking');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => bookingApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['booking', id]);
      queryClient.invalidateQueries(['bookings']);
      toast.success('Booking cancelled successfully');
    },
    onError: () => {
      toast.error('Failed to cancel booking');
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!booking) {
    return <div className="text-center py-12">Booking not found</div>;
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    rejectMutation.mutate();
  };

  return (
    <div>
      <Link to="/bookings">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{booking.resourceName}</CardTitle>
              <StatusBadge status={booking.status} type="booking" className="mt-2" />
            </div>
            {booking.status === 'PENDING' && (
              <div className="flex gap-2">
                {isAdmin ? (
                  <>
                    <Button onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending}>
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button variant="destructive" onClick={() => setRejectDialogOpen(true)}>
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{format(new Date(booking.bookingDate), 'MMMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">{booking.startTime} - {booking.endTime}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Booked By</p>
              <p className="font-medium">{booking.userName}</p>
            </div>
            {booking.expectedAttendees && (
              <div>
                <p className="text-sm text-muted-foreground">Expected Attendees</p>
                <p className="font-medium">{booking.expectedAttendees}</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Purpose</p>
            <p className="font-medium">{booking.purpose}</p>
          </div>

          {booking.adminNote && (
            <div>
              <p className="text-sm text-muted-foreground">Admin Note</p>
              <p className="font-medium">{booking.adminNote}</p>
            </div>
          )}

          {booking.reviewedByName && (
            <div>
              <p className="text-sm text-muted-foreground">Reviewed By</p>
              <p className="font-medium">{booking.reviewedByName}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <ConfirmDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        title="Reject Booking"
        description="Please provide a reason for rejecting this booking request."
        onConfirm={handleReject}
        confirmText="Reject"
      >
        <Textarea
          placeholder="Enter rejection reason..."
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          className="mb-4"
        />
      </ConfirmDialog>
    </div>
  );
};
