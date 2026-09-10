import { useState, useCallback } from 'react';
import Toast from './Toast';

let toastId = 0;
let addToast = null;

export const showToast = (message, type = 'info', duration = 3000) => {
  if (addToast) {
    addToast(message, type, duration);
  }
};

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const handleAddToast = useCallback((message, type, duration) => {
    const id = toastId++;
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const handleRemoveToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Set global function
  if (typeof window !== 'undefined') {
    addToast = handleAddToast;
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => handleRemoveToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default ToastContainer;

