import { createContext, useState, useContext, useCallback } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback(({ type = 'info', title, message, duration = 5000, actions = [] }) => {
    const id = Date.now() + Math.random();
    const alert = { id, type, title, message, actions };

    setAlerts((prev) => [...prev, alert]);

    // Auto-dismiss if duration is set
    if (duration > 0) {
      setTimeout(() => {
        dismissAlert(id);
      }, duration);
    }

    return id;
  }, []);

  const dismissAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  // Helper functions for different alert types
  const success = useCallback((message, title = 'Success', options = {}) => {
    return showAlert({ type: 'success', title, message, ...options });
  }, [showAlert]);

  const error = useCallback((message, title = 'Error', options = {}) => {
    return showAlert({ type: 'error', title, message, duration: 7000, ...options });
  }, [showAlert]);

  const warning = useCallback((message, title = 'Warning', options = {}) => {
    return showAlert({ type: 'warning', title, message, ...options });
  }, [showAlert]);

  const info = useCallback((message, title = 'Info', options = {}) => {
    return showAlert({ type: 'info', title, message, ...options });
  }, [showAlert]);

  const confirm = useCallback((message, title = 'Confirm', options = {}) => {
    return new Promise((resolve) => {
      showAlert({
        type: 'confirm',
        title,
        message,
        duration: 0, // Don't auto-dismiss confirm dialogs
        actions: [
          {
            label: options.cancelLabel || 'Cancel',
            variant: 'outline',
            onClick: () => {
              resolve(false);
            }
          },
          {
            label: options.confirmLabel || 'Confirm',
            variant: 'primary',
            onClick: () => {
              resolve(true);
            }
          }
        ],
        ...options
      });
    });
  }, [showAlert]);

  const value = {
    alerts,
    showAlert,
    dismissAlert,
    success,
    error,
    warning,
    info,
    confirm
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};
