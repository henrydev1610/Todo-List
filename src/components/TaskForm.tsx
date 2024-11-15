import React, { useState, useEffect } from 'react';
import { Save, PlusCircle } from 'lucide-react';
import { Task } from '../types/task';

interface TaskFormProps {
  onSubmit: (task: Task) => void; // Função chamada ao submeter o formulário.
  editTask?: Task | null; // Tarefa para edição (opcional).
  onCancel?: () => void; // Função para cancelar edição (opcional).
}

export default function TaskForm({ onSubmit, editTask, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('média');
  const [image, setImage] = useState<File | null>(null); // Novo estado para a imagem.

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setPriority(editTask.priority);
      setImage(null); // Limpa a imagem ao iniciar a edição.
    }
  }, [editTask]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('O título da tarefa é obrigatório.');
      return;
    }

    const imageUrl = image ? URL.createObjectURL(image) : undefined;

    onSubmit({
      id: editTask?.id || crypto.randomUUID(), // Corrige a ausência do ID para novas tarefas.
      title,
      description,
      priority,
      status: editTask?.status || 'pendente', // Mantém o status atual ao editar.
      image: imageUrl, // Adiciona a URL da imagem.
      createdAt: editTask?.createdAt || new Date().toISOString(), // Garante a data de criação.
    });

    if (!editTask) {
      setTitle('');
      setDescription('');
      setPriority('média');
      setImage(null); // Limpa o campo de imagem.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Título
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título da tarefa"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descrição
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Digite a descrição da tarefa"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Prioridade
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task['priority'])}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <option value="baixa">Baixa</option>
          <option value="média">Média</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Imagem (Opcional)
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
        {editTask && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                     rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md 
                   hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          {editTask ? <Save size={20} /> : <PlusCircle size={20} />}
          {editTask ? 'Salvar' : 'Adicionar Tarefa'}
        </button>
      </div>
    </form>
  );
}
