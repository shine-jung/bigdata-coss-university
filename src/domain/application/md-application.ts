import { Subject } from '../md-process/subject';
import { StudentInfo } from '../student/student-info';

export interface MDApplication {
  id: string;
  processNames: string[];
  subjects: Subject[];
  studentInfo: StudentInfo;
}
