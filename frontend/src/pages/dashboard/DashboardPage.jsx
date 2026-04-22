import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../../api/bookingApi';
import { ticketApi } from '../../api/ticketApi';
import { resourceApi } from '../../api/resourceApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Ticket, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { StatusBadge } from '../../components/shared/StatusBadge';

export const DashboardPage = () => {
  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingApi.getAll({ page: 0, size: 5 }).then(res => res.data),
  });

  const { data: tickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketApi.getAll({ page: 0, size: 5 }).then(res => res.data),
  });

  const { data: resources } = useQuery({
    queryKey: ['resources'],
    queryFn: () => resourceApi.getAll({ status: 'ACTIVE' }).then(res => res.data),
  });

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings?.data?.totalElements || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Approvals',
      value: bookings?.data?.content?.filter(b => b.status === 'PENDING').length || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Open Tickets',
      value: tickets?.data?.content?.filter(t => t.status === 'OPEN').length || 0,
      icon: Ticket,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Available Resources',
      value: resources?.data?.totalElements || 0,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of campus operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings?.data?.content?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.data.content.slice(0, 5).map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.resourceName}</TableCell>
                      <TableCell>{format(new Date(booking.bookingDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} type="booking" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-4">
                No recent bookings
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {tickets?.data?.content?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.data.content.slice(0, 5).map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>
                        <StatusBadge status={ticket.priority} type="priority" />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ticket.status} type="ticket" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-4">
                No recent tickets
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex gap-4">
        <Link to="/bookings/new">
          <Button>New Booking</Button>
        </Link>
        <Link to="/tickets/new">
          <Button variant="outline">Report Issue</Button>
        </Link>
      </div>
    </div>
  );
};
