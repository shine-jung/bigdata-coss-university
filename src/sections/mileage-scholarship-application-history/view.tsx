'use client';

import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import { Stack, Alert, Skeleton } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useYearSemesterSelector } from 'src/hooks/use-year-semester-selector';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { StudentInfo } from 'src/domain/student/student-info';
import { Application } from 'src/domain/application/application';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';
import { STUDENT_INFO_TABLE_HEAD } from 'src/domain/student/student-info-table-head';

import EmptyContent from 'src/components/empty-content';

import YearSemesterSelector from '../common/year-semester-selector';

// ----------------------------------------------------------------------

export default function MileageScholarshipApplicationHistoryView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { year, semester, yearOptions, setYear, setSemester } = useYearSemesterSelector();
  const userId = user?.uid;
  const universityCode = user?.university;
  const [application, setApplication] = useState<Application | null>(null);
  const [areas, setAreas] = useState<MileageArea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/mileage', {
        params: { universityCode: user?.university, year, semester },
      });
      setAreas(response.data.areas || []);
    } catch (error) {
      enqueueSnackbar('마일리지 데이터를 불러오는 중 오류가 발생했습니다.', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/applications/user', {
        params: {
          universityCode,
          userId,
          year,
          semester,
        },
      });
      setApplication(response.data || null);
    } catch (error) {
      enqueueSnackbar('Failed to load application history.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
    fetchApplicationHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, year, semester]);

  return (
    <Container>
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center" mb={5}>
        <Typography variant="h4">{t('nav.mileageScholarshipApplicationHistory')}</Typography>

        <YearSemesterSelector
          year={year}
          semester={semester}
          setYear={setYear}
          setSemester={setSemester}
          yearOptions={yearOptions}
          size="small"
        />
      </Stack>

      {loading ? (
        <Skeleton variant="rounded" height={500} />
      ) : (
        <>
          {application ? (
            <Stack spacing={3}>
              <Typography variant="h6">
                {t('mileageApplication.applicationHistory', {
                  year,
                  semester,
                })}
              </Typography>

              <Alert severity="info">
                {t('mileageApplication.editApplicationInfo')}
                <br />
                {t('mileageApplication.editCurrentSemesterApplicationInfo')}
              </Alert>

              {application.studentInfo && (
                <Stack>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('mileageApplication.studentInformation')}
                  </Typography>
                  <TableContainer
                    sx={{
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                    }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {STUDENT_INFO_TABLE_HEAD.map((head) => (
                            <TableCell key={head.key} align="center">
                              {head.key}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          {STUDENT_INFO_TABLE_HEAD.map((head) => (
                            <TableCell key={head.key} align="center">
                              {application.studentInfo?.[head.value as keyof StudentInfo]}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}

              {areas.map((area, index) => {
                const filteredActivities =
                  application.activities.filter((activity) => activity.area === area.name) || [];
                const totalPoints = filteredActivities.reduce(
                  (acc, activity) => acc + activity.points,
                  0
                );
                return (
                  <Stack key={index}>
                    <Typography variant="subtitle1" gutterBottom>
                      {t('mileageApplication.areaWithPoints', {
                        area: area.name,
                        points: totalPoints,
                      })}
                    </Typography>
                    <TableContainer
                      sx={{
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                      }}
                    >
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            {area.fields.map((field) => (
                              <TableCell key={field.name} align="center">
                                {field.name}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredActivities.length > 0 ? (
                            filteredActivities.map((activity) => (
                              <TableRow key={activity.id}>
                                {area.fields.map((field, fieldIndex) => {
                                  if (field.type === 'boolean') {
                                    return (
                                      <TableCell key={fieldIndex} align="center">
                                        {activity.data[field.name] ? 'O' : 'X'}
                                      </TableCell>
                                    );
                                  }
                                  return (
                                    <TableCell key={fieldIndex} align="center">
                                      {activity.data[field.name]?.toString()}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={area.fields.length} align="center">
                                {t('mileageApplication.noActivitiesFound')}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                );
              })}
            </Stack>
          ) : (
            <EmptyContent
              title={t('mileageApplication.noApplications')}
              description={t('mileageApplication.noApplicationsDescription')}
            />
          )}
        </>
      )}
    </Container>
  );
}
