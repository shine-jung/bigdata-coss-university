export interface Field {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
}

export interface MileageArea {
  name: string;
  defaultPoints: number;
  fields: Field[];
}
