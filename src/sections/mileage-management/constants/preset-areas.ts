import { MileageArea } from 'src/domain/mileage-management/mileage-area';

export const COURSE_COMPLETION_AREA_INITIAL_NAME = '갈';

export const COURSE_COMPLETION_AREA: MileageArea = {
  name: COURSE_COMPLETION_AREA_INITIAL_NAME,
  defaultPoints: 30,
  fields: [
    { name: '과목코드', type: 'string' },
    { name: '과목명', type: 'string' },
    { name: '년도', type: 'number' },
    { name: '학기', type: 'number' },
    { name: '담당교수', type: 'string' },
    { name: '이수학점', type: 'number' },
    { name: '성적', type: 'string' },
    { name: 'PBL여부', type: 'boolean' },
    { name: '비고', type: 'string' },
  ],
  isCourseCompletion: true,
};

export const OTHER_AREAS: MileageArea[] = [
  {
    name: '매',
    defaultPoints: 10,
    fields: [
      { name: '행사명', type: 'string' },
      { name: '주관대학', type: 'string' },
      { name: '시작일', type: 'date' },
      { name: '종료일', type: 'date' },
      { name: '년도', type: 'number' },
      { name: '학기', type: 'number' },
      { name: '수상내역', type: 'string' },
      { name: '비고', type: 'string' },
    ],
  },
  {
    name: '기',
    defaultPoints: 10,
    fields: [
      { name: '행사명', type: 'string' },
      { name: '주관부처', type: 'string' },
      { name: '시작일', type: 'date' },
      { name: '종료일', type: 'date' },
      { name: '년도', type: 'number' },
      { name: '학기', type: 'number' },
      { name: '참여형태', type: 'string' },
      { name: '수상내역', type: 'string' },
      { name: '비고', type: 'string' },
    ],
  },
  {
    name: '털(산학연구 활동)',
    defaultPoints: 15,
    fields: [
      { name: '분류(현장실습/연구참여)', type: 'string' },
      { name: '기관명', type: 'string' },
      { name: '시작일', type: 'date' },
      { name: '종료일', type: 'date' },
      { name: '내용', type: 'string' },
    ],
  },
  {
    name: '털(자격증 취득)',
    defaultPoints: 30,
    fields: [
      { name: '자격증명', type: 'string' },
      { name: '자격증 발급일', type: 'date' },
      { name: '자격번호', type: 'string' },
      { name: '비고', type: 'string' },
    ],
  },
];
