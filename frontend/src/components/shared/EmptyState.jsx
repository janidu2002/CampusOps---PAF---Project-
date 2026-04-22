import { Button } from '@/components/ui/button';
import { Inbox, Plus } from 'lucide-react';

export const EmptyState = ({ title, description, actionText, onAction, icon: Icon = Inbox }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-2 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {actionText && onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>
            <Plus className="mr-2 h-4 w-4" />
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
