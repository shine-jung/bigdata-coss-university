import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

import {
  Table,
  Stack,
  Button,
  Dialog,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
  DialogContentText,
} from '@mui/material';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { Activity } from 'src/domain/activity/activity';
import { StudentInfo } from 'src/domain/student/student-info';
import { MileageArea } from 'src/domain/mileage-management/mileage-area';

import Iconify from 'src/components/iconify';

import generatePDF from './utils/generate-pdf';
import { STUDENT_INFO_TABLE_HEAD } from '../../domain/student/student-info-table-head';

const PDF_SECTION_ID = 'PDF';

interface UserMileageOverviewProps {
  areas: MileageArea[];
  activities: Activity[];
  year: string;
  semester: string;
  disabled?: boolean;
}

export default function UserMileageOverview({
  areas,
  activities,
  year,
  semester,
  disabled,
}: UserMileageOverviewProps) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const studentInfo = user
    ? ({
        studentNumber: user.studentNumber,
        name: user.name,
        department: user.department,
        major: user.major,
        grade: user.grade,
        semester: user.semester,
        email: user.email,
      } as StudentInfo)
    : null;

  const handleApply = async () => {
    if (!studentInfo) {
      enqueueSnackbar(t('mileageApplication.userInformationNotAvailable'), {
        variant: 'error',
      });
      return;
    }

    try {
      await axios.post('/api/applications', {
        universityCode: user?.university,
        userId: user?.uid,
        year,
        semester,
        activities,
        studentInfo,
      });
      enqueueSnackbar(t('mileageApplication.applicationSubmitSuccess'), { variant: 'success' });
      handleClose();
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar(t('mileageApplication.applicationSubmitError'), { variant: 'error' });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        color="success"
        size="large"
        disabled={disabled}
        startIcon={<Iconify icon="eva:file-text-outline" />}
      >
        {t('mileageApplication.applyForScholarship')}
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>{t('mileageApplication.submitApplication')}</DialogTitle>

        <DialogContent id={PDF_SECTION_ID}>
          <Stack spacing={3}>
            <Typography variant="h5">
              {t('mileageApplication.mileageApplicationForm', { year, semester })}
            </Typography>

            <Stack>
              <Typography variant="h6" gutterBottom>
                {t('mileageApplication.studentInformation')}
              </Typography>
              <TableContainer
                sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
              >
                <Table size="small" stickyHeader>
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
                          {studentInfo?.[head.value as keyof StudentInfo]}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>

            {areas.map((area, index) => {
              const filteredActivities = activities.filter(
                (activity) => activity.area === area.name
              );
              return (
                <Stack key={index}>
                  <Typography variant="h6" gutterBottom>
                    {t('mileageApplication.area', { area: area.name })}
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

            <Stack alignItems="flex-end" mt={3}>
              <Typography variant="subtitle1" gutterBottom>
                {t('mileageApplication.applicationDate', {
                  date: new Date().toLocaleDateString(),
                })}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {t('mileageApplication.applicant', { name: user?.name })}
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="info"
            startIcon={<Iconify icon="bx:bxs-file-pdf" />}
            onClick={() =>
              generatePDF(
                PDF_SECTION_ID,
                `Mileage_Overview_${user?.studentNumber}_${year}_${semester}`
              )
            }
          >
            {t('mileageApplication.downloadPDF')}
          </Button>
          <Button variant="contained" color="success" onClick={handleOpenDialog}>
            {t('mileageApplication.applyForScholarship')}
          </Button>
          <Button variant="contained" color="error" onClick={handleClose}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{t('mileageApplication.confirmApplication')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('mileageApplication.confirmSubmit')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApply} color="success" variant="contained">
            {t('mileageApplication.apply')}
          </Button>
          <Button onClick={handleCloseDialog} color="error" variant="contained">
            {t('common.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
