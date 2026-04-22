import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axios } from '../../api/axios';
import { Plus } from 'lucide-react';

export const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => axios.get('/users').then(res => res.data.data),
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, newRole }) => 
      axios.patch(`/users/${userId}/role`, null, { params: { newRole } }),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User role updated successfully');
    },
    onError: () => {
      toast.error('Failed to update user role');
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (userData) => 
      axios.post('/users', userData, { params: { role: newUser.role } }),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User created successfully');
      setIsCreateDialogOpen(false);
      setNewUser({ name: '', email: '', password: '', confirmPassword: '', role: 'USER' });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create user');
    },
  });

  const handleRoleChange = (userId, newRole) => {
    roleMutation.mutate({ userId, newRole });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    
    if (newUser.password !== newUser.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newUser.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    createUserMutation.mutate({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      confirmPassword: newUser.confirmPassword,
    });
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const userList = users || [];

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage users and their roles"
        action={
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with a specific role
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="TECHNICIAN">Technician</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createUserMutation.isPending}>
                    {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {userList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userList.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.avatarUrl && (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="h-8 w-8 rounded-full"
                          />
                        )}
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.id === currentUser?.id ? (
                        <Badge>{user.role}</Badge>
                      ) : (
                        <Select
                          value={user.role}
                          onValueChange={(v) => handleRoleChange(user.id, v)}
                          disabled={roleMutation.isPending}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="TECHNICIAN">Technician</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'destructive'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {user.id !== currentUser?.id && (
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No users found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
