import { SEMESTER_OPTIONS } from '../constants/semester-constants';

/**
 * 학기 값을 라벨로 변환하는 함수
 * @param semesterValue - 변환할 학기 값 (string | number | undefined)
 * @returns 변환된 학기 라벨 또는 원래 값의 문자열 표현
 */
export const convertSemesterToLabel = (semesterValue: string | number | undefined): string => {
  if (semesterValue == null) return '';

  const stringValue = String(semesterValue);
  const semesterOption = SEMESTER_OPTIONS.find((option) => option.value === stringValue);

  return semesterOption ? semesterOption.label : stringValue;
};
