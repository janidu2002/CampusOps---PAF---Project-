import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const PageHeader = ({ title, description, action, actionText, onAction }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action && (
          <Button onClick={onAction}>
            <Plus className="mr-2 h-4 w-4" />
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};
