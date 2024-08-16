import * as XLSX from 'xlsx';

import { Application } from 'src/domain/application/application';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';

export const generateExcel = (application: Application, areas: MileageArea[]) => {
  const workbook = XLSX.utils.book_new();

  const studentInfoData = [
    ['학번', application.studentInfo.studentNumber],
    ['이름', application.studentInfo.name],
    ['학부(학과)', application.studentInfo.department],
    ['전공', application.studentInfo.major],
    ['학년', application.studentInfo.grade],
    ['학기', application.studentInfo.semester],
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
        ...area.fields.map((field) => activity.data[field.name]?.toString() ?? ''),
        activity.points.toString(),
      ];
      areaData.push(rowData);
    });

    const areaSheet = XLSX.utils.aoa_to_sheet(areaData);
    XLSX.utils.book_append_sheet(workbook, areaSheet, area.name);
  });

  XLSX.writeFile(workbook, `mileage_scholarship_${application.studentInfo?.studentNumber}.xlsx`);
};
