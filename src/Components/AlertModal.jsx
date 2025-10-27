import { useEffect } from 'react';
import { FaTimes, FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { useAlert } from '../context/AlertContext';

const AlertModal = () => {
  const { alerts, dismissAlert } = useAlert();

  useEffect(() => {
    // Prevent body scroll when alerts are present
    if (alerts.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [alerts]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="alert-icon success-icon" />;
      case 'error':
        return <FaExclamationCircle className="alert-icon error-icon" />;
      case 'warning':
        return <FaExclamationTriangle className="alert-icon warning-icon" />;
      case 'confirm':
        return <FaExclamationTriangle className="alert-icon warning-icon" />;
      default:
        return <FaInfoCircle className="alert-icon info-icon" />;
    }
  };

  const getAlertClass = (type) => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      case 'warning':
        return 'alert-warning';
      case 'confirm':
        return 'alert-confirm';
      default:
        return 'alert-info';
    }
  };

  if (alerts.length === 0) return null;

  // Show only the most recent alert
  const currentAlert = alerts[alerts.length - 1];

  return (
    <div className="alert-modal-overlay" onClick={() => dismissAlert(currentAlert.id)}>
      <div
        className={`alert-modal ${getAlertClass(currentAlert.type)}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="alert-close-btn"
          onClick={() => dismissAlert(currentAlert.id)}
          aria-label="Close alert"
        >
          <FaTimes />
        </button>

        <div className="alert-content">
          <div className="alert-icon-container">
            {getAlertIcon(currentAlert.type)}
          </div>

          <div className="alert-text">
            {currentAlert.title && (
              <h3 className="alert-title">{currentAlert.title}</h3>
            )}
            {currentAlert.message && (
              <p className="alert-message">{currentAlert.message}</p>
            )}
          </div>
        </div>

        {currentAlert.actions && currentAlert.actions.length > 0 && (
          <div className="alert-actions">
            {currentAlert.actions.map((action, index) => (
              <button
                key={index}
                className={`alert-action-btn ${action.variant === 'primary' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => {
                  action.onClick();
                  dismissAlert(currentAlert.id);
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {(!currentAlert.actions || currentAlert.actions.length === 0) && (
          <div className="alert-actions">
            <button
              className="alert-action-btn btn-primary"
              onClick={() => dismissAlert(currentAlert.id)}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertModal;
