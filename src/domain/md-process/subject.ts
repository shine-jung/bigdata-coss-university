export interface Subject {
  id: string;
  processId: string;
  categoryNumber: number;
  name: string | null;
  credit: number;
  code: string;
  department: string;
  required: boolean;
}
