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
  const [updatingTodos, setUpdatingTodos] = useState<Set<string>>(new Set());

  // Log todos whenever it changes
  useEffect(() => {
    console.log('Todos state changed:', todos);
  }, [todos]);

  useEffect(() => {
    fetchTodos();
  }, []);

  // FETCH ALL TODOS (WORKING)
  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:8000/todos');
      const data = await response.json();
      setTodos(data);  // Set the todos to state
      console.log('Fetched todos:', data); // Log the fetched todos
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTodo = async (todoId: string) => {
    // Prevent multiple clicks while updating
    if (updatingTodos.has(todoId)) return;
    
    const todoToUpdate = todos.find(todo => todo.unique_id === todoId);
    if (!todoToUpdate) return;

    // Optimistically update UI
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.unique_id === todoId ? { ...todo, todo_checkbox: !todo.todo_checkbox } : todo
      )
    );

    // Add to updating set
    setUpdatingTodos(prev => new Set([...prev, todoId]));

    try {
      const response = await fetch(`http://localhost:8000/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todo_checkbox: !todoToUpdate.todo_checkbox
        }),
      });

      if (!response.ok) {
        // Revert on failure
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.unique_id === todoId ? { ...todo, todo_checkbox: todoToUpdate.todo_checkbox } : todo
          )
        );
      }
    } catch (error) {
      // Revert on error
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.unique_id === todoId ? { ...todo, todo_checkbox: todoToUpdate.todo_checkbox } : todo
        )
      );
      console.error('Error updating todo:', error);
    } finally {
      setUpdatingTodos(prev => {
        const next = new Set(prev);
        next.delete(todoId);
        return next;
      });
    }
  };

  const handleAddTodo = async () => {
    if (!newTodoName.trim()) return;

    // Create temporary todo with a temporary ID
    const tempId = `temp-${Date.now()}`;
    const newTodo = {
      unique_id: tempId,
      todo_name: newTodoName,
      todo_checkbox: false,
      todo_duedate: newTodoDueDate || new Date().toISOString().split('T')[0]
    };

    // Optimistically add to UI
    setTodos(prev => [...prev, newTodo]);
    
    // Clear input fields immediately
    setNewTodoName('');
    setNewTodoDueDate('');

    try {
      const response = await fetch('http://localhost:8000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todo_name: newTodo.todo_name,
          todo_checkbox: newTodo.todo_checkbox,
          todo_duedate: newTodo.todo_duedate,
        }),
      });

      if (response.ok) {
        // Fetch updated list to get the real ID
        fetchTodos();
      } else {
        // Remove temporary todo on failure
        setTodos(prev => prev.filter(todo => todo.unique_id !== tempId));
      }
    } catch (error) {
      // Remove temporary todo on error
      setTodos(prev => prev.filter(todo => todo.unique_id !== tempId));
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    // Optimistically remove from UI
    setTodos(prev => prev.filter(todo => todo.unique_id !== id));

    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Revert deletion if failed
        const deletedTodo = todos.find(todo => todo.unique_id === id);
        if (deletedTodo) {
          setTodos(prev => [...prev, deletedTodo]);
        }
      }
    } catch (error) {
      // Revert deletion on error
      const deletedTodo = todos.find(todo => todo.unique_id === id);
      if (deletedTodo) {
        setTodos(prev => [...prev, deletedTodo]);
      }
      console.error('Error deleting todo:', error);
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
                  className={`todo-item p-3 bg-gray-800 rounded-lg flex items-center ${todo.todo_checkbox ? 'completed' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: updatingTodos.has(todo.unique_id) ? 0.6 : 1,
                    y: 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    type="checkbox"
                    className="checkbox mr-3"
                    checked={todo.todo_checkbox}
                    onChange={() => handleToggleTodo(todo.unique_id)}
                    disabled={updatingTodos.has(todo.unique_id)}
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
                    disabled={updatingTodos.has(todo.unique_id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.li>
              ))}

              {todos.length === 0 && (
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
