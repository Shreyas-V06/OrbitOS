import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = {

  sendMessage: async (message: string) => {
    const response = await axios.post(`${API_BASE_URL}/agent/chat`, 
      { message },
      {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.response;
  },


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