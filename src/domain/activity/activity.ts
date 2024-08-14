export interface Activity {
  id: string;
  area: string;
  data: { [key: string]: string | number | boolean };
  points: number;
}
