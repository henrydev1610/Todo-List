export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'baixa' | 'média' | 'alta';
  status: 'pendente' | 'completada';
  createdAt: string;
  image?: string; // Adicionado para armazenar o link da imagem
}
