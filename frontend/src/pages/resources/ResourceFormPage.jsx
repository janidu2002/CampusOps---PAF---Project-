import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export const ResourceFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    location: '',
    availabilityStart: '',
    availabilityEnd: '',
    status: 'ACTIVE',
    description: '',
  });

  const { data: existingResource } = useQuery({
    queryKey: ['resource', id],
    queryFn: () => resourceApi.getById(id).then(res => res.data.data),
    enabled: isEdit,
    onSuccess: (data) => {
      setFormData({
        name: data.name || '',
        type: data.type || '',
        capacity: data.capacity || '',
        location: data.location || '',
        availabilityStart: data.availabilityStart || '',
        availabilityEnd: data.availabilityEnd || '',
        status: data.status || 'ACTIVE',
        description: data.description || '',
      });
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? resourceApi.update(id, data) : resourceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['resources']);
      toast.success(isEdit ? 'Resource updated successfully' : 'Resource created successfully');
      navigate('/resources');
    },
    onError: () => {
      toast.error(isEdit ? 'Failed to update resource' : 'Failed to create resource');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
    });
  };

  return (
    <div>
      <Link to="/resources">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Resource' : 'Add New Resource'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Resource Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LECTURE_HALL">Lecture Hall</SelectItem>
                  <SelectItem value="LAB">Lab</SelectItem>
                  <SelectItem value="MEETING_ROOM">Meeting Room</SelectItem>
                  <SelectItem value="PROJECTOR">Projector</SelectItem>
                  <SelectItem value="CAMERA">Camera</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="availabilityStart">Availability Start</Label>
                <Input
                  id="availabilityStart"
                  type="time"
                  value={formData.availabilityStart}
                  onChange={(e) => setFormData({ ...formData, availabilityStart: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="availabilityEnd">Availability End</Label>
                <Input
                  id="availabilityEnd"
                  type="time"
                  value={formData.availabilityEnd}
                  onChange={(e) => setFormData({ ...formData, availabilityEnd: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating...' : 'Create Resource'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/resources')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
