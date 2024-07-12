import { Timestamp } from 'firebase/firestore';

export interface Form {
  id: string;
  title: string;
  content: string;
  author: string;
  downloadURL: string;
  fileName: string;
  createdAt: Timestamp;
}
