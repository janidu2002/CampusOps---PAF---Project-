import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '../../api/ticketApi';
import { resourceApi } from '../../api/resourceApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const NewTicketPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    priority: '',
    resourceId: '',
    contactDetails: '',
  });
  const [files, setFiles] = useState([]);

  const { data: resources } = useQuery({
    queryKey: ['resources'],
    queryFn: () => resourceApi.getAll({ status: 'ACTIVE' }).then(res => res.data),
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      const formDataObj = new FormData();
      formDataObj.append('title', data.title);
      formDataObj.append('category', data.category);
      formDataObj.append('description', data.description);
      formDataObj.append('priority', data.priority);
      if (data.resourceId) formDataObj.append('resourceId', data.resourceId);
      if (data.contactDetails) formDataObj.append('contactDetails', data.contactDetails);
      files.forEach((file) => formDataObj.append('files', file));
      return ticketApi.create(formDataObj);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets']);
      toast.success('Ticket created successfully');
      navigate('/tickets');
    },
    onError: (error) => {
      console.error('Ticket creation error:', error);
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to create ticket');
    },
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 3) {
      toast.error('Maximum 3 files allowed');
      return;
    }
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div>
      <Link to="/tickets">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tickets
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                  <SelectItem value="PLUMBING">Plumbing</SelectItem>
                  <SelectItem value="IT_EQUIPMENT">IT Equipment</SelectItem>
                  <SelectItem value="FURNITURE">Furniture</SelectItem>
                  <SelectItem value="SAFETY">Safety</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="resourceId">Resource (Optional)</Label>
              <Select value={formData.resourceId} onValueChange={(v) => setFormData({ ...formData, resourceId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select related resource" />
                </SelectTrigger>
                <SelectContent>
                  {resources?.data?.content?.map((resource) => (
                    <SelectItem key={resource.id} value={String(resource.id)}>
                      {resource.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contactDetails">Contact Details (Optional)</Label>
              <Input
                id="contactDetails"
                value={formData.contactDetails}
                onChange={(e) => setFormData({ ...formData, contactDetails: e.target.value })}
                placeholder="Phone number or email"
              />
            </div>

            <div>
              <Label>Attachments (Max 3)</Label>
              <div className="mt-2">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-2"
                />
                {files.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {files.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating...' : 'Create Ticket'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/tickets')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

