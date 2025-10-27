import { useAlert } from '../context/AlertContext';

const AlertDemo = () => {
  const alert = useAlert();

  const handleSuccess = () => {
    alert.success('Your order has been placed successfully!', 'Order Placed');
  };

  const handleError = () => {
    alert.error('Failed to process your request. Please try again.', 'Error Occurred');
  };

  const handleWarning = () => {
    alert.warning('Your session will expire in 5 minutes.', 'Session Expiring');
  };

  const handleInfo = () => {
    alert.info('Your order is being prepared by our kitchen.', 'Order Update');
  };

  const handleConfirm = async () => {
    const confirmed = await alert.confirm(
      'Are you sure you want to delete this item? This action cannot be undone.',
      'Delete Item',
      {
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel'
      }
    );

    if (confirmed) {
      alert.success('Item deleted successfully!', 'Deleted');
    } else {
      alert.info('Deletion cancelled.', 'Cancelled');
    }
  };

  const handleCustomActions = () => {
    alert.showAlert({
      type: 'warning',
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. What would you like to do?',
      duration: 0,
      actions: [
        {
          label: 'Discard',
          variant: 'outline',
          onClick: () => {
            alert.info('Changes discarded.', 'Discarded');
          }
        },
        {
          label: 'Save',
          variant: 'primary',
          onClick: () => {
            alert.success('Changes saved successfully!', 'Saved');
          }
        }
      ]
    });
  };

  const handleLongMessage = () => {
    alert.info(
      'This is a longer message to demonstrate how the alert modal handles multiple lines of text. The modal will automatically adjust its height to accommodate the content while maintaining a clean and readable layout.',
      'Long Message Example'
    );
  };

  const handleMultipleAlerts = async () => {
    alert.info('Processing your request...', 'Processing', { duration: 2000 });
    setTimeout(() => {
      alert.success('Request processed successfully!', 'Complete', { duration: 3000 });
    }, 2500);
    setTimeout(() => {
      alert.info('Thank you for using our service!', 'Thank You', { duration: 3000 });
    }, 6000);
  };

  return (
    <div className="alert-demo-page">
      <div className="container">
        <h1>Alert Modal Demo</h1>
        <p className="demo-description">
          Click the buttons below to see the different alert types and configurations.
        </p>

        <div className="demo-grid">
          <div className="demo-section">
            <h2>Basic Alert Types</h2>
            <div className="button-group">
              <button onClick={handleSuccess} className="btn btn-success">
                Show Success Alert
              </button>
              <button onClick={handleError} className="btn btn-danger">
                Show Error Alert
              </button>
              <button onClick={handleWarning} className="btn btn-warning">
                Show Warning Alert
              </button>
              <button onClick={handleInfo} className="btn btn-info">
                Show Info Alert
              </button>
            </div>
          </div>

          <div className="demo-section">
            <h2>Advanced Features</h2>
            <div className="button-group">
              <button onClick={handleConfirm} className="btn btn-primary">
                Show Confirmation Dialog
              </button>
              <button onClick={handleCustomActions} className="btn btn-primary">
                Show Custom Actions
              </button>
              <button onClick={handleLongMessage} className="btn btn-primary">
                Show Long Message
              </button>
              <button onClick={handleMultipleAlerts} className="btn btn-primary">
                Show Multiple Alerts
              </button>
            </div>
          </div>

          <div className="demo-section">
            <h2>Usage Example</h2>
            <pre className="code-block">
{`import { useAlert } from '../context/AlertContext';

const MyComponent = () => {
  const alert = useAlert();

  const handleAction = async () => {
    try {
      await doSomething();
      alert.success('Success message!');
    } catch (error) {
      alert.error('Error message!');
    }
  };

  return <button onClick={handleAction}>Action</button>;
};`}
            </pre>
          </div>
        </div>
      </div>

      <style jsx>{`
        .alert-demo-page {
          padding: 2rem 0;
          min-height: calc(100vh - 200px);
        }

        .alert-demo-page h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .demo-description {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 3rem;
        }

        .demo-grid {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .demo-section {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .demo-section h2 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn-success {
          background-color: #27AE60;
          color: white;
        }

        .btn-danger {
          background-color: #E74C3C;
          color: white;
        }

        .btn-warning {
          background-color: #F39C12;
          color: white;
        }

        .btn-info {
          background-color: #3498DB;
          color: white;
        }

        .btn-primary {
          background-color: #FF6B35;
          color: white;
        }

        .code-block {
          background-color: #f5f5f5;
          padding: 1.5rem;
          border-radius: 8px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #333;
        }

        @media (max-width: 768px) {
          .button-group {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AlertDemo;
