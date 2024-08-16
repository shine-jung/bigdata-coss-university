import React from 'react';

import { koKR, DataGrid } from '@mui/x-data-grid';

import { useLocales } from 'src/locales';
import { Application } from 'src/domain/application/application';

import Toolbar from 'src/components/toolbar';
import EmptyContent from 'src/components/empty-content';

interface ApplicationTableProps {
  applications: Application[];
  columns: any[];
  loading: boolean;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({ applications, columns, loading }) => {
  const { currentLang } = useLocales();

  const rows = applications.map((application) => ({
    id: application.id,
    studentNumber: application.studentInfo.studentNumber,
    name: application.studentInfo.name,
    department: application.studentInfo.department,
    major: application.studentInfo.major,
    grade: application.studentInfo.grade,
    semester: application.studentInfo.semester,
    email: application.studentInfo.email,
    studentInfo: application.studentInfo,
    activities: application.activities,
    totalScore: application.activities.reduce((total, activity) => total + activity.points, 0),
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
        noRowsOverlay: () => <EmptyContent title="No Data" />,
        noResultsOverlay: () => <EmptyContent title="No results found" />,
      }}
    />
  );
};

export default ApplicationTable;
