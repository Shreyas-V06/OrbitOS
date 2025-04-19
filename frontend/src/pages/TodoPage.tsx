import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../services/api';

const Container = styled.div`
  padding: 20px;
`;

const TodoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TodoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
`;

const TodoName = styled.span<{ completed: boolean }>`
  flex: 1;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const DueDate = styled.span`
  color: #666;
`;

const AddTodoForm = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

interface Todo {
  id: string;
  todo_name: string;
  todo_checkbox: boolean;
  todo_duedate: string;
}

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({
    todo_name: '',
    todo_checkbox: false,
    todo_duedate: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const todos = await api.getTodos();
      setTodos(todos);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.todo_name.trim()) return;

    try {
      setIsLoading(true);
      const todo = await api.createTodo(newTodo);
      setTodos(prev => [...prev, todo]);
      setNewTodo({
        todo_name: '',
        todo_checkbox: false,
        todo_duedate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error creating todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <AddTodoForm onSubmit={handleSubmit}>
        <Input
          type="text"
          value={newTodo.todo_name}
          onChange={(e) => setNewTodo(prev => ({ ...prev, todo_name: e.target.value }))}
          placeholder="New todo..."
        />
        <Input
          type="date"
          value={newTodo.todo_duedate}
          onChange={(e) => setNewTodo(prev => ({ ...prev, todo_duedate: e.target.value }))}
        />
        <Button type="submit" disabled={isLoading}>
          Add Todo
        </Button>
      </AddTodoForm>

      <TodoList>
        {todos.map(todo => (
          <TodoItem key={todo.id}>
            <Checkbox
              type="checkbox"
              checked={todo.todo_checkbox}
              onChange={() => {/* Handle checkbox change */}}
            />
            <TodoName completed={todo.todo_checkbox}>
              {todo.todo_name}
            </TodoName>
            <DueDate>
              Due: {new Date(todo.todo_duedate).toLocaleDateString()}
            </DueDate>
          </TodoItem>
        ))}
      </TodoList>
    </Container>
  );
};

export default TodoPage; 