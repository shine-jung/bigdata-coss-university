export interface MDProcess {
  id: string;
  name: string;
  minStandardCourses: number;
  minLinkedCourses: number;
  minRequiredCredits: number;
  requiresCompulsoryCourses: boolean;
}
