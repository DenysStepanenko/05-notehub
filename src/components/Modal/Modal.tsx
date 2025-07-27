import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleBodyScroll = () => {
      document.body.style.overflow = 'hidden';
    };

    document.addEventListener('keydown', handleEscape);
    handleBodyScroll();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.error('Modal root element not found');
    return null;
  }

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button 
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;