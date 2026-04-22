import { Badge } from '@/components/ui/badge';

export const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusVariant = (status, type) => {
    if (type === 'booking') {
      switch (status) {
        case 'APPROVED':
          return 'default';
        case 'PENDING':
          return 'secondary';
        case 'REJECTED':
          return 'destructive';
        case 'CANCELLED':
          return 'outline';
        default:
          return 'default';
      }
    }
    if (type === 'ticket') {
      switch (status) {
        case 'OPEN':
          return 'secondary';
        case 'IN_PROGRESS':
          return 'default';
        case 'RESOLVED':
          return 'default';
        case 'CLOSED':
          return 'outline';
        case 'REJECTED':
          return 'destructive';
        default:
          return 'default';
      }
    }
    if (type === 'priority') {
      switch (status) {
        case 'CRITICAL':
          return 'destructive';
        case 'HIGH':
          return 'secondary';
        case 'MEDIUM':
          return 'default';
        case 'LOW':
          return 'outline';
        default:
          return 'default';
      }
    }
    return 'default';
  };

  return (
    <Badge variant={getStatusVariant(status, type)}>
      {status}
    </Badge>
  );
};
