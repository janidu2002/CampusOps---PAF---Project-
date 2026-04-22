import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { resourceApi } from '../../api/resourceApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, MapPin, Clock, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const ResourceDetailPage = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: resource, isLoading } = useQuery({
    queryKey: ['resource', id],
    queryFn: () => resourceApi.getById(id).then(res => res.data.data),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => resourceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['resources']);
      toast.success('Resource deleted successfully');
      navigate('/resources');
    },
    onError: () => {
      toast.error('Failed to delete resource');
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!resource) {
    return <div className="text-center py-12">Resource not found</div>;
  }

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
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{resource.name}</CardTitle>
              <Badge variant={resource.status === 'ACTIVE' ? 'default' : 'destructive'} className="mt-2">
                {resource.status}
              </Badge>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <Link to={`/resources/${id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{resource.type.toLowerCase().replace('_', ' ')}</p>
              </div>
            </div>

            {resource.capacity && (
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-medium">{resource.capacity} people</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{resource.location}</p>
              </div>
            </div>

            {resource.availabilityStart && resource.availabilityEnd && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Available Hours</p>
                  <p className="font-medium">
                    {resource.availabilityStart} - {resource.availabilityEnd}
                  </p>
                </div>
              </div>
            )}
          </div>

          {resource.description && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-sm">{resource.description}</p>
            </div>
          )}

          <Link to="/bookings/new">
            <Button className="w-full md:w-auto">Book This Resource</Button>
          </Link>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{resource.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
