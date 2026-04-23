import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '../../api/ticketApi';
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
import { AlertCircle } from 'lucide-react';

export const TicketsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, isTechnician, user } = useAuth();
  const [activeTab, setActiveTab] = useState((isAdmin || isTechnician) ? 'all' : 'my');
  const [filters, setFilters] = useState({ status: '', priority: '', category: '' });

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets', activeTab, filters],
    queryFn: () => ticketApi.getAll({
      userId: activeTab === 'my' ? user?.id : undefined,
      ...filters,
    }).then(res => res.data),
  });

  const { data: openTickets } = useQuery({
    queryKey: ['tickets', 'open'],
    queryFn: () => ticketApi.getAll({ status: 'OPEN' }).then(res => res.data),
    enabled: isAdmin || isTechnician,
  });

  return (
    <div>
      <PageHeader
        title="Tickets"
        description="Manage incident reports and support tickets"
        action
        actionText="New Ticket"
        onAction={() => navigate('/tickets/new')}
      />

      {(isAdmin || isTechnician) && openTickets?.data?.content?.length > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Open Tickets ({openTickets.data.content.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {openTickets.data.content.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium">{ticket.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.category} • {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">By: {ticket.reportedByName}</p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={ticket.priority} type="priority" />
                    <Link to={`/tickets/${ticket.id}`}>
                      <Button size="sm" variant="outline">
                        View & Assign
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
          <TabsTrigger value="my">My Tickets</TabsTrigger>
          {(isAdmin || isTechnician) && <TabsTrigger value="all">All Tickets</TabsTrigger>}
        </TabsList>
      </Tabs>

      <div className="mb-6 flex gap-4">
        <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.priority} onValueChange={(v) => setFilters({ ...filters, priority: v })}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="CRITICAL">Critical</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Category</SelectItem>
            <SelectItem value="ELECTRICAL">Electrical</SelectItem>
            <SelectItem value="PLUMBING">Plumbing</SelectItem>
            <SelectItem value="IT_EQUIPMENT">IT Equipment</SelectItem>
            <SelectItem value="FURNITURE">Furniture</SelectItem>
            <SelectItem value="SAFETY">Safety</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : tickets?.data?.content?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.data.content.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>#{ticket.id}</TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.priority} type="priority" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status} type="ticket" />
                    </TableCell>
                    <TableCell>{format(new Date(ticket.createdAt), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <Link to={`/tickets/${ticket.id}`}>
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
              No tickets found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

