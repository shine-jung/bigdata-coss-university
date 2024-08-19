export interface MDProcess {
  id: string;
  name: string;
  minStandardCourses: number;
  minLinkedCourses: number;
  minCompulsoryCourses: number;
  minOptionalCourses: number;
  minRequiredCredits: number;
  requiresCompulsoryCourses: boolean;
}
