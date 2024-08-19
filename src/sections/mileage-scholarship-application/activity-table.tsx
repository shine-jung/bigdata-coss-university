import React from 'react';

import { koKR, DataGrid, GridActionsCellItem } from '@mui/x-data-grid';

import { useLocales, useTranslate } from 'src/locales';
import { Activity } from 'src/domain/activity/activity';

import Iconify from 'src/components/iconify';
import Toolbar from 'src/components/toolbar';
import EmptyContent from 'src/components/empty-content';

interface ActivityTableProps {
  filteredActivities: Activity[];
  columns: any[];
  activityLoading: boolean;
  handleDeleteClick: (id: string) => void;
}

const ActivityTable: React.FC<ActivityTableProps> = ({
  filteredActivities,
  columns,
  activityLoading,
  handleDeleteClick,
}) => {
  const { t } = useTranslate();
  const { currentLang } = useLocales();

  return (
    <DataGrid
      rows={filteredActivities.map((activity) => ({
        id: activity.id,
        ...activity.data,
      }))}
      columns={columns.map((col) => ({
        ...col,
        getActions:
          col.field === 'actions'
            ? (params: any) => [
                <GridActionsCellItem
                  icon={<Iconify icon="ic:round-delete" />}
                  label="Delete"
                  onClick={() => handleDeleteClick(params.id)}
                />,
              ]
            : col.getActions,
      }))}
      localeText={
        currentLang.value === 'ko' ? koKR.components.MuiDataGrid.defaultProps.localeText : undefined
      }
      loading={activityLoading}
      pageSizeOptions={[5, 10, 25, 50, 100]}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10 },
        },
      }}
      slots={{
        toolbar: Toolbar,
        noRowsOverlay: () => <EmptyContent title={t('mileageApplication.noActivities')} />,
        noResultsOverlay: () => <EmptyContent title={t('common.noResults')} />,
      }}
    />
  );
};

export default ActivityTable;
