import React from 'react';

import { koKR, DataGrid } from '@mui/x-data-grid';

import { useLocales, useTranslate } from 'src/locales';
import { StudentInfo } from 'src/domain/student/student-info';

import Toolbar from 'src/components/toolbar';
import EmptyContent from 'src/components/empty-content';

interface StudentTableProps {
  students: StudentInfo[];
  columns: any[];
  loading: boolean;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, columns, loading }) => {
  const { t } = useTranslate();
  const { currentLang } = useLocales();

  const rows = students.map((student) => ({
    id: student.id,
    studentNumber: student.studentNumber,
    name: student.name,
    department: student.department,
    major: student.major,
    grade: student.grade,
    semester: student.semester,
    email: student.email,
  }));

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      localeText={
        currentLang.value === 'ko' ? koKR.components.MuiDataGrid.defaultProps.localeText : undefined
      }
      loading={loading}
      pageSizeOptions={[5, 10, 25, 50, 100]}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10 },
        },
      }}
      slots={{
        toolbar: Toolbar,
        noRowsOverlay: () => <EmptyContent title={t('common.noData')} />,
      }}
    />
  );
};

export default StudentTable;
