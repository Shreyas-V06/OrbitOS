import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Trash2 } from 'lucide-react';

interface Todo {
  id: string;
  name: string;
  completed: boolean;
}

const TodoTab: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulating Firebase data fetch
    setTimeout(() => {
      const mockTodos = [
        { id: '1', name: 'Plan space expedition', completed: false },
        { id: '2', name: 'Check telescope settings', completed: true },
        { id: '3', name: 'Research nearby galaxies', completed: false },
        { id: '4', name: 'Update star charts', completed: false }
      ];
      setTodos(mockTodos);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  const handleAddTodo = () => {
    if (!newTodoName.trim()) return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      name: newTodoName,
      completed: false
    };
    
    setTodos(prev => [...prev, newTodo]);
    setNewTodoName('');
    
    // Here you would normally add the todo to Firebase
  };
  
  const handleToggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    
    // Here you would normally update the todo in Firebase
  };
  
  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    
    // Here you would normally delete the todo from Firebase
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
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
          <div className="mb-6 flex">
            <input
              type="text"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Add new task..."
              value={newTodoName}
              onChange={(e) => setNewTodoName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="bg-primary hover:bg-opacity-80 px-4 rounded-r-lg flex items-center justify-center transition-colors"
              onClick={handleAddTodo}
            >
              <Plus size={20} />
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex space-x-2">
                <span className="loading-dot w-3 h-3 rounded-full bg-white"></span>
                <span className="loading-dot w-3 h-3 rounded-full bg-white"></span>
                <span className="loading-dot w-3 h-3 rounded-full bg-white"></span>
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {todos.map(todo => (
                <motion.li
                  key={todo.id}
                  className={`todo-item p-3 bg-gray-800 rounded-lg flex items-center ${todo.completed ? 'completed' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    type="checkbox"
                    className="checkbox mr-3"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                  />
                  <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.name}
                  </span>
                  <button
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    onClick={() => handleDeleteTodo(todo.id)}
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