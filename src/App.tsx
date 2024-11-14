import { useState, useEffect, useCallback } from 'react';

import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import ThemeToggle from './components/ThemeToggle';
import { useDarkMode } from './hooks/useDarkMode';
import { Task } from './types/task';

function App() {
  const [darkMode, setDarkMode] = useDarkMode();
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromLocalStorage());
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Salva as tarefas no localStorage quando elas mudam
  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  // Função para adicionar uma nova tarefa
  const handleAddTask = useCallback(
    (taskData: Omit<Task, 'id' | 'createdAt'>) => {
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(), // Substitua por uuid() caso haja problemas de compatibilidade
        createdAt: new Date().toISOString(),
        status: 'pending', // Adiciona status padrão caso esteja faltando
      };
      setTasks(prev => [newTask, ...prev]);
    },
    []
  );

  // Função para editar uma tarefa existente
  const handleEditTask = useCallback(
    (taskData: Omit<Task, 'id' | 'createdAt'>) => {
      if (!editingTask) return;
      setTasks(prev => prev.map(task => (task.id === editingTask.id ? { ...task, ...taskData } : task)));
      setEditingTask(null);
    },
    [editingTask]
  );

  // Função para deletar uma tarefa
  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  // Função para alternar o status da tarefa
  const handleToggleStatus = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, status: toggleStatus(task.status) } : task))
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-3xl">
        <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
        <TaskForm onSubmit={editingTask ? handleEditTask : handleAddTask} editTask={editingTask} onCancel={() => setEditingTask(null)} />
        <TaskList tasks={tasks} onEdit={setEditingTask} onDelete={handleDeleteTask} onToggleStatus={handleToggleStatus} />
      </div>
    </div>
  );
}

// Função para carregar as tarefas do localStorage
const loadTasksFromLocalStorage = (): Task[] => {
  const savedTasks = localStorage.getItem('tasks');
  return savedTasks ? JSON.parse(savedTasks) : [];
};

// Função para salvar as tarefas no localStorage
const saveTasksToLocalStorage = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Função para alternar o status entre 'completed' e 'pending'
const toggleStatus = (status: 'completed' | 'pending') => (status === 'completed' ? 'pending' : 'completed');

// Componente de cabeçalho
const Header = ({ darkMode, onToggleDarkMode }: { darkMode: boolean; onToggleDarkMode: () => void }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8 mb-6 sm:mb-8">
    <div className="flex items-center gap-3">
      
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Lista de tarefas 📝</h1>
    </div>
    <ThemeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
  </div>
);

// Componente de lista de tarefas
const TaskList = ({ tasks, onEdit, onDelete, onToggleStatus }: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}) => (
  <div className="space-y-4">
    {tasks.length === 0 ? (
      <div className="text-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">Sem tarefas aqui. Adicione uma tarefa para começar!</p>
      </div>
    ) : (
      tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))
    )}
  </div>
);

export default App;
