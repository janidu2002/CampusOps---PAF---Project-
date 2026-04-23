import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '../../api/ticketApi';
import { commentApi } from '../../api/commentApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export const TicketDetailPage = () => {
  const { id } = useParams();
  const { isAdmin, isTechnician, user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketApi.getById(id).then(res => res.data.data),
    enabled: !!id,
  });

  const commentMutation = useMutation({
    mutationFn: (content) => commentApi.add(id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket', id]);
      setNewComment('');
      toast.success('Comment added successfully');
    },
    onError: () => {
      toast.error('Failed to add comment');
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ status, notes }) => ticketApi.updateStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket', id]);
      queryClient.invalidateQueries(['tickets']);
      toast.success('Status updated successfully');
      setResolutionNotes('');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const assignMutation = useMutation({
    mutationFn: (technicianId) => ticketApi.assign(id, technicianId),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket', id]);
      queryClient.invalidateQueries(['tickets']);
      toast.success('Ticket assigned successfully');
    },
    onError: () => {
      toast.error('Failed to assign ticket');
    },
  });

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment);
  };

  const handleStatusUpdate = () => {
    if (!selectedStatus) return;
    statusMutation.mutate({ status: selectedStatus, notes: resolutionNotes });
  };

  const handleAssign = () => {
    if (!selectedTechnician) return;
    assignMutation.mutate(selectedTechnician);
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!ticket) {
    return <div className="text-center py-12">Ticket not found</div>;
  }

  return (
    <div>
      <Link to="/tickets">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tickets
        </Button>
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{ticket.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <StatusBadge status={ticket.priority} type="priority" />
                    <StatusBadge status={ticket.status} type="ticket" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{ticket.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reported By</p>
                  <p className="font-medium">{ticket.reportedByName}</p>
                </div>
                {ticket.assignedToName && (
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <p className="font-medium">{ticket.assignedToName}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{format(new Date(ticket.createdAt), 'MMMM dd, yyyy HH:mm')}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{ticket.description}</p>
              </div>

              {ticket.attachments?.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Attachments</p>
                  <div className="grid grid-cols-3 gap-2">
                    {ticket.attachments.map((att) => (
                      <img
                        key={att.id}
                        src={`http://localhost:8080/api/files/${att.filePath}`}
                        alt={att.fileName}
                        className="w-full h-32 object-cover rounded border"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f0f0f0" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em">Image not found</text></svg>';
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {ticket.resolutionNotes && (
                <div>
                  <p className="text-sm text-muted-foreground">Resolution Notes</p>
                  <p className="font-medium">{ticket.resolutionNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {ticket.comments?.length > 0 ? (
                  ticket.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`flex gap-3 ${
                        comment.userId === user?.id ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.userAvatarUrl} />
                        <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 max-w-md ${
                          comment.userId === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm font-medium">{comment.userName}</p>
                        <p className="text-sm">{comment.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {format(new Date(comment.createdAt), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No comments yet
                  </div>
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={commentMutation.isPending}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {(isAdmin || isTechnician) && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Update Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                {(selectedStatus === 'RESOLVED' || selectedStatus === 'REJECTED' || selectedStatus === 'CLOSED') && (
                  <div className="mt-2">
                    <Label htmlFor="resolutionNotes">Resolution Notes</Label>
                    <Textarea
                      id="resolutionNotes"
                      placeholder="Add resolution notes..."
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                )}
                <Button
                  onClick={handleStatusUpdate}
                  className="mt-2 w-full"
                  disabled={statusMutation.isPending}
                >
                  Update Status
                </Button>
              </div>

              {isAdmin && (
                <div>
                  <Label htmlFor="technician">Assign Technician</Label>
                  <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Nimal Fernando</SelectItem>
                      <SelectItem value="3">Kamal Jayasinghe</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleAssign}
                    className="mt-2 w-full"
                    disabled={assignMutation.isPending}
                  >
                    Assign
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

