'use client';

import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import { Card, Container, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';
import { AdminGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
import { StudentInfo } from 'src/domain/student/student-info';

import StudentTable from './student-table';

// ----------------------------------------------------------------------

export default function SchoolManagementView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const universityCode = user?.university;

  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universityCode]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/students', {
        params: { universityCode },
      });
      setStudents(response.data || []);
    } catch (error) {
      enqueueSnackbar('Failed to load students.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'studentNumber', headerName: '학번', flex: 1 },
    { field: 'name', headerName: '이름', flex: 1 },
    { field: 'department', headerName: '학부(학과)', flex: 1 },
    { field: 'major', headerName: '전공', flex: 1 },
    { field: 'grade', headerName: '학년', flex: 1 },
    { field: 'semester', headerName: '학기', flex: 1 },
    { field: 'email', headerName: '이메일', flex: 1 },
  ];

  return (
    <AdminGuard>
      <Container>
        <Typography variant="h4" mb={5}>
          {t('nav.schoolManagement')}
        </Typography>

        <Card sx={{ height: 700 }}>
          <StudentTable students={students} columns={columns} loading={loading} />
        </Card>
      </Container>
    </AdminGuard>
  );
}
