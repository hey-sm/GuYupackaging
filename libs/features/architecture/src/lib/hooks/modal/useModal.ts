import { useState, useCallback } from 'react';

export interface UseModalProps {
  initialVisible?: boolean;
}

export const useModal = ({ initialVisible = false }: UseModalProps = {}) => {
  const [open, setOpen] = useState(initialVisible);
  const show = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const modalProps = {
    open,
    onCancel: close,
  };

  return {
    open,
    show,
    close,
    modalProps,
  };
};
