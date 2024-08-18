'use client';

import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import { GridActionsCellItem } from '@mui/x-data-grid';
import { Card, Stack, Container, Typography } from '@mui/material';

import { useYearSemesterSelector } from 'src/hooks/use-year-semester-selector';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { Activity } from 'src/domain/activity/activity';
import { Application } from 'src/domain/application/application';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';

import Iconify from 'src/components/iconify';

import ApplicationTable from './application-table';
import { generateExcel } from './utils/generate-excel';
import ApplicationDetailsDialog from './application-details-dialog';
import YearSemesterSelector from '../common/year-semester-selector';

export default function MileageScholarshipApplicationListView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { year, semester, yearOptions, setYear, setSemester } = useYearSemesterSelector();
  const universityCode = user?.university;

  const [areas, setAreas] = useState<MileageArea[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchAreas();
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universityCode, year, semester]);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/mileage', {
        params: { universityCode, year, semester },
      });
      setAreas(response.data.areas || []);
    } catch (error) {
      enqueueSnackbar('Failed to load mileage areas.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/applications/university', {
        params: { universityCode, year, semester },
      });
      setApplications(response.data || []);
    } catch (error) {
      enqueueSnackbar('Failed to load applications.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setOpenDialog(true);
  };

  const handleDownloadExcel = (application: Application) => {
    generateExcel(application, areas);
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
    {
      field: 'totalScore',
      headerName: '총 점수',
      flex: 1,
      valueGetter: (params: any) =>
        params.row.activities.reduce(
          (total: number, activity: Activity) => total + activity.points,
          0
        ),
    },
    {
      field: 'view',
      type: 'actions',
      headerName: '상세 정보',
      flex: 1,
      renderCell: (params: any) => (
        <GridActionsCellItem
          icon={<Iconify icon="bx:bxs-info-circle" />}
          label="View Details"
          onClick={() => handleViewDetails(params.row)}
        />
      ),
    },
    {
      field: 'excel',
      type: 'actions',
      headerName: '엑셀 다운로드',
      flex: 1,
      renderCell: (params: any) => (
        <GridActionsCellItem
          icon={<Iconify icon="bx:bxs-download" />}
          label="Download Excel"
          onClick={() => handleDownloadExcel(params.row)}
        />
      ),
    },
  ];

  return (
    <Container>
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center" mb={5}>
        <Typography variant="h4">{t('nav.mileageScholarshipApplicationList')}</Typography>

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
        <ApplicationTable applications={applications} columns={columns} loading={loading} />
      </Card>

      <ApplicationDetailsDialog
        open={openDialog}
        onClose={handleCloseDialog}
        application={selectedApplication}
        areas={areas}
      />
    </Container>
  );
}
