import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "../api/api";
import { RECEIVE_MESSAGE } from "../redux/chat/chat.actionType";
import { createLogger } from "../utils/logger";

const logger = createLogger("ChatService");

class ChatService {
  constructor() {
    this.stompClient = null;
    this.subscription = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.currentChatId = null;
    this.dispatch = null;
  }

  // Initialize the service with Redux dispatch
  init(dispatch) {
    this.dispatch = dispatch;
  }

  // Connect to WebSocket
  connect() {
    if (this.stompClient && this.isConnected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const socket = new SockJS(`${API_BASE_URL}/ws`);
        this.stompClient = Stomp.over(socket);

        // Disable debug logs
        this.stompClient.debug = () => {};

        this.stompClient.connect(
          {},
          () => {
            logger.success("Chat WebSocket connected");
            this.isConnected = true;
            this.reconnectAttempts = 0;
            resolve();
          },
          (error) => {
            logger.error("Chat WebSocket connection error:", error);
            this.isConnected = false;
            this.attemptReconnect();
            reject(error);
          }
        );
      } catch (error) {
        logger.error("Error setting up chat WebSocket:", error);
        reject(error);
      }
    });
  }

  // Subscribe to a chat
  subscribeToChat(chatId) {
    if (!this.stompClient || !this.isConnected) {
      logger.warn("WebSocket not connected, attempting to connect...");
      this.connect().then(() => this.subscribeToChat(chatId));
      return;
    }

    // Unsubscribe from previous chat if any
    this.unsubscribeFromChat();

    try {
      this.currentChatId = chatId;
      this.subscription = this.stompClient.subscribe(`/group/${chatId}/private`, (message) => {
        try {
          const receivedMessage = JSON.parse(message.body);
          const normalizedMessage = {
            ...receivedMessage,
            chatId: receivedMessage.chatId ?? receivedMessage.chat?.id ?? this.currentChatId,
          };
          if (this.dispatch) {
            this.dispatch({ type: RECEIVE_MESSAGE, payload: normalizedMessage });
          }
        } catch (error) {
          logger.error("Error processing received message:", error);
        }
      });
      logger.info(`Subscribed to chat ${chatId}`);
    } catch (error) {
      logger.error("Error subscribing to chat:", error);
    }
  }

  // Send message to server
  sendMessage(message) {
    if (!this.stompClient || !this.isConnected || !this.currentChatId) {
      logger.error("Cannot send message: WebSocket not connected or no chat selected");
      return false;
    }

    try {
      this.stompClient.send(`/app/chat/${this.currentChatId}`, {}, JSON.stringify(message));
      return true;
    } catch (error) {
      logger.error("Error sending message:", error);
      return false;
    }
  }

  // Unsubscribe from current chat
  unsubscribeFromChat() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
      this.currentChatId = null;
    }
  }

  // Disconnect WebSocket
  disconnect() {
    this.unsubscribeFromChat();
    if (this.stompClient && this.isConnected) {
      this.stompClient.disconnect();
      this.isConnected = false;
      logger.info("Chat WebSocket disconnected");
    }
  }

  // Attempt to reconnect
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        logger.info(`Attempting chat WebSocket reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.connect()
          .then(() => {
            if (this.currentChatId) {
              this.subscribeToChat(this.currentChatId);
            }
          })
          .catch(() => {
            // Will retry again
          });
      }, this.reconnectInterval);
    } else {
      logger.error("Max chat WebSocket reconnect attempts reached");
    }
  }

  // Check connection status
  isConnectionHealthy() {
    return this.stompClient && this.isConnected;
  }
}

// Export singleton instance
export const chatService = new ChatService();
