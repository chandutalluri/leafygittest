import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AlertDialogProps {
  children: React.ReactNode;
}

interface AlertDialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface AlertDialogContentProps {
  className?: string;
  children: React.ReactNode;
}

interface AlertDialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface AlertDialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

interface AlertDialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface AlertDialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

interface AlertDialogActionProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

interface AlertDialogCancelProps {
  className?: string;
  children: React.ReactNode;
}

const AlertDialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

export function AlertDialog({ children }: AlertDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>{children}</AlertDialogContext.Provider>
  );
}

export function AlertDialogTrigger({ asChild, children }: AlertDialogTriggerProps) {
  const { setOpen } = React.useContext(AlertDialogContext);

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => setOpen(true),
    });
  }

  return <button onClick={() => setOpen(true)}>{children}</button>;
}

export function AlertDialogContent({ className, children }: AlertDialogContentProps) {
  const { open, setOpen } = React.useContext(AlertDialogContext);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div
        className={cn('relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4', className)}
      >
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({ className, children }: AlertDialogHeaderProps) {
  return <div className={cn('space-y-2', className)}>{children}</div>;
}

export function AlertDialogFooter({ className, children }: AlertDialogFooterProps) {
  return <div className={cn('flex justify-end space-x-2 mt-6', className)}>{children}</div>;
}

export function AlertDialogTitle({ className, children }: AlertDialogTitleProps) {
  return <h2 className={cn('text-lg font-semibold', className)}>{children}</h2>;
}

export function AlertDialogDescription({ className, children }: AlertDialogDescriptionProps) {
  return <p className={cn('text-sm text-gray-600', className)}>{children}</p>;
}

export function AlertDialogAction({ className, onClick, children }: AlertDialogActionProps) {
  const { setOpen } = React.useContext(AlertDialogContext);

  const handleClick = () => {
    onClick?.();
    setOpen(false);
  };

  return (
    <Button className={className} onClick={handleClick}>
      {children}
    </Button>
  );
}

export function AlertDialogCancel({ className, children }: AlertDialogCancelProps) {
  const { setOpen } = React.useContext(AlertDialogContext);

  return (
    <Button variant="outline" className={className} onClick={() => setOpen(false)}>
      {children}
    </Button>
  );
}
