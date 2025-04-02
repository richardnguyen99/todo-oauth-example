export type Task = {
  id: number;
  title: string;
  completed: boolean;
  workspace: string;
  dueDate: string;
  priority: string;
  tags: string[];
};
