import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinAdmin() {
    if (this.socket) {
      this.socket.emit('joinAdmin');
    }
  }

  trackOrder(orderNumber) {
    if (this.socket) {
      this.socket.emit('trackOrder', orderNumber);
    }
  }

  leaveOrder(orderNumber) {
    if (this.socket) {
      this.socket.emit('leaveOrder', orderNumber);
    }
  }

  onNewOrder(callback) {
    if (this.socket) {
      this.socket.on('newOrder', callback);
    }
  }

  onOrderStatusUpdate(callback) {
    if (this.socket) {
      this.socket.on('orderStatusUpdate', callback);
    }
  }

  onOrderUpdate(callback) {
    if (this.socket) {
      this.socket.on('orderUpdate', callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  getSocket() {
    return this.socket;
  }
}

const socketService = new SocketService();
export default socketService;
