import * as XLSX from 'xlsx';

import { convertSemesterToLabel } from 'src/utils/semester-utils';

import { Application } from 'src/domain/application/application';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';

export const generateExcel = (application: Application, areas: MileageArea[]) => {
  const workbook = XLSX.utils.book_new();

  // 학생 정보 시트에서 학기 값 변환
  const displaySemester = convertSemesterToLabel(application.studentInfo.semester);

  const studentInfoData = [
    ['학번', application.studentInfo.studentNumber],
    ['이름', application.studentInfo.name],
    ['학부(학과)', application.studentInfo.department],
    ['전공', application.studentInfo.major],
    ['학년', application.studentInfo.grade],
    ['학기', displaySemester],
    ['이메일', application.studentInfo.email],
    ['총 점수', application.activities.reduce((total, activity) => total + activity.points, 0)],
  ];
  const studentInfoSheet = XLSX.utils.aoa_to_sheet(studentInfoData);
  XLSX.utils.book_append_sheet(workbook, studentInfoSheet, '학생 정보');

  areas.forEach((area) => {
    const filteredActivities = application.activities.filter(
      (activity) => activity.area === area.name
    );

    const areaData = [['순번', ...area.fields.map((field) => field.name), '점수']];

    filteredActivities.forEach((activity, index) => {
      const rowData = [
        (index + 1).toString(),
        ...area.fields.map((field) => {
          const value = activity.data[field.name];
          if (field.name === '학기') {
            return convertSemesterToLabel(value as string | number | undefined);
          }
          return value?.toString() ?? '';
        }),
        activity.points.toString(),
      ];
      areaData.push(rowData);
    });

    const areaSheet = XLSX.utils.aoa_to_sheet(areaData);
    XLSX.utils.book_append_sheet(workbook, areaSheet, area.name);
  });

  XLSX.writeFile(workbook, `mileage_scholarship_${application.studentInfo?.studentNumber}.xlsx`);
};
