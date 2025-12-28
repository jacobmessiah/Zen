import axios from "axios";

export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
});

class NotificationAudio {
  message = new Audio("/sounds/message.mp3");
  connection = new Audio("/sounds/newconnection.mp3");

  playMessage() {
    this.message.currentTime = 0;
    this.message.play().catch(() => {});
  }

  playConnection() {
    this.connection.currentTime = 0;
    this.connection.play().catch(() => {});
  }
}

export const notificationService = new NotificationAudio();
