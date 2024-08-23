export interface MDProcess {
  id: string;
  name: string;
  minStandardCourses: number;
  minLinkedCourses: number;
  minRequiredCredits: number;
  minCompulsoryCredits: number;
  minOptionalCredits: number;
  requiresCompulsoryCourses: boolean;
}
