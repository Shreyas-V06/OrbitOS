import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Agent Chat
  sendMessage: async (message: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/agent/chat`, {
        "message: message
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data.response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Todo Operations
  getTodos: async () => {
    const response = await axios.get(`${API_BASE_URL}/todos`);
    return response.data.todos;
  },

  createTodo: async (todo: {
    todo_name: string;
    todo_checkbox: boolean;
    todo_duedate: string;
  }) => {
    const response = await axios.post(`${API_BASE_URL}/todos`, todo);
    return response.data.todo;
  }
}; 