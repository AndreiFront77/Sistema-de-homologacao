export interface BusinessmapCard {
  card_id: number;
  title: string;
  column_name: string;
  type_name: string;
  description: string;
  created_at: string;
  updated_at: string;
  priority: number;
  size: number;
  is_blocked: number;
  finished_subtask_count: number;
  unfinished_subtask_count: number;
  owner_user_id: number | null;
  color: string;
  [key: string]: any;
}

export interface Inconsistency {
  id?: string;
  group: string;
  subgroup: string;
  description: string;
  date: Date;
}

export interface HomologacaoLocal {
  id?: string;
  card: BusinessmapCard;
  startDate: Date;
  status: 'Pendente' | 'Em Progresso' | 'Concluído' | 'Bloqueado';
  inconsistencies: Inconsistency[];
  lastModified: Date;
}