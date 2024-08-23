'use client';

import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import { GridActionsCellItem } from '@mui/x-data-grid';
import { Card, Stack, Container, Typography } from '@mui/material';

import { useYearSemesterSelector } from 'src/hooks/use-year-semester-selector';

import { useTranslate } from 'src/locales';
import { AdminGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
import { MDApplication } from 'src/domain/application/md-application';

import Iconify from 'src/components/iconify';

import MDApplicationTable from './md-application-table';
import YearSemesterSelector from '../common/year-semester-selector';
import MDApplicationDetailsDialog from './md-application-details-dialog';

// ----------------------------------------------------------------------

export default function MDCompletionApplicationListView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { year, semester, yearOptions, setYear, setSemester } = useYearSemesterSelector();
  const universityCode = user?.university;

  const [applications, setApplications] = useState<MDApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<MDApplication | null>(null);

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universityCode, year, semester]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/md-applications/university', {
        params: { universityCode, year, semester },
      });
      setApplications(response.data || []);
    } catch (error) {
      enqueueSnackbar('Failed to load applications.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application: MDApplication) => {
    setSelectedApplication(application);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedApplication(null);
  };

  const columns = [
    { field: 'studentNumber', headerName: '학번', flex: 1 },
    { field: 'name', headerName: '이름', flex: 1 },
    { field: 'department', headerName: '학부(학과)', flex: 1 },
    { field: 'major', headerName: '전공', flex: 1 },
    { field: 'grade', headerName: '학년', flex: 1 },
    { field: 'semester', headerName: '학기', flex: 1 },
    { field: 'email', headerName: '이메일', flex: 1 },
    { field: 'processNames', headerName: t('mdApplication.applicationProcess'), flex: 1 },
    {
      field: 'view',
      type: 'actions',
      headerName: t('mdApplication.viewDetails'),
      flex: 1,
      renderCell: (params: any) => (
        <GridActionsCellItem
          icon={<Iconify icon="bx:bxs-info-circle" />}
          label="View Details"
          onClick={() => handleViewDetails(params.row)}
        />
      ),
    },
  ];

  return (
    <AdminGuard>
      <Container>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center" mb={5}>
          <Typography variant="h4">{t('nav.MDCompletionApplicationList')}</Typography>

          <YearSemesterSelector
            year={year}
            semester={semester}
            setYear={setYear}
            setSemester={setSemester}
            yearOptions={yearOptions}
            size="small"
          />
        </Stack>

        <Card sx={{ height: 700 }}>
          <MDApplicationTable applications={applications} columns={columns} loading={loading} />
        </Card>

        <MDApplicationDetailsDialog
          open={openDialog}
          onClose={handleCloseDialog}
          application={selectedApplication}
        />
      </Container>
    </AdminGuard>
  );
}
