import { Timestamp } from 'firebase/firestore';

export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Timestamp;
}
