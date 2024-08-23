import React from 'react';

import { koKR, DataGrid } from '@mui/x-data-grid';

import { useLocales, useTranslate } from 'src/locales';
import { MDApplication } from 'src/domain/application/md-application';

import Toolbar from 'src/components/toolbar';
import EmptyContent from 'src/components/empty-content';

interface MDApplicationTableProps {
  applications: MDApplication[];
  columns: any[];
  loading: boolean;
}

const MDApplicationTable: React.FC<MDApplicationTableProps> = ({
  applications,
  columns,
  loading,
}) => {
  const { t } = useTranslate();
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
    processNames: application.processNames,
    subjects: application.subjects,
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

export default MDApplicationTable;
