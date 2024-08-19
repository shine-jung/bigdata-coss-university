import { Activity } from '../activity/activity';
import { StudentInfo } from '../student/student-info';

export interface Application {
  id: string;
  activities: Activity[];
  studentInfo: StudentInfo;
}
