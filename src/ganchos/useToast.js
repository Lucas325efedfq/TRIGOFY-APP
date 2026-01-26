import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({ 
    show: false, 
    message: '', 
    type: 'success' 
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return { toast, showToast, hideToast };
};
