import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../../api/bookingApi';
import { resourceApi } from '../../api/resourceApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const NewBookingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    resourceId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
  });

  const { data: resources } = useQuery({
    queryKey: ['resources'],
    queryFn: () => resourceApi.getAll({ status: 'ACTIVE' }).then(res => res.data),
  });

  const mutation = useMutation({
    mutationFn: (data) => bookingApi.create(data),
    onSuccess: (response) => {
      console.log('Booking creation success:', response);
      queryClient.invalidateQueries(['bookings']);
      toast.success('Booking request submitted successfully');
      navigate('/bookings');
    },
    onError: (error) => {
      console.error('Booking creation error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      toast.error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to create booking');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      resourceId: formData.resourceId ? parseInt(formData.resourceId) : null,
      expectedAttendees: formData.expectedAttendees ? parseInt(formData.expectedAttendees) : null,
    });
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
          <CardTitle>New Booking Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="resourceId">Resource</Label>
              <Select value={formData.resourceId} onValueChange={(v) => setFormData({ ...formData, resourceId: v })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a resource" />
                </SelectTrigger>
                <SelectContent>
                  {resources?.data?.content?.map((resource) => (
                    <SelectItem key={resource.id} value={String(resource.id)}>
                      {resource.name} - {resource.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bookingDate">Date</Label>
              <Input
                id="bookingDate"
                type="date"
                value={formData.bookingDate}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="expectedAttendees">Expected Attendees (Optional)</Label>
              <Input
                id="expectedAttendees"
                type="number"
                value={formData.expectedAttendees}
                onChange={(e) => setFormData({ ...formData, expectedAttendees: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/bookings')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
