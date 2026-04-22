import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resourceApi } from '../../api/resourceApi';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Building2, Users, MapPin, Clock } from 'lucide-react';

export const ResourcesPage = () => {
  const [filters, setFilters] = useState({ type: '', location: '', status: '', capacity: '' });
  const { isAdmin } = useAuth();

  const { data: resources } = useQuery({
    queryKey: ['resources', filters],
    queryFn: () => resourceApi.getAll(filters).then(res => res.data),
  });

  return (
    <div>
      <PageHeader
        title="Resources"
        description="Browse and manage campus facilities and assets"
        action={isAdmin}
        actionText="Add Resource"
        onAction={() => {}}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="LECTURE_HALL">Lecture Hall</SelectItem>
            <SelectItem value="LAB">Lab</SelectItem>
            <SelectItem value="MEETING_ROOM">Meeting Room</SelectItem>
            <SelectItem value="PROJECTOR">Projector</SelectItem>
            <SelectItem value="CAMERA">Camera</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />

        <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Min capacity"
          value={filters.capacity}
          onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resources?.data?.map((resource) => (
          <Card key={resource.id}>
            <CardHeader>
              <CardTitle className="text-lg">{resource.name}</CardTitle>
              <Badge variant={resource.status === 'ACTIVE' ? 'default' : 'destructive'}>
                {resource.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{resource.type.toLowerCase().replace('_', ' ')}</span>
                </div>
                {resource.capacity && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Capacity: {resource.capacity}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{resource.location}</span>
                </div>
                {resource.availabilityStart && resource.availabilityEnd && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {resource.availabilityStart} - {resource.availabilityEnd}
                    </span>
                  </div>
                )}
              </div>
              <Link to={`/resources/${resource.id}`}>
                <Button className="mt-4 w-full" variant="outline">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {resources?.data?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No resources found matching your filters
        </div>
      )}
    </div>
  );
};
