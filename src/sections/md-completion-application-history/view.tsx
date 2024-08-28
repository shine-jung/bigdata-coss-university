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
import { MDApplication } from 'src/domain/application/md-application';
import { STUDENT_INFO_TABLE_HEAD } from 'src/domain/student/student-info-table-head';

import EmptyContent from 'src/components/empty-content';

import YearSemesterSelector from '../common/year-semester-selector';

// ----------------------------------------------------------------------

export default function MdApplicationApplicationHistoryView() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { year, semester, yearOptions, setYear, setSemester } = useYearSemesterSelector();
  const userId = user?.id;
  const universityCode = user?.university;
  const [application, setApplication] = useState<MDApplication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchApplicationHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/md-applications/user', {
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
    fetchApplicationHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, year, semester]);

  return (
    <Container>
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center" mb={5}>
        <Typography variant="h4">{t('nav.MDCompletionApplicationHistory')}</Typography>

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
                {t('mdApplication.applicationHistory', {
                  year,
                  semester,
                })}
              </Typography>

              <Alert severity="info">
                {t('mdApplication.editApplicationInfo')}
                <br />
                {t('mdApplication.editCurrentSemesterApplicationInfo')}
              </Alert>

              {application.studentInfo && (
                <Stack>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('mdApplication.studentInformation')}
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

              {application.processNames && (
                <Stack>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('mdApplication.applicationProcess')}
                  </Typography>

                  <Typography gutterBottom>{application.processNames}</Typography>
                </Stack>
              )}

              <Stack>
                <Typography variant="subtitle1" gutterBottom>
                  {t('mdApplication.subjectInformation')}
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
                        <TableCell align="center">{t('mdApplication.subject.number')}</TableCell>
                        <TableCell align="center">{t('mdApplication.subject.type')}</TableCell>
                        <TableCell align="center">{t('mdApplication.subject.code')}</TableCell>
                        <TableCell align="center">{t('mdApplication.subject.name')}</TableCell>
                        <TableCell align="center">{t('mdApplication.subject.credit')}</TableCell>
                        <TableCell align="center">
                          {t('mdApplication.subject.department')}
                        </TableCell>
                        <TableCell align="center">{t('mdApplication.subject.required')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {application.subjects.length > 0 ? (
                        application.subjects.map((subject, index) => (
                          <TableRow key={subject.id}>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell align="center">{subject.type}</TableCell>
                            <TableCell align="center">{subject.code}</TableCell>
                            <TableCell align="center">{subject.name}</TableCell>
                            <TableCell align="center">{subject.credit}</TableCell>
                            <TableCell align="center">{subject.department}</TableCell>
                            <TableCell align="center">
                              {subject.required
                                ? t('mdApplication.required')
                                : t('mdApplication.optional')}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            {t('mdApplication.noSubjectsFound')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </Stack>
          ) : (
            <EmptyContent
              title={t('mdApplication.noApplications')}
              description={t('mdApplication.noApplicationsDescription')}
            />
          )}
        </>
      )}
    </Container>
  );
}
