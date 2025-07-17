import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastState {
  toasts: Toast[];
}

let toastCounter = 0;

export const useToast = () => {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = (++toastCounter).toString();
    const newToast: Toast = { id, title, description, variant };

    setState(prev => ({
      toasts: [...prev.toasts, newToast],
    }));

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setState(prev => ({
        toasts: prev.toasts.filter(t => t.id !== id),
      }));
    }, 5000);

    // For now, just console.log the toast
    console.log(`Toast: ${title}${description ? ` - ${description}` : ''}`);
  }, []);

  const dismiss = useCallback((toastId: string) => {
    setState(prev => ({
      toasts: prev.toasts.filter(t => t.id !== toastId),
    }));
  }, []);

  return {
    toast,
    dismiss,
    toasts: state.toasts,
  };
};
