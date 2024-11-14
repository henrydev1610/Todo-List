
import { Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 transition-all hover:shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-4">
        <div className="flex-1 order-2 sm:order-1">
          <h3 className={`text-lg sm:text-xl font-semibold mb-2 dark:text-white ${
            task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : ''
          }`}>
            {task.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3">{task.description}</p>
        </div>
        <span className={`self-start order-1 sm:order-2 px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto">
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </div>
        <div className="flex gap-1 sm:gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`p-2 rounded-full transition-colors ${
              task.status === 'completed'
                ? 'text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
            aria-label={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
          >
            {task.status === 'completed' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            aria-label="Edit task"
          >
            <Edit2 size={20} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}