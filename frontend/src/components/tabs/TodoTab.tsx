import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

interface Todo {
  unique_id: string;
  todo_name: string;
  todo_checkbox: boolean;
  todo_duedate: string;
}

const TodoTab: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pendingTodos, setPendingTodos] = useState<Set<string>>(new Set());

  useEffect(() => {
    const cachedTodos = localStorage.getItem('todos');
    if (cachedTodos) {
      setTodos(JSON.parse(cachedTodos));
      setIsLoading(false);
    }
    fetchTodos();
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:8000/todos');
      const data = await response.json();
      setTodos(data);
      localStorage.setItem('todos', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodoName.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const newTodo: Todo = {
      unique_id: tempId,
      todo_name: newTodoName,
      todo_checkbox: false,
      todo_duedate: newTodoDueDate || new Date().toISOString().split('T')[0]
    };

    setTodos(prev => [...prev, newTodo]);
    setNewTodoName('');
    setNewTodoDueDate('');

    try {
      const response = await fetch('http://localhost:8000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        fetchTodos();
      } else {
        setTodos(prev => prev.filter(todo => todo.unique_id !== tempId));
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      setTodos(prev => prev.filter(todo => todo.unique_id !== tempId));
    }
  };

  const handleToggleTodo = async (id: string, currentStatus: boolean) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.unique_id === id ? { ...todo, todo_checkbox: !todo.todo_checkbox } : todo
      )
    );

    setPendingTodos(prev => new Set(prev).add(id));

    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todo_checkbox: !currentStatus
        }),
      });

      if (!response.ok) {
        setTodos(prev =>
          prev.map(todo =>
            todo.unique_id === id ? { ...todo, todo_checkbox: currentStatus } : todo
          )
        );
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      setTodos(prev =>
        prev.map(todo =>
          todo.unique_id === id ? { ...todo, todo_checkbox: currentStatus } : todo
        )
      );
    } finally {
      setPendingTodos(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    setTodos(prev => prev.filter(todo => todo.unique_id !== id));

    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      fetchTodos();
    }
  };

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold">Todo List</h2>
        <p className="text-text-secondary text-sm">Track your space missions</p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Add new task..."
              value={newTodoName}
              onChange={(e) => setNewTodoName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            />
            <input
              type="date"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={newTodoDueDate}
              onChange={(e) => setNewTodoDueDate(e.target.value)}
            />
            <button
              className="bg-primary hover:bg-opacity-80 px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
              onClick={handleAddTodo}
            >
              <Plus size={20} />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex space-x-2">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {todos.map(todo => (
                <motion.li
                  key={todo.unique_id}
                  className={`todo-item p-3 bg-gray-800 rounded-lg flex items-center ${
                    todo.todo_checkbox ? 'completed' : ''
                  } ${pendingTodos.has(todo.unique_id) ? 'opacity-60' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    type="checkbox"
                    className="checkbox mr-3"
                    checked={todo.todo_checkbox}
                    onChange={() => handleToggleTodo(todo.unique_id, todo.todo_checkbox)}
                    disabled={pendingTodos.has(todo.unique_id)}
                  />
                  <span className={`flex-1 ${todo.todo_checkbox ? 'line-through text-gray-500' : ''}`}>
                    {todo.todo_name}
                  </span>
                  <span className="text-gray-400 mr-4">
                    {new Date(todo.todo_duedate).toLocaleDateString()}
                  </span>
                  <button
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    onClick={() => handleDeleteTodo(todo.unique_id)}
                    disabled={pendingTodos.has(todo.unique_id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.li>
              ))}

              {!isLoading && todos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No tasks yet. Add one above!</p>
                </div>
              )}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TodoTab;